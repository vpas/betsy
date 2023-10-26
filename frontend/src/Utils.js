import { BET_CONDITION } from "Consts";

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

export function calcWinPayouts(task) {
  // console.log(task);
  if (task.bets.length === 1) {
    task.bets[0].win_payout = 0;
  } else if (task.bets.length === 2) {
    let winPayout = 0;
    if (task.bets[0].term_hours === task.bets[1].term_hours) {
      winPayout = Math.min(task.bets[0].bet_amount, task.bets[1].bet_amount);
    }
    task.bets[0].win_payout = winPayout;
    task.bets[1].win_payout = winPayout;
  } else {
    const isActive = b => b.term_hours >= task.owner_bet.term_hours;
    const activeBets = task.bets.filter(isActive);
    const total = activeBets.reduce((sum, b) => sum + b.bet_amount, 0);
    const totalAgainst = total - task.owner_bet.bet_amount;
    task.bets.forEach(b => {
      if (b.id === task.owner_bet.id) {
        b.win_payout = totalAgainst;
      } else if (isActive(b)) {
        b.win_payout = Math.ceil(total * (b.bet_amount / totalAgainst));
        b.win_payout -= b.bet_amount;
      } else {
        b.win_payout = 0;
      }
    });
  }
}

export function calcWinPayout({ task, bet }) {
  const taskCopy = { ...task };
  const betCopy = { ...bet };
  taskCopy.bets = task.bets.map(b => { return { ...b } });
  const i = taskCopy.bets.findIndex(b => b.created_by === betCopy.created_by);
  if (i >= 0) {
    taskCopy.bets[i] = betCopy;
  } else {
    taskCopy.bets.push(betCopy);
  }
  if (taskCopy.created_by === betCopy.created_by) {
    taskCopy.owner_bet = betCopy;
  }
  calcWinPayouts(taskCopy);
  return taskCopy.bets.find(b => b.created_by === betCopy.created_by).win_payout;
}

export function newTask({ user }) {
  return {
    created_by: user.id,
    title: "",
    description: "",
    task_state: "accept_bets",
    bets: [],
  };
}

export function newBet({ user, task }) {
  const bet = {
    created_by: user.id,
  }
  if (task.created_by === user.id) {
    bet.bet_condition = BET_CONDITION.DONE_IN_TIME;
    bet.bet_amount = 1;
    bet.term_hours = 1;
    task.owner_bet = bet;
  } else {
    bet.bet_condition = BET_CONDITION.NOT_DONE_IN_TIME;
    bet.bet_amount = task.owner_bet.bet_amount;
    bet.term_hours = task.owner_bet.term_hours;
  }
  task.bets.push(bet);
  return bet;
}

export function ensureTextLen({ text, maxLen }) {
  if (text.length > maxLen) {
    return text.substring(0, maxLen - 3) + "...";
  } else {
    return text;
  }
}

export function timeLeftStr(task) {
  const date = new Date(task.started_at);
  date.setHours(date.getHours() + task.owner_bet.term_hours);
  const totalMsLeft = date - new Date();
  const totalMinLeft = Math.floor(totalMsLeft / 1000 / 60);
  const minLeft = totalMinLeft % 60;
  const hoursLeft = Math.floor(totalMinLeft / 60);
  if (totalMsLeft > 0) {
    return `${hoursLeft}h ${minLeft}m left`;
  } else {
    return `${-hoursLeft}h ${-minLeft}m overtime`;
  }
}