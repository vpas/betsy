// @ts-nocheck
export default {
  "id": {
    "Field": "id",
    "Type": "int",
    "Collation": null,
    "Null": "NO",
    "Key": "PRI",
    "Default": null,
    "Extra": "",
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
  "accepted_by": {
    "Field": "accepted_by",
    "Type": "int",
    "Collation": null,
    "Null": "YES",
    "Key": "",
    "Default": null,
    "Extra": "",
    "Privileges": "select,insert,update,references",
    "Comment": ""
  },
  "mirror_bet_id": {
    "Field": "mirror_bet_id",
    "Type": "int",
    "Collation": null,
    "Null": "YES",
    "Key": "MUL",
    "Default": null,
    "Extra": "",
    "Privileges": "select,insert,update,references",
    "Comment": ""
  },
  "bet_condition": {
    "Field": "bet_condition",
    "Type": "enum('done_in_time','not_done_in_time')",
    "Collation": "utf8mb4_0900_ai_ci",
    "Null": "NO",
    "Key": "",
    "Default": null,
    "Extra": "",
    "Privileges": "select,insert,update,references",
    "Comment": ""
  },
  "term": {
    "Field": "term",
    "Type": "time",
    "Collation": null,
    "Null": "NO",
    "Key": "",
    "Default": null,
    "Extra": "",
    "Privileges": "select,insert,update,references",
    "Comment": ""
  },
  "bet_amount": {
    "Field": "bet_amount",
    "Type": "int unsigned",
    "Collation": null,
    "Null": "NO",
    "Key": "",
    "Default": null,
    "Extra": "",
    "Privileges": "select,insert,update,references",
    "Comment": ""
  },
  "task_id": {
    "Field": "task_id",
    "Type": "int",
    "Collation": null,
    "Null": "NO",
    "Key": "MUL",
    "Default": null,
    "Extra": "",
    "Privileges": "select,insert,update,references",
    "Comment": ""
  }
}