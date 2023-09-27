export const handler = async (event, context) => {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  // return context.logStreamName;
  const body = "SPARTA";
  return {
    "statusCode": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": body
  }
};