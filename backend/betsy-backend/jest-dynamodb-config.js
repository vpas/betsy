module.exports = {
  tables: [
    {
      TableName: "betsy_users",
      KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
      AttributeDefinitions: [
        {AttributeName: 'id', AttributeType: 'S'},
        // {AttributeName: 'email', AttributeType: 'S'},
        // {AttributeName: 'username', AttributeType: 'S'},
        // {AttributeName: 'stars', AttributeType: 'N'},
      ],
      ProvisionedThroughput: {ReadCapacityUnits: 2, WriteCapacityUnits: 2},
    },
  ],
  port: 8000,
  options: [
    '-inMemory',
  ],
};