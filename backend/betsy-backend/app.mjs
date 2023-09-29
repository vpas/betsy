import { 
  DynamoDBClient, 
  ScanCommand, 
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

const dbClient = new DynamoDBClient({ region: "eu-central-1" });

export const handler = async (event, context) => {
  let statusCode = 200;
  let body = "nobody";
  try {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    console.log("fetching data from dynamodb");
    const scanUsersCommand = new ScanCommand({TableName: "betsy_users"});
    const response = await dbClient.send(scanUsersCommand);
    const users = response.Items.map(i => unmarshall(i));
    body = JSON.stringify(users);
  } catch(e) {
    console.log(e);
    body = e.toString();
    statusCode = 500;
  }

  return {
    "statusCode": statusCode,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": body
  }
};