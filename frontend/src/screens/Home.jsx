import {
    React,
    useContext,
} from "react";
import Logo from "../components/Logo"
import TaskLong from "../components/TaskLong"
import AppContext from "../AppContext";
import "./Home.css";

export const Home = () => {
    const context = useContext(AppContext);
    const user = context.user;

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