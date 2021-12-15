import React, { useState } from 'react';
import './TaskCard.scss';
import garbageIcon from '../../images/garbage_icon.png'
import pencilIcon from '../../images/pencil_icon.png'
const TaskCard = (props) => {

  const [task, setTask] = useState(props.task);
  const [finished, setFinished] = useState(task?.completionDate);

  function onTaskCheckChange(event) {
    let checked = event.target.checked;
    let newTaskState = task
    newTaskState.completionDate = checked ? new Date() : undefined
    setTask(newTaskState)

    setFinished(checked)

    props.onTaskCheckChange(props.task, checked);
  }

  function getCardClasses() {
    if (finished)
      console.log(task.completionDate ? "finished" : "unfinished", task.id)
    let classes = "TaskCard "
    if (finished) {
      classes += " disappear"
    } else {
      classes += " appear"
    }
    return classes
  }


  return (
    <div className={getCardClasses()}>
      <div className='card'>
        <div className='action-button-container'>
          <button className='action-button' onClick={() => props.taskDelete(task)}>
            <img src={garbageIcon} alt="" />
          </button>
          <div className='action-button-group'>
            <button onClick={() => props.openPopup(task)} className='action-button'>
              <img src={pencilIcon} alt="" />
            </button>
            <input className='checkbox' type="checkbox" id="mark-as-done" checked={finished} onChange={onTaskCheckChange} ></input>
          </div>
        </div>
        <h3>{task.id} {task.title}</h3>
        <button onClick={() => props.openPopup(task)}>
          <p>{task.description}</p>
        </button>
        <br />
      </div>
    </div>)
}

export default TaskCard;
