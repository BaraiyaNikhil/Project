import React, { useState } from "react";
import axios from "axios";
import "./TodoItem.css";

const TodoItem = ({ todo, refreshTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const initialTime = todo.timeLimit ? new Date(todo.timeLimit).toISOString().slice(0, 16) : "";
  const [editedTimeLimit, setEditedTimeLimit] = useState(initialTime);
  const [editedPriority, setEditedPriority] = useState(todo.priority);
  const [editedStatus, setEditedStatus] = useState(todo.status);
  const [showShare, setShowShare] = useState(false);
  const [shareEmail, setShareEmail] = useState("");

  const loggedInUserId = localStorage.getItem("userId");

  const deleteTodo = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${todo._id}`);
      refreshTodos();
    } catch (error) {
      console.error("Error deleting todo:", error.response ? error.response.data : error.message);
    }
  };

  const saveEdit = async () => {
    try {
      const updatedTodo = {
        title: editedTitle,
        description: editedDescription,
        timeLimit: editedTimeLimit ? new Date(editedTimeLimit).toISOString() : null,
        priority: editedPriority,
        status: editedStatus,
      };
      await axios.put(`http://localhost:3000/api/todos/${todo._id}`, updatedTodo);
      setIsEditing(false);
      refreshTodos();
    } catch (error) {
      console.error("Error updating todo:", error.response ? error.response.data : error.message);
    }
  };

  const shareTask = async () => {
    try {
      await axios.post("http://localhost:3000/api/todos/share", { todoId: todo._id, email: shareEmail });
      alert("Task shared successfully!");
      setShowShare(false);
      setShareEmail("");
    } catch (error) {
      console.error("Share task error:", error.response ? error.response.data : error.message);
      alert("Error sharing task.");
    }
  };

  return (
    <div className="todo-item">
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            className="edit-title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            className="edit-description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Enter description here..."
          />
          <input
            type="datetime-local"
            className="edit-datetime"
            value={editedTimeLimit}
            onChange={(e) => setEditedTimeLimit(e.target.value)}
          />
          <div className="edit-selects">
            <div>
              <label>Priority: </label>
              <select value={editedPriority} onChange={(e) => setEditedPriority(e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label>Status: </label>
              <select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="edit-buttons">
            <button className="save-button" onClick={saveEdit}>Save</button>
            <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <h2>{todo.title}</h2>
          <div className="todo-description">{todo.description}</div>
          <p>Due: {todo.timeLimit ? new Date(todo.timeLimit).toLocaleString() : "No deadline"}</p>
          <p>Priority: {todo.priority}</p>
          <p>Status: {todo.status}</p>
          <p>Owner: {todo.owner ? todo.owner.username : "Unknown"}</p>
          <p>
            Collaborators:{" "}
            {todo.collaborators && todo.collaborators.length > 0
              ? todo.collaborators.map((c) => c.username).join(", ")
              : "None"}
          </p>
          <div className="view-buttons">
            <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
            {loggedInUserId === (todo.owner && todo.owner._id) && (
              <button className="delete-button" onClick={deleteTodo}>Delete</button>
            )}
            <button className="share-button" onClick={() => setShowShare(!showShare)}>Share</button>
          </div>
          {showShare && (
            <div className="share-section">
              <input
                type="email"
                placeholder="Enter email to share"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
              <button onClick={shareTask}>Send</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoItem;
