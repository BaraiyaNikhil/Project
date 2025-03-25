import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoItem from "./TodoItem";
import Select from "react-select";
import "./TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [users, setUsers] = useState([]);
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState("pending");
  const [collabSearch, setCollabSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");


  const ownerId = localStorage.getItem("userId");


  useEffect(() => {
    fetchTodos();
    fetchUsers();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/todos");
      setTodos(res.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    const newTodo = {
      title,
      description,
      timeLimit: timeLimit ? new Date(timeLimit).toISOString() : null,
      owner: ownerId,
      collaborators: collaborators.map((user) => user.value),
      priority,
      status
    };

    try {
      const res = await axios.post("http://localhost:3000/api/todos", newTodo);
      setTodos([...todos, res.data]);
      setTitle("");
      setDescription("");
      setTimeLimit("");
      setCollaborators([]);
      setPriority("low");
      setStatus("pending");
    } catch (error) {
      console.error("Error adding todo:", error.response ? error.response.data : error.message);
    }
  };

  const collaboratorTasks = todos.filter(
    (todo) =>
      todo.collaborators &&
      todo.collaborators.some((collab) => collab._id === ownerId)
  );

  const userTasks = todos.filter(
    (todo) => todo.owner && todo.owner._id === ownerId
  );

  const filteredCollaboratorTasks = collaboratorTasks.filter(
    (todo) =>
      todo.title.toLowerCase().includes(collabSearch.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(collabSearch.toLowerCase()))
  );

  const filteredUserTasks = userTasks.filter(
    (todo) =>
      todo.title.toLowerCase().includes(userSearch.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <div className="todo-list-container">
      <h1>Welcome 👩‍🚀</h1>
      <div className="todo-list-wrapper">

        <div className="column left">
          <h2>Collaborative Tasks</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Collaborative Tasks..."
              value={collabSearch}
              onChange={(e) => setCollabSearch(e.target.value)}
            />
          </div>
          <div className="tasks">
            {filteredCollaboratorTasks.length > 0 ? (
              filteredCollaboratorTasks.map((todo) => (
                <TodoItem key={todo._id} todo={todo} refreshTodos={fetchTodos} />
              ))
            ) : (
              <p className="empty">No collaborative tasks found.</p>
            )}
          </div>
        </div>

        <div className="column center">
          <div className="form-container">
            <h2>Add New Task</h2>
            <form onSubmit={addTodo} className="todo-form">
              <h5>Title : </h5>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <h5>Description : </h5>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <h5>Deadline : </h5>
              <input
                type="datetime-local"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
              />
              <h5>Collaborators : </h5>
              <Select
                isMulti
                options={users.map((user) => ({ value: user._id, label: user.username }))}
                value={collaborators}
                onChange={setCollaborators}
                placeholder="Select collaborators"
              />
              <h5>Priority : </h5>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <h5>Status : </h5>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <button type="submit">Add Task</button>
            </form>
          </div>
        </div>

        <div className="column right">
          <h2>Your Tasks</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Your Tasks..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>
          <div className="tasks">
            {filteredUserTasks.length > 0 ? (
              filteredUserTasks.map((todo) => (
                <TodoItem key={todo._id} todo={todo} refreshTodos={fetchTodos} />
              ))
            ) : (
              <p className="empty">No tasks found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
