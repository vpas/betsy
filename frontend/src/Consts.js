export const TASK_STATES = {
    ACCEPT_BETS: 'accept_bets',
    BETS_FINALIZED: 'bets_finalized',
    IN_PROGRESS: 'in_progress',
    DONE: 'done',
    ABANDONED: 'abandoned',
};

export const TASK_STATE_MESSAGES = {
    [TASK_STATES.ACCEPT_BETS]: "Waiting for bets",
    [TASK_STATES.BETS_FINALIZED]: "Bets accepted",
    [TASK_STATES.IN_PROGRESS]: "In progress",
    [TASK_STATES.DONE]: 'Finished',
    [TASK_STATES.ABANDONED]: 'Abandoned',
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

export const ACTIONS = {
    EDIT: 'edit',
    VIEW: 'view',
}

export const USER_COLORS = [
    "white",
    "#F0A25A",
    "red",
]