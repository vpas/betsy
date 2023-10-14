import {
  millisecToHours,
  getUser,
} from "./app.mjs";

// const millisecToHours = require('./app');
// import('./app.mjs').then(() => {
// });

test("Test millisecToHours", () => {
  expect(millisecToHours(23012003)).toBe(6.392223055555556);
});


const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');

const isTest = process.env.JEST_WORKER_ID;

const client = new DynamoDB({
  ...(isTest && {
    endpoint: 'localhost:8000',
    sslEnabled: false,
    region: 'local',
    credentials: {
      accessKeyId: 'fakeMyKeyId',
      secretAccessKey: 'fakeSecretAccessKey',
    },
  }),
});

const ddb = DynamoDBDocument.from(
  client,
  {
    marshallOptions: {
      convertEmptyValues: true,
    },
  }
);

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// it('should get user by id', async () => {
//   // await delay(30000);
//   await ddb.put({TableName: 'betsy_users', Item: {id: '1', username: 'User One'}})
//   // const user = await getUser('1');
//   const user = await getUser('6a1f721d-9688-4e42-a06a-c2f9d9aba717');
//   expect(user).toEqual({
//     id: '1',
//     username: 'User One',
//   });
// });

// afterAll(() => {
//   client.destroy();
// });

// const DynamoDbLocal = require('dynamodb-local');
// const dynamoLocalPort = 8001;

// DynamoDbLocal.launch(dynamoLocalPort, null, ['-sharedDb']) //if you want to share with Javascript Shell
//   .then(function () {

//     // do your tests

//     DynamoDbLocal.stop(dynamoLocalPort);
//   });