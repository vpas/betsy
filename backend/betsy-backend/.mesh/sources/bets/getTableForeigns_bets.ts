// @ts-nocheck
export default {
  "mirror_bet_id": {
    "CONSTRAINT_NAME": "mirror_bet_id",
    "COLUMN_NAME": "id",
    "ORDINAL_POSITION": 1,
    "POSITION_IN_UNIQUE_CONSTRAINT": 1,
    "REFERENCED_TABLE_NAME": "bets",
    "REFERENCED_COLUMN_NAME": "id"
  },
  "accepted_by": {
    "CONSTRAINT_NAME": "accepted_by",
    "COLUMN_NAME": "id",
    "ORDINAL_POSITION": 1,
    "POSITION_IN_UNIQUE_CONSTRAINT": 1,
    "REFERENCED_TABLE_NAME": "users",
    "REFERENCED_COLUMN_NAME": "id"
  },
  "bet_created_by": {
    "CONSTRAINT_NAME": "bet_created_by",
    "COLUMN_NAME": "id",
    "ORDINAL_POSITION": 1,
    "POSITION_IN_UNIQUE_CONSTRAINT": 1,
    "REFERENCED_TABLE_NAME": "users",
    "REFERENCED_COLUMN_NAME": "id"
  }
}