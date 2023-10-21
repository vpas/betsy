import {
  React,
  useContext,
  useState,
} from "react";
import { useImmer } from 'use-immer';

import TaskState from "components/TaskState";
import BackButton from "components/BackButton";
import Button from "components/Button";
import LoadingBlock from "components/LoadingBlock";
import Slider from "components/Slider";
import Stars from "components/Stars";
import UsersList from "components/UsersList";
import AppContext from "AppContext";
import { hoursToDaysAndHours, newTask, newBet, calcWinPayout } from "Utils"
import { TASK_STATES, USER_COLORS } from "Consts";

import "./CreateEditTask.css";

export const CreateEditTask = () => {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  let inputTask = context.inputTask;
  let inputBet = context.inputBet;

  let areCreatingTask = true;
  if (!inputTask) {
    // creating task
    areCreatingTask = true;
    inputTask = newTask({ user: context.user });
  } else {
    // editing task
    areCreatingTask = false;
    inputTask = { ...inputTask }
    inputTask.bets = [...inputTask.bets]
  }

  let areCreatingBet = true;
  if (!inputBet) {
    // creating bet
    areCreatingBet = true;
    inputBet = newBet({
      user: context.user,
      task: inputTask,
    });
  } else {
    // editing bet
    areCreatingBet = false;
  }

  const [task, updateTask] = useImmer(inputTask);
  const [bet, updateBet] = useImmer(inputBet);

  function onBackButton({ shouldRefetch = false }) {
    console.log(`onBackButton(shouldRefetch: ${shouldRefetch})`);
    context.updateContext(c => {
      c.activeScreenId = c.prevScreenId;
      c.prevScreenId = null;
      c.inputTask = null;
      c.inputBet = null;
      c.shouldRefetch = shouldRefetch;
    });
  }

  async function requestWrapper(requestPromise) {
    try {
      setLoading(true);
      return await requestPromise;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async function onCreateTaskAndBet() {
    await requestWrapper(context.axios.post("actions/create_task_with_bet", {
      task: {
        title: task.title,
        description: task.description,
        created_by: task.created_by,
      },
      bet: {
        bet_amount: bet.bet_amount,
        term_hours: bet.term_hours,
        created_by: bet.created_by,
      },
    }));
    
    onBackButton({ shouldRefetch: true })
  }

  async function onCreateBet() {
    await requestWrapper(context.axios.post("bets", {
      task_id: task.id,
      bet_amount: bet.bet_amount,
      term_hours: bet.term_hours,
      created_by: bet.created_by,
    }));

    onBackButton({ shouldRefetch: true });
  }

  async function saveTask() {
    return await context.axios.post(`tasks/${task.id}`, {
      description: task.description,
      title: task.title,
    });
  }

  async function saveBet() {
    return await context.axios.post(`bets/${bet.id}`, {
      term_hours: bet.term_hours,
      bet_amount: bet.bet_amount,
    });
  }

  async function onSaveTaskAndBet() {
    await requestWrapper(Promise.all([saveTask(), saveBet()]));
    onBackButton({ shouldRefetch: true });
  }

  async function onSaveBet() {
    await requestWrapper(saveBet());
    onBackButton({ shouldRefetch: true });
  }

  async function changeTaskState({ newState }) {
    await requestWrapper(context.axios.post("actions/set_task_state", {
      id: task.id,
      task_state: newState,
    }));
    updateTask(t => {
      // console.log(`updateTask. newState: ${newState}`)
      t.task_state = newState; 
    });
  }

  async function onDeleteTask() {
    await changeTaskState({ newState: TASK_STATES.ABANDONED });
    onBackButton({ shouldRefetch: true });
  }

  async function onLockBets() {
    await changeTaskState({ newState: TASK_STATES.BETS_FINALIZED });
    onBackButton({ shouldRefetch: true });
  }

  async function onStart() {
    await changeTaskState({ newState: TASK_STATES.IN_PROGRESS });
    onBackButton({ shouldRefetch: true });
  }

  async function onFinished() {
    await changeTaskState({ newState: TASK_STATES.DONE });
    onBackButton({ shouldRefetch: true });
  }

  // function onDeleteBet() {
    // not implemented
  // }

  const canEditTask = task.task_state === TASK_STATES.ACCEPT_BETS && task.created_by === context.user.id;
  const canEditBet = task.task_state === TASK_STATES.ACCEPT_BETS && bet.created_by === context.user.id;
  let title = "";
  let Buttons = null;
  let minTermHours = null;
  let maxTermHours = null;

  if (areCreatingTask) {
    title = "Create task";
    Buttons = () => (
      <Button text="CREATE" className="create-button" onClick={() => onCreateTaskAndBet()} />
    )
  } else if (task.created_by === context.userId) {
    title = "Edit task";
    if (task.task_state === TASK_STATES.ACCEPT_BETS) {
      Buttons = () => (
        <>
          <Button text="SAVE" className="save-button" onClick={() => onSaveTaskAndBet()} />
          <Button text="LOCK" className="lock-bets-button" onClick={() => onLockBets()} />
          <Button text="DELETE" className="delete-button" onClick={() => onDeleteTask()} />
        </>
      )
      task.bets.forEach(b => {
        if (b.created_by !== context.userId) {
          if (minTermHours === null || minTermHours > b.term_hours) {
            minTermHours = b.term_hours;
          }
        }
      });
    } else if (task.task_state === TASK_STATES.BETS_FINALIZED) {
      Buttons = () => (
        <>
          <Button text="START" className="start-button" onClick={() => onStart()} />
          <Button text="DELETE" className="delete-button" onClick={() => onDeleteTask()} />
        </>
      )
    } else if (task.task_state === TASK_STATES.IN_PROGRESS) {
      Buttons = () => (
        <>
          <Button text="FINISHED" className="finished-button" onClick={() => onFinished()} />
          <Button text="DELETE" className="delete-button" onClick={() => onDeleteTask()} />
        </>
      )
    } else {
      title = "View task";
      Buttons = () => (<></>)
    }
  } else {
    if (task.task_state === TASK_STATES.ACCEPT_BETS) {
      maxTermHours = task.owner_bet.term_hours;
      if (areCreatingBet) {
        title = "Create bet";
        Buttons = () => (
          <>
            <Button text="BET" className="create-button" onClick={() => onCreateBet()} />
          </>
        )
      } else {
        title = "Edit bet";
        Buttons = () => (
          <>
            <Button text="SAVE" className="save-bet-button" onClick={() => onSaveBet()} />
          </>
        )
      }
    } else {
      title = "View bet";
      Buttons = () => (<></>)
    }
  }

  const otherBets = []
  if (task.created_by === context.userId) {
    task.bets.filter(b => b.created_by !== context.userId).forEach((b, i) => {
      otherBets.push({
        ...b,
        color: i < USER_COLORS.length ? USER_COLORS[i] : USER_COLORS[0],
      })
    });
  } else {
    otherBets.push({
      ...task.owner_bet,
      color: USER_COLORS[0],
    })
  }

  if (loading) {
    return <LoadingBlock />
  } else {
    return (
      <div className="screen task-editor">
        <BackButton onClick={onBackButton} />
        <div 
          className="screen-title h2 create-edit-label">
            {title}
        </div>
        <TaskState state={task.task_state} className="task-state"/>
        <div className="input-wrapper title-wrapper">
          <input
            className="input title"
            id="title"
            type="text"
            placeholder="Title"
            value={task.title}
            disabled={!canEditTask}
            onChange={e => updateTask(t => { t.title = e.target.value; })}
          />
        </div>
        <div className="input-wrapper description-wrapper">
          <textarea
            className="input description"
            id="description"
            placeholder="Description"
            value={task.description}
            disabled={!canEditTask}
            onChange={e => updateTask(t => { t.description = e.target.value; })}
          />
        </div>
        <Slider
          className="term-hours"
          label="HOURS"
          min="0"
          max="72"
          minAvailable={minTermHours}
          maxAvailable={maxTermHours}
          value={bet.term_hours}
          otherValuesWithColor={otherBets.map(b => { return { value: b.term_hours, color: b.color } })}
          disabled={!canEditBet}
          onChange={v => updateBet(b => { b.term_hours = v; })}
          onFormatValue={hoursToDaysAndHours}
        />
        <Slider
          className="bet-amount"
          label="STARS"
          min="1"
          max="100"
          disabled={!canEditBet}
          value={bet.bet_amount}
          otherValuesWithColor={otherBets.map(b => { return { value: b.bet_amount, color: b.color } })}
          onChange={v => updateBet(b => { b.bet_amount = v; })}
        />
        <UsersList
          className="bets-legend"
          users={otherBets.map(b => { return { username: b.owner.username, color: b.color } })}
        />
        <div className="win-payout">
          <div className="win-payout-text">Win payout</div>
          <Stars
            className="win-payout-amout"
            value={calcWinPayout({ task, bet })}
            formatAsEarning={true}
          />
        </div>
        <label className="error">{error}</label>
        <Buttons />
        <div className="footer" />
      </div>
    )
  }
};

export default CreateEditTask;