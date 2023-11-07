import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
  ScanCommand,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { v4 as uuidv4 } from 'uuid';
import webpush from 'web-push'

const DEFAULT_HEADERS = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
}

const APPLICATION_SERVER_PUBLIC_KEY = 'BD6ZoPSDZZrIgJtvm165IwgWLg9aXSYy-LrCwP9yiQEJ9CaVL9K8HQtzHmbjzrWAGMeWMDqTgNDKwmy92i7T3FY';
const APPLICATION_SERVER_PRIVATE_KEY = '5_w50ieO879qyCYuTkmjC_Gbb6u7ZWClSsy-LFB3ecc';

const dbClient = new DynamoDBClient({ region: "eu-central-1" });

export const TASK_STATES = {
  ACCEPT_BETS: 'accept_bets',
  BETS_FINALIZED: 'bets_finalized',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  DONE_OVERTIME: 'done_overtime',
  ABANDONED: 'abandoned',
};

const TASK_EXPECTED_PREV_STATES = {
  [TASK_STATES.BETS_FINALIZED]: [TASK_STATES.ACCEPT_BETS],
  [TASK_STATES.IN_PROGRESS]: [TASK_STATES.BETS_FINALIZED],
  [TASK_STATES.DONE]: [TASK_STATES.IN_PROGRESS],
  [TASK_STATES.ABANDONED]: [TASK_STATES.ACCEPT_BETS, TASK_STATES.BETS_FINALIZED, TASK_STATES.IN_PROGRESS],
}

export const TASK_STATES_ACTIVE = new Set([
  TASK_STATES.ACCEPT_BETS,
  TASK_STATES.BETS_FINALIZED,
  TASK_STATES.IN_PROGRESS,
]);

export const BET_CONDITION = {
  DONE_IN_TIME: 'done_in_time',
  NOT_DONE_IN_TIME: 'not_done_in_time',
}

export async function getUser(id) {
  const command = new GetItemCommand({
    TableName: "betsy_users",
    Key: { "id": { "S": id } },
  });
  const response = await dbClient.send(command);
  const user = unmarshall(response.Item);
  return user;
}

export async function getAllUsers({ groupId }) {
  const command = new ScanCommand({
    TableName: "betsy_users",
    FilterExpression: "group_id = :group_id",
    ExpressionAttributeValues: {
      ":group_id": { "S": groupId },
    },
    ConsistentRead: true,
  });
  const response = await dbClient.send(command);
  return response.Items.map(i => unmarshall(i));
}

export async function getGroup(id) {
  const command = new GetItemCommand({
    TableName: "betsy_groups",
    Key: { "id": { "S": id } },
  });
  const response = await dbClient.send(command);
  const group = unmarshall(response.Item);
  return group;
}

export async function getAllGroups() {
  const command = new ScanCommand({
    TableName: "betsy_groups",
    ConsistentRead: true,
  });
  const response = await dbClient.send(command);
  return response.Items.map(i => unmarshall(i));
}

export async function login(loginData) {
  const response = await dbClient.send(new ScanCommand({
    TableName: "betsy_users",
    ConsistentRead: true,
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": { "S": loginData.email },
    },
  }));
  const loginResponse = {};
  const users = response.Items.map(i => unmarshall(i));
  if (users.length === 0) {
    loginResponse.message = "No user found";
  } else if (users.length > 1) {
    loginResponse.message = "Multiple users found";
  } else {
    loginResponse.user = users[0];
  }
  return loginResponse;
}


export const groupsHandler = async (event, context) => {
  let statusCode = 200;
  let responseBody = "";

  try {
    console.log(event.pathParameters);
    console.log("fetching data from dynamodb");
    if (event.pathParameters !== null && event.pathParameters.id !== null) {
      const id = event.pathParameters.id;

      const group = await getGroup(id);
      responseBody = JSON.stringify(group);
    } else {
      const groups = await getAllGroups();
      responseBody = JSON.stringify(groups);
    }

  } catch (e) {
    console.log(e);
    responseBody = e.toString();
    statusCode = 500;
  }

  return {
    "statusCode": statusCode,
    "headers": {
      ...DEFAULT_HEADERS,
      "Content-Type": "application/json"
    },
    "body": responseBody
  }
};

export const usersHandler = async (event, context) => {
  let statusCode = 200;
  let responseBody = "";

  let requestBody = null;
  if (event.body) {
    requestBody = JSON.parse(event.body);
    console.log("requestBody: \n" + JSON.stringify(requestBody));
  }

  try {
    console.log(event.pathParameters);
    console.log("fetching data from dynamodb");
    let command;
    if (event.path === "/users/login") {
      responseBody = JSON.stringify(await login(requestBody))
    } else if (event.pathParameters !== null && event.pathParameters.id !== null) {
      const id = event.pathParameters.id;
      if (event.path.endsWith('sub') && event.httpMethod === 'POST') {
        command = new UpdateItemCommand({
          TableName: "betsy_users",
          Key: { "id": { "S": id } },
          UpdateExpression: "SET subscription = :subscription",
          ExpressionAttributeValues: marshall({
            ":subscription": requestBody,
          }),
        });
        await dbClient.send(command);
        responseBody = JSON.stringify({
          message: "Successfully updated user subscription",
        });
      } else {
        const user = await getUser(id);
        responseBody = JSON.stringify(user);
      }
    } else {
      const users = await getAllUsers({ groupId: requestBody.group_id });
      responseBody = JSON.stringify(users);
    }

  } catch (e) {
    console.log(e);
    responseBody = e.toString();
    statusCode = 500;
  }

  return {
    "statusCode": statusCode,
    "headers": {
      ...DEFAULT_HEADERS,
      "Content-Type": "application/json"
    },
    "body": responseBody
  }
};

export const tasksHandler = async (event, context) => {
  let statusCode = 200;
  let responseBody = "";
  try {
    console.log(event.pathParameters);

    let requestBody = null;
    if (event.body) {
      requestBody = JSON.parse(event.body);
      console.log("requestBody: \n" + JSON.stringify(requestBody));
    }

    console.log("fetching data from dynamodb");
    let command;
    const commandInput = { TableName: "betsy_tasks" };
    if (event.pathParameters !== null && event.pathParameters.id !== null) {
      const id = event.pathParameters.id;
      if (event.httpMethod === 'GET') {
        if (event.path.endsWith('bets')) {
          const bets = await getAllTaskBets(id);
          responseBody = JSON.stringify(bets);
        } else {
          command = new GetItemCommand({
            ...commandInput,
            "Key": { "id": { "S": id } },
          });
          const response = await dbClient.send(command);
          // console.log(JSON.stringify(response.Item));
          const task = unmarshall(response.Item);
          responseBody = JSON.stringify(task);
        }
      } else if (event.httpMethod === 'POST') {
        command = new UpdateItemCommand({
          ...commandInput,
          Key: { "id": { "S": id } },
          UpdateExpression: "SET title = :title, description = :description, updated_at = :updated_at",
          ConditionExpression: "task_state = :task_state",
          ExpressionAttributeValues: {
            ":title": { "S": requestBody.title },
            ":description": { "S": requestBody.description },
            ":task_state": { "S": TASK_STATES.ACCEPT_BETS },
            ":updated_at": { "S": new Date().toISOString() },
          },
        });
        await dbClient.send(command);
        // const task = await getTask(id);
        // await sendNotifications({ 
        //   message: `task "${task.title}" updated`,
        //   taskId: task.id,
        //   excludeUserId: task.created_by,
        // });
      }
    } else {
      const groupId = requestBody.group_id;
      command = new ScanCommand({
        ...commandInput,
        FilterExpression: "group_id = :group_id",
        ExpressionAttributeValues: {
          ":group_id": { "S": groupId },
        },
        ConsistentRead: true,

      });
      const response = await dbClient.send(command);
      // console.log(JSON.stringify(response));
      const tasks = response.Items.map(i => unmarshall(i));
      responseBody = JSON.stringify(tasks);
    }

  } catch (e) {
    console.log(e);
    responseBody = e.toString();
    statusCode = 500;
  }

  return {
    statusCode: statusCode,
    headers: {
      ...DEFAULT_HEADERS,
      "Content-Type": "application/json"
    },
    body: responseBody
  }
};

async function createBet(bet) {
  const user = await getUser(bet.created_by);

  bet.id = uuidv4();
  bet.bet_condition = BET_CONDITION.NOT_DONE_IN_TIME;
  bet.created_at = new Date().toISOString();
  bet.updated_at = new Date().toISOString();
  bet.group_id = user.group_id;

  const input = { // TransactWriteItemsInput
    TransactItems: [
      { // TransactWriteItem
        Put: {
          TableName: "betsy_bets",
          Item: marshall(bet),
        },
      },
      {
        ConditionCheck: {
          TableName: "betsy_tasks",
          Key: { "id": { "S": bet.task_id } },
          ConditionExpression: "task_state = :task_state",
          ExpressionAttributeValues: {
            ":task_state": { "S": TASK_STATES.ACCEPT_BETS },
          },
        },
      },
    ],
    // TODO
    // ClientRequestToken: "STRING_VALUE",
  };
  const command = new TransactWriteItemsCommand(input);
  await dbClient.send(command);
}

async function updateBet(updateData) {
  const bet = await getBet(updateData.id);
  bet.term_hours = updateData.term_hours;
  bet.bet_amount = updateData.bet_amount;
  const input = { // TransactWriteItemsInput
    TransactItems: [
      { // TransactWriteItem
        Update: {
          TableName: "betsy_bets",
          Key: { "id": { "S": bet.id } },
          UpdateExpression: "SET bet_amount = :amount, term_hours = :hours, updated_at = :updated_at",
          ExpressionAttributeValues: {
            ":amount": { "N": bet.bet_amount.toString() },
            ":hours": { "N": bet.term_hours.toString() },
            ":updated_at": { "S": new Date().toISOString() },
          },
        },
      },
      {
        ConditionCheck: {
          TableName: "betsy_tasks",
          Key: { "id": { "S": bet.task_id } },
          ConditionExpression: "task_state = :task_state",
          ExpressionAttributeValues: {
            ":task_state": { "S": TASK_STATES.ACCEPT_BETS },
          },
        },
      },
    ],
    // TODO
    // ClientRequestToken: "STRING_VALUE",
  };
  const command = new TransactWriteItemsCommand(input);
  await dbClient.send(command);
}

export async function getBet(id) {
  const command = new GetItemCommand({
    TableName: "betsy_bets",
    Key: { "id": { "S": id } },
  });
  const response = await dbClient.send(command);
  const bet = unmarshall(response.Item);
  return bet;
}

export const betsHandler = async (event, context) => {
  let statusCode = 200;
  let responseBody = "";
  try {
    console.log(event.pathParameters);
    console.log(event.httpMethod);
    let requestBody = null;
    if (event.body) {
      requestBody = JSON.parse(event.body);
      console.log("requestBody: \n" + JSON.stringify(requestBody));
    }
    console.log("fetching data from dynamodb");
    let command;
    const commandInput = { TableName: "betsy_bets" };
    if (event.pathParameters !== null && event.pathParameters.id !== null) {
      const id = event.pathParameters.id;
      if (event.httpMethod === 'GET') {
        const bet = await getBet(id);
        responseBody = JSON.stringify(bet);
      } else if (event.httpMethod === 'POST') {
        const updateData = {
          id: id,
          bet_amount: requestBody.bet_amount,
          term_hours: requestBody.term_hours,
        }
        await updateBet(updateData);

        const bet = await getBet(id);
        const task = await getTask(bet.task_id);
        await sendNotifications({
          message: `Task "${task.title}" updated`,
          taskId: task.id,
          excludeUserId: bet.created_by,
          groupId: task.group_id,
        });
      }
    } else {
      if (event.httpMethod === 'GET') {
        const groupId = requestBody.group_id;
        command = new ScanCommand({
          ...commandInput,
          FilterExpression: "group_id = :group_id",
          ExpressionAttributeValues: {
            ":group_id": { "S": groupId },
          },
          ConsistentRead: true,
        });
        const response = await dbClient.send(command);
        // console.log(JSON.stringify(response));
        const bets = response.Items.map(i => unmarshall(i));
        responseBody = JSON.stringify(bets);
      } else if (event.httpMethod === 'POST') {
        const bet = requestBody;
        await createBet(bet);

        const task = await getTask(bet.task_id);
        await sendNotifications({
          message: `New bet for task "${task.title}"`,
          taskId: task.id,
          excludeUserId: bet.created_by,
          groupId: task.group_id,
        });

        responseBody = JSON.stringify(bet);
      }
    }

  } catch (e) {
    console.log(e);
    responseBody = e.toString();
    statusCode = 500;
  }

  return {
    "statusCode": statusCode,
    "headers": {
      ...DEFAULT_HEADERS,
      "Content-Type": "application/json"
    },
    "body": responseBody
  }
};

async function createTaskWithBet(task, bet) {
  const user = getUser(task.created_by);

  task.id = uuidv4();
  task.task_state = TASK_STATES.ACCEPT_BETS;
  task.created_at = new Date().toISOString();
  task.updated_at = new Date().toISOString();
  task.group_id = user.group_id;

  bet.id = uuidv4();
  bet.task_id = task.id;
  bet.created_by = task.created_by;
  bet.bet_condition = BET_CONDITION.DONE_IN_TIME;
  bet.created_at = new Date().toISOString();
  bet.updated_at = new Date().toISOString();
  bet.group_id = user.group_id;

  const input = { // TransactWriteItemsInput
    TransactItems: [
      { // TransactWriteItem
        Put: {
          Item: marshall(task),
          TableName: "betsy_tasks",
        },
      },
      { // TransactWriteItem
        Put: {
          Item: marshall(bet),
          TableName: "betsy_bets",
        },
      },
    ],
    // TODO
    // ClientRequestToken: "STRING_VALUE",
  };
  const command = new TransactWriteItemsCommand(input);
  const response = await dbClient.send(command);

  return {
    task: task,
    bet: bet,
  }
}

async function getTask(id) {
  const command = new GetItemCommand({
    TableName: "betsy_tasks",
    Key: { "id": { "S": id } },
  });
  const response = await dbClient.send(command);
  return unmarshall(response.Item);
}

function getTaskOwnerBet(bets) {
  return bets.find(b => b.bet_condition === BET_CONDITION.DONE_IN_TIME);
}

async function getAllTaskBets(taskId) {
  const command = new ScanCommand({
    TableName: "betsy_bets",
    ConsistentRead: true,
    FilterExpression: "task_id = :task_id",
    ExpressionAttributeValues: {
      ":task_id": { "S": taskId },
    },
  });
  const response = await dbClient.send(command);
  const bets = response.Items.map(i => unmarshall(i));
  return bets;
}

function calcFinalPayout({ bets, wasFinishedInTime }) {
  const ownerBet = getTaskOwnerBet(bets);
  if (bets.length === 1) {
    bets[0].final_payout = 0;
  } else {
    const isActive = b => b.term_hours >= ownerBet.term_hours;
    const activeBets = bets.filter(isActive);
    const total = activeBets.reduce((sum, b) => sum + b.bet_amount, 0);
    const totalAgainst = total - ownerBet.bet_amount;
    bets.forEach(b => {
      if (b.id === ownerBet.id) {
        if (wasFinishedInTime) {
          b.final_payout = totalAgainst;
        } else {
          b.final_payout = -b.bet_amount;
        }
      } else if (isActive(b)) {
        if (wasFinishedInTime) {
          b.final_payout = -b.bet_amount;
        } else {
          b.final_payout = Math.ceil(ownerBet.bet_amount * (b.bet_amount / totalAgainst));
        }
      } else {
        b.final_payout = 0;
      }
    });
  }
}

async function onTaskClosed({ id, wasFinishedInTime, ownerBonus, input }) {
  const bets = await getAllTaskBets(id);
  const ownerBet = getTaskOwnerBet(bets);
  calcFinalPayout({
    bets: bets,
    wasFinishedInTime: wasFinishedInTime,
  });
  bets.forEach(b => {
    input.TransactItems.push({ // TransactWriteItem
      Update: {
        TableName: "betsy_bets",
        Key: { "id": { "S": b.id } },
        UpdateExpression: "SET final_payout = :final_payout, updated_at = :updated_at",
        ExpressionAttributeValues: {
          ":final_payout": { "N": b.final_payout.toString() },
          ":updated_at": { "S": new Date().toISOString() },
        },
      }
    });
    let payout = b.final_payout;
    if (b.id === ownerBet.id) {
      payout += ownerBonus;
    }
    input.TransactItems.push({ // TransactWriteItem
      Update: {
        TableName: "betsy_users",
        Key: { "id": { "S": b.created_by } },
        UpdateExpression: "SET stars = stars + :final_payout",
        ExpressionAttributeValues: {
          ":final_payout": { "N": payout.toString() },
        },
      }
    });
  });
}

export function millisecToHours(millisec) {
  return millisec / 1000 / 60 / 60;
}

function hoursSince(sinceDate) {
  return millisecToHours(new Date() - sinceDate);
}

async function setTaskState(id, newState) {
  console.log(`TASK_EXPECTED_PREV_STATES[newState]: ${TASK_EXPECTED_PREV_STATES[newState]}`);
  const expectedPrevStates = new Map(TASK_EXPECTED_PREV_STATES[newState].map(s => [`:task_state_${s}`, { "S": s }]));
  const expectedPrevStatesStr = Array.from(expectedPrevStates.keys()).join(',');
  const input = { // TransactWriteItemsInput
    TransactItems: [
      { // TransactWriteItem
        Update: {
          TableName: "betsy_tasks",
          Key: { "id": { "S": id } },
          UpdateExpression: "SET task_state = :task_state, updated_at = :updated_at",
          ConditionExpression: `task_state IN (${expectedPrevStatesStr})`,
          ExpressionAttributeValues: {
            ...Object.fromEntries(expectedPrevStates.entries()),
            ":task_state": { "S": newState },
            ":updated_at": { "S": new Date().toISOString() },
          },
        },
      },
    ],
    // TODO
    // ClientRequestToken: "STRING_VALUE",
  };

  if (newState === TASK_STATES.IN_PROGRESS) {
    input.TransactItems[0].Update.UpdateExpression += ", started_at = :started_at";
    input.TransactItems[0].Update.ExpressionAttributeValues[":started_at"] = { "S": new Date().toISOString() };
  } else if (newState === TASK_STATES.DONE) {
    const task = await getTask(id);
    const ownerBet = getTaskOwnerBet(await getAllTaskBets(id));
    const wasFinishedInTime = hoursSince(new Date(task.started_at)) <= ownerBet.term_hours;
    if (!wasFinishedInTime) {
      input.TransactItems[0].Update.ExpressionAttributeValues[":task_state"]["S"] = TASK_STATES.DONE_OVERTIME;
    }
    await onTaskClosed({
      id: id,
      wasFinishedInTime: wasFinishedInTime,
      ownerBonus: ownerBet.term_hours,
      input: input,
    });
  } else if (newState === TASK_STATES.ABANDONED) {
    const task = await getTask(id);
    if (task.state !== TASK_STATES.ACCEPT_BETS) {
      await onTaskClosed({
        id: id,
        wasFinishedInTime: false,
        ownerBonus: 0,
        input: input,
      });
    }
  }
  const command = new TransactWriteItemsCommand(input);
  await dbClient.send(command);
}

async function getAllUsersInvolved(taskId) {
  const bets = await getAllTaskBets(taskId);
  return await Promise.all(bets.map(b => getUser(b.created_by)));
}

async function sendNotifications({
  taskId,
  message,
  excludeUserId,
  notifyAll = false,
  groupId,
}) {
  let users;
  if (notifyAll) {
    users = await getAllUsers({ groupId: groupId });
  } else {
    users = await getAllUsersInvolved(taskId);
  }
  const data = {
    title: "Betsy",
    body: message,
    task_id: taskId,
  };
  for (const user of users) {
    if (user.subscription && user.id !== excludeUserId) {
      const options = {
        vapidDetails: {
          subject: 'https://betsytasks.site',
          publicKey: APPLICATION_SERVER_PUBLIC_KEY,
          privateKey: APPLICATION_SERVER_PRIVATE_KEY,
        },
        // 1 hour in seconds.
        TTL: 60 * 60
      };

      try {
        console.log(JSON.stringify(user.subscription));
        await webpush.sendNotification(
          user.subscription,
          JSON.stringify(data),
          options
        );
      } catch (error) {
        console.log(`Error while sending notification to user with id: ${user.id}. Error: ${error}`);
      }
    }
  }
}

export const actionsHandler = async (event, context) => {
  let statusCode = 200;
  let responseBody = "";
  try {
    console.log("actionsHandler");
    console.log(event.path);
    console.log(event.pathParameters);
    const requestBody = JSON.parse(event.body);
    console.log("requestBody: \n" + JSON.stringify(requestBody));
    if (event.path === "/actions/create_task_with_bet") {
      const { task, bet } = await createTaskWithBet(requestBody.task, requestBody.bet);
      responseBody = JSON.stringify({
        "task": task,
        "bet": bet,
      });
      await sendNotifications({
        message: `New task ${task.title}`,
        taskId: task.id,
        excludeUserId: task.created_by,
        notifyAll: true,
        groupId: task.groupId,
      });
    } else if (event.path === "/actions/set_task_state") {
      const id = requestBody.id;
      const newState = requestBody.task_state;
      await setTaskState(id, newState);
      const task = await getTask(id);
      await sendNotifications({
        message: `Task "${task.title}" updated`,
        taskId: task.id,
        excludeUserId: task.created_by,
        groupId: task.groupId,
      });
    }
  } catch (e) {
    console.log(e);
    responseBody = e.toString();
    statusCode = 500;
  }

  return {
    "statusCode": statusCode,
    "headers": {
      ...DEFAULT_HEADERS,
      "Content-Type": "application/json"
    },
    "body": responseBody
  }
};