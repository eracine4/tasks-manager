import './App.css';
import HomePage from './components/HomePage/HomePage';
import TodoPage from './components/TodoPage/TodoPage';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {

  const router = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}>
          </Route>
          <Route path="/todos" element={<TodoPage />}>
          </Route>
        </Routes>
      </Router>)
  }

  return (
    <div className="App">
      {router()}
    </div>
  );
}

export default App;
