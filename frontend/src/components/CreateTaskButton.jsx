import {
    React,
    useContext,
} from "react";

import AppContext from "AppContext";
import CreateEditTask from "screens/CreateEditTask";

import {ReactComponent as IconPlus} from "./icon_plus.svg"
import "./CreateTaskButton.css";

export const CreateTaskButton = () => {
    const context = useContext(AppContext);
    
    return (
        <div className="btn-create-task">
            <IconPlus 
                className="icon-plus"
                onClick={() => context.updateContext(c => { 
                    c.prevScreenId = c.activeScreenId;
                    c.activeScreenId = CreateEditTask.name; 
                    c.taskToEdit = null;
                })}
            />
        </div>
    );
};

export default CreateTaskButton;