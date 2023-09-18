import {
    React,
    useContext,
} from "react";
import AppContext from "AppContext";
import TaskShort from "components/TaskShort";

import "./TasksList.css";

export const TasksList = ({tasks}) => {
    const context = useContext(AppContext);
    return (
        <div className="tasks-list">
            {tasks.map(t => <TaskShort key={t.id} task={t}/>)}
        </div>
    );
};

export default TasksList;