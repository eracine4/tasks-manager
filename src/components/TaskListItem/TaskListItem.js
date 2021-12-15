import React, { useState } from 'react';
import './TaskListItem.scss';

import garbageIcon from '../../images/garbage_icon.png'

const TaskListItem = (props) => {

  const [task, setTask] = useState(props.task);
  const [finished, setFinished] = useState(task.completionDate);

  function getItemClasses() {
    let classes = "TaskListItem"
    if (!task.completionDate) {
      classes += " disappear"
    } else {
      classes += " appear"
    }

    return classes
  }

  function getCompletionDateLabel() {
    return finished ?
      (<p className='date'>Finished on: {normalizeDate(task.completionDate)}</p>) :
      <></>
  }

  // Normalize the date into a simpler format
  function normalizeDate(date) {
    // return localeDateString and time in 24 hour format with seconds
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    })
  }

  function onTaskCheckChange(event) {
    let checked = event.target.checked;
    let newTaskState = task
    newTaskState.completionDate = checked ? new Date() : undefined
    setTask(newTaskState)

    setFinished(checked)

    props.onTaskCheckChange(task, checked);
  }

  return (
    <div className={getItemClasses()}>
      <div className='item'>
        <div className='action-button-container'>
          <input className='checkbox' type="checkbox" id="mark-as-done" checked={finished} onChange={onTaskCheckChange} ></input>
          <button className='action-button' onClick={() => props.taskDelete(task)}>
            <img src={garbageIcon} alt="" />
          </button>
        </div>
        <h4>{task.id} {task.title}</h4>
        <p className='description-container'>{task.description}</p>
        {getCompletionDateLabel()}
      </div>
      <hr />
    </div>)
}


export default TaskListItem;
