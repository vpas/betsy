import {
    React,
    useContext,
} from "react";
import { useImmer } from 'use-immer';
import { useMutation } from '@apollo/client';

import Logo from "components/Logo";
import BackButton from "components/BackButton";
import Button from "components/Button";
import LoadingBlock from "components/LoadingBlock";
import Slider from "components/Slider";
import Stars from "components/Stars";
import AppContext from "AppContext";
import {
    CREATE_TASK,
    CREATE_BET,
    UPDATE_TASK,
    UPDATE_BET,
    UPDATE_USER,
} from "GraphQLQueries";
import { hoursToDaysAndHours, newTask, newBet, joinQueries, calcWinPayouts, calcWinPayout } from "Utils"
import { TASK_STATES, USER_COLORS } from "Consts";

import "./CreateEditTask.css";
import UsersList from "components/UsersList";

export const CreateEditTask = () => {
    const context = useContext(AppContext);
    let inputTask = context.inputTask;
    let inputBet = context.inputBet;
    
    let areCreatingTask = true;
    if (!inputTask) {
        // creating task
        areCreatingTask = true;
        inputTask = newTask({user: context.user});
    } else {
        // editing task
        areCreatingTask = false;
        inputTask = {...inputTask}
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

    const [ task, updateTask ] = useImmer(inputTask);
    const [ bet, updateBet ] = useImmer(inputBet);
    
    const [createTaskMut, createTaskResult] = useMutation(CREATE_TASK);
    const [createBetMut, createBetResult] = useMutation(CREATE_BET);
    const [updateTaskMut, updateTaskResult] = useMutation(UPDATE_TASK);
    const [updateBetMut, updateBetResult] = useMutation(UPDATE_BET);
    const [updateUserMut, updateUserResult] = useMutation(UPDATE_USER);
    
    function onBackButton({shouldRefetch = false}) {
        context.updateContext(c => {
            c.activeScreenId = c.prevScreenId; 
            c.prevScreenId = null;
            c.inputTask = null;
            c.inputBet = null;
            c.shouldRefetch = shouldRefetch;
        });
    }

    async function createTask() {
        const taskVars = {...task};
        delete taskVars.owner_bet;
        delete taskVars.bets;
        const data = await createTaskMut({ variables: taskVars });
        console.log(data);
        const task_id = data.data.insert_tasks_one.id;
        return task_id;
    }

    async function createBet({task_id}) {
        const betVars = {...bet};
        delete betVars.win_payout;
        betVars.task_id = task_id;
        const data = await createBetMut({ variables: betVars });
    }

    async function onCreateTaskAndBet() {
        const task_id = await createTask();
        await createBet({task_id: task_id});
        onBackButton({shouldRefetch: true})
    }

    async function onCreateBet() {
        await createBet({task_id: task.id});
        onBackButton({shouldRefetch: true});
    }

    async function saveTask() {
        await updateTaskMut({
            variables: {
                id: task.id, 
                description: task.description, 
                title: task.title,
                state: task.state,
            },
        });
    }

    async function saveBet() {
        await updateBetMut({
            variables: {
                id: bet.id,
                term_hours: bet.term_hours, 
                bet_amount: bet.bet_amount,
            },
        })
    }
    
    async function onSaveTaskAndBet() {
        await Promise.all([saveTask(), saveBet()]);
        onBackButton({shouldRefetch: true});
    }

    async function onSaveBet() {
        await saveBet();
        onBackButton({shouldRefetch: true});
    }

    async function changeTaskState({newState}) {
        updateTask(t => { t.state = newState; });
        await updateTaskMut({
            variables: {
                id: task.id, 
                state: newState,
                description: task.description, 
                title: task.title,
            },
        });
    }

    function onDeleteTask() {
        changeTaskState({newState: TASK_STATES.ABANDONED});
        onBackButton({shouldRefetch: true});
    }

    function onLockBets() {
        changeTaskState({newState: TASK_STATES.BETS_FINALIZED});
    }

    function onStart() {
        changeTaskState({newState: TASK_STATES.IN_PROGRESS});
        onBackButton({shouldRefetch: true});
    }

    function onFinished() {
        changeTaskState({newState: TASK_STATES.DONE});
        onBackButton({shouldRefetch: true});
    }

    function onDeleteBet() {
        // not implemented
    }

    const canEditTask = task.state === TASK_STATES.ACCEPT_BETS && task.created_by === context.user.id;
    const canEditBet = task.state === TASK_STATES.ACCEPT_BETS && bet.created_by === context.user.id;
    let title = "";
    let Buttons = null;
    let minTermHours = null;
    let maxTermHours = null;

    if (areCreatingTask) {
        title = "Create task";
        Buttons = () => (
            <Button text="CREATE" className="create-button" onClick={() => onCreateTaskAndBet()}/>
        )
    } else if (task.created_by === context.userId) {
        title = "Edit task";
        if (task.state === TASK_STATES.ACCEPT_BETS) {
            Buttons = () => (
                <>
                    <Button text="SAVE" className="save-button"onClick={() => onSaveTaskAndBet()}/>
                    <Button text="LOCK" className="lock-bets-button" onClick={() => onLockBets()}/>
                    <Button text="DELETE" className="delete-button" onClick={() => onDeleteTask()}/>
                </>
            )
            task.bets.forEach(b => {
                if (b.created_by !== context.userId) {
                    if (minTermHours === null || minTermHours > b.term_hours) {
                        minTermHours = b.term_hours;
                    }
                }
            });
        } else if (task.state === TASK_STATES.BETS_FINALIZED) {
            Buttons = () => (
                <>
                    <Button text="START" className="start-button" onClick={() => onStart()}/>
                    <Button text="DELETE" className="delete-button" onClick={() => onDeleteTask()}/>
                </>
            )
        } else if (task.state === TASK_STATES.IN_PROGRESS) {
            Buttons = () => (
                <>
                    <Button text="FINISHED" className="finished-button" onClick={() => onFinished()}/>
                    <Button text="DELETE" className="delete-button" onClick={() => onDeleteTask()}/>
                </>
            )
        } else {
            title = "View task";
            Buttons = () => (<></>)
        }
    } else {
        if (task.state === TASK_STATES.ACCEPT_BETS) {
            maxTermHours = task.owner_bet.term_hours;
            if (areCreatingBet) {
                title = "Create bet";
                Buttons = () => (
                    <>
                        <Button text="BET" className="create-button"onClick={() => onCreateBet()}/>
                    </>
                )
            } else {
                title = "Edit bet";
                Buttons = () => (
                    <>
                        <Button text="SAVE" className="save-bet-button"onClick={() => onSaveBet()}/>
                    </>
                )
            }
        } else {
            title = "View bet";
            Buttons = () => (<></>)
        }
    }

    const otherBets = []
    if (task.created_by == context.userId) {
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

    const { loading, error } = joinQueries([
        createTaskResult,
        createBetResult,
        updateTaskResult,
        updateBetResult,
        updateUserResult,
    ]);
    const errorMessage = error ? error : "";

    if (loading) {
        return <LoadingBlock/>
    } else {
        return (
            <div className="screen task-editor">
                <Logo/>
                <BackButton onClick={onBackButton}/>
                <label className="section-title create-edit-label">{title}</label>
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
                    otherValuesWithColor={otherBets.map(b => { return { value: b.term_hours, color: b.color}}) }
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
                    otherValuesWithColor={otherBets.map(b => { return { value: b.bet_amount, color: b.color}}) }
                    onChange={v => updateBet(b => { b.bet_amount = v; })}
                />
                <UsersList 
                    className="bets-legend"
                    users={otherBets.map(b => { return { username: b.owner.username, color: b.color }})}
                />
                <div className="win-payout">
                    <div className="win-payout-text">Win payout</div>
                    <Stars 
                        className="win-payout-amout" 
                        value={calcWinPayout({task, bet})}
                        formatAsEarning={true}
                    />
                </div>
                <label className="error">{errorMessage}</label>
                <Buttons />
                <div className="footer"/>
            </div>
        )
    }
};

export default CreateEditTask;