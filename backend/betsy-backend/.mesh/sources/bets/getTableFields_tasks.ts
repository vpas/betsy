// @ts-nocheck
export default {
  "id": {
    "Field": "id",
    "Type": "int",
    "Collation": null,
    "Null": "NO",
    "Key": "PRI",
    "Default": null,
    "Extra": "auto_increment",
    "Privileges": "select,insert,update,references",
    "Comment": ""
  },
  "created_by": {
    "Field": "created_by",
    "Type": "int",
    "Collation": null,
    "Null": "NO",
    "Key": "",
    "Default": null,
    "Extra": "",
    "Privileges": "select,insert,update,references",
    "Comment": ""
  },
  "title": {
    "Field": "title",
    "Type": "varchar(45)",
    "Collation": "utf8mb4_0900_ai_ci",
    "Null": "NO",
    "Key": "",
    "Default": null,
    "Extra": "",
    "Privileges": "select,insert,update,references",
    "Comment": ""
  },
  "description": {
    "Field": "description",
    "Type": "varchar(500)",
    "Collation": "utf8mb4_0900_ai_ci",
    "Null": "YES",
    "Key": "",
    "Default": null,
    "Extra": "",
    "Privileges": "select,insert,update,references",
    "Comment": ""
  },
  "state": {
    "Field": "state",
    "Type": "enum('accept_bets','bets_finalized','in_progress','done','abandoned')",
    "Collation": "utf8mb4_0900_ai_ci",
    "Null": "NO",
    "Key": "",
    "Default": null,
    "Extra": "",
    "Privileges": "select,insert,update,references",
    "Comment": ""
  },
  "started_at": {
    "Field": "started_at",
    "Type": "datetime",
    "Collation": null,
    "Null": "YES",
    "Key": "",
    "Default": null,
    "Extra": "",
    "Privileges": "select,insert,update,references",
    "Comment": ""
  }
}