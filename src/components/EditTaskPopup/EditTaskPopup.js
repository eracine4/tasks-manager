import React, { useState, useEffect } from 'react';
import './EditTaskPopup.scss';

const EditTaskPopup = (props) => {

  const [cat, setCat] = useState(undefined)

  useEffect(() => {
    getCat()
  }, [])

  const editedTask = () => {
    let title = document.getElementById('title-input').value;
    let description = document.getElementById('description-input').value;

    let newTask = {
      title: title,
      description: description,
      id: props.task.id,
      completionDate: props.task.completionDate
    }
    return newTask
  }

  function getCat() {
    let rURL = "http://aws.random.cat/meow";
    let r = new XMLHttpRequest();
    r.open("GET", rURL);

    r.responseType = "json";
    r.send();

    r.onload = function () {
      let json = r.response;
      let src = json["file"];
      setCat(src)
    }
  }

  return (
    <div className="EditTaskPopup">
      <h2>Edit Task</h2>
      <img src={cat} alt=""></img>
      <div className='form-container'>
        <input type="text" id='title-input' defaultValue={props.task.title}></input>
        <textarea type="text" id='description-input' defaultValue={props.task.description}></textarea>
        <label>{props.task.completionDate ? "Finished on: " + props.task.completionDate : "Status: Unfinished"}</label>
        <button onClick={() => props.saveTask(editedTask())}>Save</button>
      </div>
      <button onClick={props.closePopup} className='close-button'></button>
    </div>)
}

export default EditTaskPopup;
