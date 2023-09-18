export const TASK_STATES = {
    ACCEPT_BETS: 'accept_bets',
    BETS_FINALIZED: 'bets_finalized',
    IN_PROGRESS: 'in_progress',
    DONE: 'done',
    ABANDONED: 'abandoned',
};

export const TASK_STATE_MESSAGES = {
    [TASK_STATES.ACCEPT_BETS]: "Waiting for bets",
    [TASK_STATES.BETS_FINALIZED]: "Ready to start",
    [TASK_STATES.IN_PROGRESS]: "In progress",
    [TASK_STATES.DONE]: 'Finished',
    [TASK_STATES.ABANDONED]: 'Abandoned',
}

export const TASK_STATES_ACTIVE = new Set([
    TASK_STATES.ACCEPT_BETS,
    TASK_STATES.BETS_FINALIZED,
    TASK_STATES.IN_PROGRESS,
]);