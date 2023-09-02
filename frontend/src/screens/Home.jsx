import React from "react";
import Logo from "../components/Logo"
import TaskLong from "../components/TaskLong"
import "./Home.css";

export const Home = () => {
    return (
        <div className="screen home">
            <Logo/>
            <div className="section-title your-task">YOUR TASK</div>
            <TaskLong/>
            <div className="section-title your-bets">YOUR BETS</div>
            
        </div>
    )
}

export default Home;