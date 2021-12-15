import React, { useEffect, useState } from 'react';
import './TodoPage.scss';
import TaskCard from './../TaskCard/TaskCard';
import TaskListItem from './../TaskListItem/TaskListItem';
import EditTaskPopup from './../EditTaskPopup/EditTaskPopup'

const TodoPage = () => {

  const disappearAfterTime = 500

  const [popupTask, setPopupTask] = useState(undefined)

  const [showUnfinished, setShowUnfinished] = useState(true)
  const [showFinished, setShowFinished] = useState(true)

  const [currentSorting, setCurrentSorting] = useState(undefined)

  const [removed, setRemoved] = useState([])

  const [allTasks, setAllTasks] = useState([])

  const ACTIONS = [
    'eat',
    'sleep',
    'sell',
    'buy',
    'destroy',
    'throw',
    'bury',
  ];

  const OBJECTS = [
    'the banana',
    'the dog',
    'a fireman',
    'a dancing guy',
    'Station F',
    'the coffin',
  ];

  useEffect(() => {
    getRandomTasks()
  }, [])

  useEffect(() => {
    sortTasks()
  }, [allTasks, currentSorting])

  const [currentTasks, setCurrentTasks] = useState(allTasks)

  function sortByDate() {
    if (currentSorting === 'asc') {
      setCurrentSorting('desc')
    } else if (currentSorting === 'desc') {
      setCurrentSorting(undefined)
    } else {
      setCurrentSorting('asc')
    }
  }

  function getRandomTasks() {
    let tasks = []
    for (var i = 0; i < 10; i++) {
      // get random value in action and object arrays
      let action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
      // get random value in object array
      let object = OBJECTS[Math.floor(Math.random() * OBJECTS.length)]

      let id = tasks.length

      let newTask = {
        title: action,
        description: object,
        completionDate: undefined,
        id: id
      }
      tasks.push(newTask)
    }
    setAllTasks(tasks)
  }

  function sortTasks() {
    // set currentTasks by sorted allTasks by completionDate
    switch (currentSorting) {
      case "asc":
        setCurrentTasks(allTasks.sort((a, b) => (a.completionDate > b.completionDate) ? 1 : -1))
        break;
      case "desc":
        setCurrentTasks(allTasks.sort((a, b) => (a.completionDate > b.completionDate) ? -1 : 1))
        break;
      case undefined:
        setCurrentTasks(allTasks)
        break;
      default:
        break;
    }
  }

  const displayUnfinishedTasks = () => {
    let tasks = []
    currentTasks.forEach((task, index) => {
      if (!task.completionDate) {
        // if removed doesn't include a task with same id
        if (!removed.includes(task.id)) {
          tasks.push(<TaskCard key={"task_" + index} task={task} openPopup={openPopup} taskDelete={taskDelete} onTaskCheckChange={onTaskCheckChange}></TaskCard>)
        }
      }
    })
    return tasks;
  }

  const displayFinishedTasks = () => {
    let tasks = []

    currentTasks.forEach((task, index) => {
      if (task.completionDate) {
        // if task is not in removed array
        if (!removed.includes(task.id)) {
          tasks.push(<TaskListItem key={"task_" + index} task={task} taskDelete={taskDelete} onTaskCheckChange={onTaskCheckChange}></TaskListItem>)
        }
      }
    })
    return tasks;
  }

  // open the modification popup
  const openPopup = (task) => {
    setPopupTask(task)
  }

  // Save task after modification
  function saveTask(task) {
    let tasks = [...allTasks]
    let newTask = tasks.find(t => t.id === task.id)
    newTask.title = task.title
    newTask.description = task.description
    setAllTasks(tasks)
    closePopup()
  }

  // Close the edition popup
  function closePopup() {
    setPopupTask(undefined)
  }

  // On checkbox (done/not done) change
  const onTaskCheckChange = (task, checked) => {

    console.log(checked ? "checked" : "unchecked", task.id)

    setTimeout(() => {
      let tasks = [...allTasks]
      tasks.filter(t => t.id === task.id)[0] = task
      setAllTasks(tasks)
    }, disappearAfterTime);
  }

  // Remove task from the list
  const taskDelete = (task) => {
    console.log("delete", task.id + " " + task.title)
    let newAllTasks = allTasks.filter(t => !(t.title === task.title && t.description === task.description))

    setRemoved([...removed, task.id])

    setAllTasks(newAllTasks)
  }

  const onCreateNewTask = () => {
    // get random value in action and object arrays
    let action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    // get random value in object array
    let object = OBJECTS[Math.floor(Math.random() * OBJECTS.length)]


    let id = 0
    // while id is already in allTasks
    while (allTasks.find(t => t.id === id)) {
      id++
    }

    // id removed includes the id of the task, remove it from the removed array
    if (removed.includes(id)) {
      setRemoved(removed.filter(r => r !== id))
    }


    let newTask = {
      title: action,
      description: object,
      completionDate: undefined,
      id: id
    }
    setAllTasks([...allTasks, newTask])
  }

  function closeTaskPopup() {
    setPopupTask(undefined)
  }

  return (
    <div className="TodoPage page">

      <div className='filters-group'>
        <div className='filter-button-group'>
          <label>Show Done</label>
          <input type="checkbox" checked={showFinished} onChange={(e) => setShowFinished(e.target.checked)}></input>
        </div>
        <div className='filter-button-group'>
          <label>Show Not Done</label>
          <input type="checkbox" checked={showUnfinished} onChange={(e) => setShowUnfinished(e.target.checked)}></input>
        </div>
      </div>
      {popupTask && <EditTaskPopup saveTask={saveTask} closePopup={closePopup} task={popupTask} closeTaskPopup={closeTaskPopup}></EditTaskPopup>}
      <div className='card-grid'>
        <div className='new-task-card'>
          <button onClick={onCreateNewTask}>
            <h2>New Task</h2>
          </button>
        </div>
        {showUnfinished ? displayUnfinishedTasks() : <></>}
      </div>
      {showFinished ?
        <div className='card-list appear'>
          <label className='list-title'>Finished Tasks {allTasks.filter(t => t.completionDate).length > 0 ? "(" + allTasks.filter(t => t.completionDate).length + ")" : ""}</label>
          <button onClick={sortByDate}>Sort by date {currentSorting}</button>
          {displayFinishedTasks()}
        </div>
        : <></>
      }
    </div>

  )
}

export default TodoPage;
