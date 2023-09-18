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
import Home from "screens/Home";
import AppContext from "AppContext";
import {
    CREATE_TASK,
    CREATE_BET,
    UPDATE_TASK_AND_BET,
    GET_USER_TASKS,
    GET_USER_BETS,
} from "GraphQLQueries";
import {hoursToDaysAndHours} from "Utils"

import "./CreateEditTask.css";
import { TASK_STATES } from "Consts";

export const CreateEditTask = () => {
    const context = useContext(AppContext);
    let taskProp = context.taskProp;
    let yourBetProp = context.yourBetProp;

    let areCreating = true;
    if (!taskProp) {
        // creating task
        areCreating = true;
        taskProp = {
            created_by: context.userId,
            title: "",
            desciption: "",
            state: "accept_bets", 
        };
        yourBetProp = {
            created_by: context.userId,
            bet_condition: "done_in_time",
            bet_amount: 1,
            term_hours: 1,
        }
    } else {
        areCreating = false;
        // editing task
    }
    const [ task, updateTask ] = useImmer(taskProp);
    const [ yourBet, updateYourBet ] = useImmer(yourBetProp);

    // function cacheUpdateTask(cache) {
    //     cache.modify({
    //         id: cache.identify(task),
    //         fields: {
    //             title() { return task.title },
    //             description() { return task.description },
    //             state() { return task.state },
    //         },
    //         broadcast: false,
    //     })
    // }
    // function cacheUpdateBet(cache) {
    //     cache.modify({
    //         id: cache.identify(yourBet),
    //         fields: {
    //             term_hours() { return yourBet.term_hours },
    //             bet_amount() { return yourBet.bet_amount },
    //         },
    //         broadcast: false,
    //     })
    // }
    // const mutationOptions = {
    //     update(cache, result) {
    //         cacheUpdateTask(cache);
    //         cacheUpdateBet(cache);
    //     },
    // };
    const [createTask, createTaskResult] = useMutation(CREATE_TASK);
    const [createBet, createBetResult] = useMutation(CREATE_BET);
    const [updateTaskAndBet, updateTaskAndBetResult] = useMutation(UPDATE_TASK_AND_BET);
    
    function onBackButton({shouldRefetch = false}) {
        context.updateContext(c => { 
            c.activeScreenId = Home.name; 
            c.taskProp = null;
            c.yourBetProp = null;
            c.shouldRefetch = shouldRefetch;
        });
    }

    function onCreate() {
        createTask({
            variables: task,
            onCompleted: data => {
                const task_id = data.insert_tasks_one.id;
                createBet({
                    variables: {
                        ...yourBet,
                        task_id: task_id,
                    },
                    onCompleted: () => { onBackButton({shouldRefetch: true}) },
                })
            }
        });
    }

    function onSave(overrides = {}) {
        updateTaskAndBet({
            variables: {
                task_id: task.id, 
                description: task.description, 
                title: task.title, 
                state: task.state,
                
                bet_id: yourBet.id, 
                term_hours: yourBet.term_hours, 
                bet_amount: yourBet.bet_amount,
                ...overrides
            },
            onCompleted: () => { onBackButton({shouldRefetch: true}) },
        })
    }

    function onDelete() {
        onSave({state: TASK_STATES.ABANDONED});
    }

    const isLoading = createTaskResult.loading || createBetResult.loading || updateTaskAndBetResult.loading;
    let error = createTaskResult.error || createBetResult.error || updateTaskAndBetResult.error;
    if (!error) {
        error = "";
    }

    if (isLoading) {
        return <LoadingBlock/>
    } else {
        return (
            <div className="screen task-editor">
                <Logo/>
                <BackButton onClick={onBackButton}/>
                <label 
                    className="section-title create-edit-label"
                >
                    {areCreating ? "Create task" : "Edit task" }
                </label>
                <div className="input-wrapper title-wrapper">
                    <input 
                        className="input title" 
                        id="title" 
                        type="text"
                        placeholder="Title"
                        value={task.title}
                        onChange={e => updateTask(t => { t.title = e.target.value; })}
                    />
                </div>
                <div className="input-wrapper description-wrapper">
                    <textarea 
                        className="input description" 
                        id="description"
                        placeholder="Description"
                        value={task.description}
                        onChange={e => updateTask(t => { t.description = e.target.value; })}
                    />
                </div>
                <Slider 
                    className="term-hours" 
                    label="HOURS"
                    min="0" 
                    max="72" 
                    value={yourBet.term_hours} 
                    onChange={e => updateYourBet(b => { b.term_hours = parseInt(e.target.value); })}
                    onFormatValue={hoursToDaysAndHours}
                />
                <Slider 
                    className="bet-amount" 
                    label="STARS"
                    min="1" 
                    max="100" 
                    value={yourBet.bet_amount} 
                    onChange={e => updateYourBet(b => { b.bet_amount = parseInt(e.target.value); })}
                />
                <label className="error">{error.message}</label>
                <Button 
                    text="CREATE" 
                    className="create-button"
                    onClick={() => onCreate()}
                    style={{ visibility: areCreating ? "visible" : "hidden" }}
                />
                <Button 
                    text="SAVE" 
                    className="save-button"
                    onClick={() => onSave()}
                    style={{ visibility: areCreating ? "hidden" : "visible" }}
                />
                <Button 
                    text="DELETE" 
                    className="delete-button"
                    onClick={() => onDelete()}
                    style={{ visibility: areCreating ? "hidden" : "visible" }}
                />
                <div className="footer"/>
            </div>
        )
    }
};

export default CreateEditTask;