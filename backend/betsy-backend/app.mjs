import { 
  DynamoDBClient, 
  GetItemCommand, 
  PutItemCommand,
  UpdateItemCommand,
  ScanCommand, 
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { v4 as uuidv4 } from 'uuid';

const dbClient = new DynamoDBClient({ region: "eu-central-1" });

export const TASK_STATES = {
  ACCEPT_BETS: 'accept_bets',
  BETS_FINALIZED: 'bets_finalized',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  ABANDONED: 'abandoned',
};

export const TASK_STATES_ACTIVE = new Set([
  TASK_STATES.ACCEPT_BETS,
  TASK_STATES.BETS_FINALIZED,
  TASK_STATES.IN_PROGRESS,
]);

export const BET_CONDITION = {
  DONE_IN_TIME: 'done_in_time',
  NOT_DONE_IN_TIME: 'not_done_in_time',
}

export const usersHandler = async (event, context) => {
  let statusCode = 200;
  let responseBody = "";
  try {
    console.log(event.pathParameters);
    console.log("fetching data from dynamodb");
    let command;
    const commandInput = { TableName: "betsy_users" };
    if (event.pathParameters !== null && event.pathParameters.id !== null) {
      const id = event.pathParameters.id;
      command = new GetItemCommand({
        ...commandInput,
        "Key": {"id": {"S": id}},
      });
      const response = await dbClient.send(command);
      // console.log(JSON.stringify(response.Item));
      const user = unmarshall(response.Item);
      responseBody = JSON.stringify(user);
    } else {
      command = new ScanCommand(commandInput);
      const response = await dbClient.send(command);
      // console.log(JSON.stringify(response));
      const users = response.Items.map(i => unmarshall(i));
      responseBody = JSON.stringify(users);
    }
    
  } catch(e) {
    console.log(e);
    responseBody = e.toString();
    statusCode = 500;
  }

  return {
    "statusCode": statusCode,
    "headers": {
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
        command = new GetItemCommand({
          ...commandInput,
          "Key": {"id": {"S": id}},
        });
        const response = await dbClient.send(command);
        // console.log(JSON.stringify(response.Item));
        const task = unmarshall(response.Item);
        responseBody = JSON.stringify(task);
      } else if (event.httpMethod === 'POST') {
        command = new UpdateItemCommand({
          ...commandInput,
          "Key": {"id": {"S": id}},
          "UpdateExpression": "SET title = :title, description = :description",
          "ExpressionAttributeValues": {
            ":title": { "S": requestBody.title },
            ":description": { "S": requestBody.description },
          },
        });
        await dbClient.send(command);
      }
    } else {
      command = new ScanCommand(commandInput);
      const response = await dbClient.send(command);
      // console.log(JSON.stringify(response));
      const tasks = response.Items.map(i => unmarshall(i));
      responseBody = JSON.stringify(tasks);
    }
    
  } catch(e) {
    console.log(e);
    responseBody = e.toString();
    statusCode = 500;
  }

  return {
    "statusCode": statusCode,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": responseBody
  }
};

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
        command = new GetItemCommand({
          ...commandInput,
          "Key": {"id": {"S": id}},
        });
        const response = await dbClient.send(command);
        // console.log(JSON.stringify(response.Item));
        const bet = unmarshall(response.Item);
        responseBody = JSON.stringify(bet);
      } else if (event.httpMethod === 'POST') {
        command = new UpdateItemCommand({
          ...commandInput,
          "Key": {"id": {"S": id}},
          "UpdateExpression": "SET bet_amount = :amount, term_hours = :hours",
          "ExpressionAttributeValues": {
            ":amount": { "N": requestBody.bet_amount.toString() },
            ":hours": { "N": requestBody.term_hours.toString() },
          },
        });
        await dbClient.send(command);
      }
    } else {
      if (event.httpMethod === 'GET') {
        command = new ScanCommand(commandInput);
        const response = await dbClient.send(command);
        // console.log(JSON.stringify(response));
        const bets = response.Items.map(i => unmarshall(i));
        responseBody = JSON.stringify(bets);
      } else if (event.httpMethod === 'POST') {
        const bet = requestBody;
        bet.id = uuidv4();
        bet.bet_condition = BET_CONDITION.NOT_DONE_IN_TIME;
        command = new PutItemCommand({
          ...commandInput,
          "Item": marshall(bet)
        });
        await dbClient.send(command);
        responseBody = JSON.stringify(bet);
      }
    }
    
  } catch(e) {
    console.log(e);
    responseBody = e.toString();
    statusCode = 500;
  }

  return {
    "statusCode": statusCode,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": responseBody
  }
};

async function createTaskWithBet(task, bet) {
  task.id = uuidv4();
  task.state = TASK_STATES.ACCEPT_BETS;
  
  bet.id = uuidv4();
  bet.task_id = task.id;
  bet.created_by = task.created_by;
  bet.bet_condition = BET_CONDITION.DONE_IN_TIME;

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
      const task = requestBody.task;
      const bet = requestBody.bet;
      await createTaskWithBet(task, bet);
      responseBody = {
        "task": task,
        "bet": bet,
      }
    } else if (event.path === "/actions/set_task_state") {
    }
  } catch(e) {
    console.log(e);
    responseBody = e.toString();
    statusCode = 500;
  }

  return {
    "statusCode": statusCode,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": responseBody
  }
};