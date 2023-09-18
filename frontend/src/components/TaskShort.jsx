import {
    React,
    useContext,
} from "react";
import AppContext from "AppContext";
import star_svg from "./star.svg"
import { TASK_STATE_MESSAGES } from "Consts";
import "./TaskShort.css";

export const TaskShort = ({task}) => {
    const context = useContext(AppContext);

    function onClick() {

    }

    return (
        <div className="task-short" onClick={onClick}>
            <div className="title">{task.title}</div>
            <div className="status">{TASK_STATE_MESSAGES[task.state]}</div>
            {/* <div className="bet-amount">{bet.bet_amount}</div>
            <img className="icon-star" alt="Icon star" src={star_svg} />
            <div className="term">{hoursToDaysAndHours(bet.term_hours)}</div> */}
        </div>
    );
};

export default TaskShort;