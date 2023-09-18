import {
    React,
    useContext,
} from "react";
import AppContext from "AppContext";
import star_svg from "./star.svg"
import { TASK_STATES, TASK_STATE_MESSAGES } from "Consts";
import "./TaskShort.css";

export const TaskShort = ({task}) => {
    const context = useContext(AppContext);
    const bet = task.bets.find(b => b.created_by === context.userId);
    const isOurs = task.created_by === context.userId;
    const hasBonus = isOurs && task.state === TASK_STATES.DONE;
    
    function onClick() {

    }

    return (
        <div className="task-short" onClick={onClick}>
            <div className="title">{task.title}</div>
            <div className="status">{TASK_STATE_MESSAGES[task.state]}</div>
            <div className="final-payout">{bet.final_payout}</div>
            <img className="icon-star" alt="Icon star" src={star_svg} />
            <div 
                className="completion-bonus" 
                style={{ visibility: hasBonus ? "visible" : "hidden" }}
            >
                <div className="completion-bonus-text">bonus</div>
                <div className="completion-bonus-value">{task.term_hours}</div>
                <img className="icon-star" alt="Icon star" src={star_svg} />
            </div>
        </div>
    );
};

export default TaskShort;