import {
    React,
    useContext,
} from "react";

import Stars from "components/Stars";
import AppContext from "AppContext";
import { TASK_STATES, TASK_STATE_MESSAGES } from "Consts";
import "./TaskShort.css";

export const TaskShort = ({task, onClick = () => {}}) => {
    const context = useContext(AppContext);
    const ourBet = task.bets.find(b => b.created_by === context.userId);
    const isOurs = task.created_by === context.userId;
    const hasBonus = isOurs && task.task_state === TASK_STATES.DONE;
    
    const bet = ourBet ? ourBet : task.owner_bet;
    
    let starsValue;
    let formatAsEarning;
    if (ourBet && ourBet.final_payout != null) {
        starsValue = ourBet.final_payout;
        formatAsEarning = true;
    } else {
        starsValue = bet.bet_amount;
        formatAsEarning = false;
    }

    function Bonus() {
        if (hasBonus) {
            return (
                <div className="completion-bonus">
                    <div className="completion-bonus-text">bonus</div>
                    <Stars 
                        className="completion-bonus-stars" 
                        value={ourBet.term_hours}
                        formatAsEarning={true}
                    />
                </div>
            )
        } else {
            return <></>
        }
    }

    return (
        <div className="task-short" onClick={() => onClick({task: task, bet: ourBet})}>
            <div className="title">{task.title}</div>
            <div className="status">{TASK_STATE_MESSAGES[task.task_state]}</div>
            <div 
                className="owner"
                style={{ visibility: task.owner.id !== context.userId ? "visible" : "hidden" }}
            >
                {task.owner.username}
            </div>
            <Stars 
                className="stars-value" 
                value={starsValue}
                formatAsEarning={formatAsEarning}
            />
            <Bonus />
        </div>
    );
};

export default TaskShort;