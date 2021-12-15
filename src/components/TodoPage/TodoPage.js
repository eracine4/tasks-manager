import React, {
  useLayoutEffect, useEffect, useState, useReducer
} from 'react';
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
    sortAllTasks()
  }, [currentSorting])

  useEffect(() => {
    setCurrentTasks(allTasks)
    sortAllTasks()
  }, [allTasks, currentSorting])

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const [currentTasks, setCurrentTasks] = useState([])

  function toggleDateSorting() {
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

  function sortAllTasks() {
    if (allTasks.filter(task => task.completionDate).length === 0) {
      if (currentTasks.length === 0) {
        setCurrentTasks(allTasks)
      }
      return;
    }

    // set currentTasks by sorted allTasks by completionDate
    let newOrderedTasks = allTasks
    switch (currentSorting) {
      case 'asc':
        newOrderedTasks = allTasks.slice().sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate));
        break;
      case 'desc':
        newOrderedTasks = allTasks.slice().sort((a, b) => new Date(a.completionDate) - new Date(b.completionDate));
        break;
      case undefined:
        newOrderedTasks = allTasks
        break;
      default:
        break;
    }
    if (currentTasks === newOrderedTasks) {
      return;
    }
    setCurrentTasks(newOrderedTasks)
  }

  const displayUnfinishedTasks = () => {
    let unfinishedTasks = []
    for (var i in currentTasks) {
      let task = currentTasks[i]
      if (!task.completionDate) {
        // if removed doesn't include a task with same id
        if (!removed.includes(task.id)) {
          unfinishedTasks.push(<TaskCard key={"task_" + task.id} task={task} openPopup={openPopup} taskDelete={taskDelete} onTaskCheckChange={onTaskCheckChange}></TaskCard>)
        }
      }
    }
    return unfinishedTasks;
  }

  const displayFinishedTasks = () => {
    let finishedTasks = []
    for (var i in currentTasks) {
      let task = currentTasks[i]
      if (task.completionDate) {
        // if task is not in removed array
        if (!removed.includes(task.id)) {
          finishedTasks.push(<TaskListItem key={"task_" + task.id} task={task} taskDelete={taskDelete} onTaskCheckChange={onTaskCheckChange}></TaskListItem>)
        }
      }
    }
    return finishedTasks;
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

    setTimeout(() => {
      let tasks = [...allTasks]
      tasks.filter(t => t.id === task.id)[0] = task
      setAllTasks(tasks)
      forceUpdate()
    }, disappearAfterTime);
  }

  // Remove task from the list
  const taskDelete = (task) => {

    console.log("delete", task.id + " " + task.title)
    let newAllTasks = allTasks.filter(t => (t.id !== task.id))
    if (newAllTasks.filter(t => t.id === task.id).length === 0)
      console.log("Now not containing", task.id + " " + task.title)
    setRemoved([...removed, task.id])

    setAllTasks([...newAllTasks])
    forceUpdate()
  }

  const onCreateNewTask = () => {
    // get random value in action and object arrays
    let action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    // get random value in object array
    let object = action + " " + OBJECTS[Math.floor(Math.random() * OBJECTS.length)]



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
    forceUpdate()
  }

  function closeTaskPopup() {
    setPopupTask(undefined)
  }

  const sortingSymbole = () => {
    let up = "▲"
    let down = "▼"

    if (currentSorting === 'asc') {
      return up
    } else if (currentSorting === 'desc') {
      return down
    } else {
      return ""
    }
  }

  const cardListClasses = () => {
    let classes = 'card-list appear'

    if (!showUnfinished)
      classes += ' large'

    return classes
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
      {showUnfinished ? <div className='card-grid'>
        <div className='new-task-card'>
          <button onClick={onCreateNewTask}>
            <h2>New Task</h2>
          </button>
        </div>
        {displayUnfinishedTasks()}
      </div>
        : <></>
      }
      {showFinished ?
        <div className={cardListClasses()}>
          <label className='list-title'>Finished Tasks {allTasks.filter(t => t.completionDate).length > 0 ? "(" + allTasks.filter(t => t.completionDate).length + ")" : ""}</label>
          {allTasks.filter(t => t.completionDate).length > 0 ? <button onClick={toggleDateSorting}>Sort by date {sortingSymbole()}</button> : <></>}
          {displayFinishedTasks()}
        </div>
        : <></>
      }
    </div>

  )
}

export default TodoPage;
