export function hoursToDaysAndHours(h) {
    const d = Math.trunc(h / 24);
    h = h % 24;
    if (d === 0) {
        return `${h} h`;
    } else {
        return `${d} d ${h} h`;
    }
}

export function joinQueries(...queries) {
    return {
        loading: queries.some(q => q.loading),
        error: queries.map(q => q.error).find(e => e),
    }
}

export function matchTasksAndBets(tasks, bets) {
    const tasksById = {}
    tasks.forEach(t => tasksById[t.id] = t);
    bets.forEach(b => {
        const t = tasksById[b.task_id];
        b.task = t;
        t.bet = b;
    });
}