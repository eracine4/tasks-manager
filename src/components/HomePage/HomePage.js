import React from 'react';
import './HomePage.scss';

const HomePage = () => {


  function goToTodosPage() {
    window.location.href = '/todos';
  }

  return (
    <div className="HomePage page">
      <h1>Welcome to home page!</h1>
      <button className='redirect-to-todos-card' onClick={goToTodosPage}>
        Click here to manage your todos
      </button>
    </div>)
}

export default HomePage;
