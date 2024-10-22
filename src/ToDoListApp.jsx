import React, { useState, useCallback } from 'react';

const ToDoListApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    category: "",
    date: "",
    notes: ""
  });

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const handlePopupChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      setShowPopup(true); // Show popup when 'Add' is clicked
    }
  };

  const handleSubmit = () => {
    setTasks(t => [...t, {
      id: Date.now().toString(),
      content: newTask,
      category: taskDetails.category,
      date: taskDetails.date,
      notes: taskDetails.notes
    }]);
    setNewTask("");
    setTaskDetails({ category: "", date: "", notes: "" });
    setShowPopup(false); // Hide popup after submission
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e, index) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData('text/plain'));
    const newTasks = [...tasks];
    const [reorderedItem] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(index, 0, reorderedItem);
    setTasks(newTasks);
  }, [tasks]);

  return (
    <div className="to-do-list">
      <h2 className="title">To-Do List</h2>

      <div className="input-container">
        <input 
          type="text"
          placeholder="Enter a new task!"
          value={newTask}
          onChange={handleInputChange}
          className="task-input"
        />
        <button
          className="add-button"
          onClick={addTask}>
          Add
        </button>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Enter Task Details</h3>
            <label>
              Category:
              <input
                type="text"
                name="category"
                value={taskDetails.category}
                onChange={handlePopupChange}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={taskDetails.date}
                onChange={handlePopupChange}
              />
            </label>
            <label>
              Notes:
              <textarea
                name="notes"
                value={taskDetails.notes}
                onChange={handlePopupChange}
              />
            </label>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      <ul className="task-list">
        {tasks.map((task, index) => (
          <li 
            key={task.id}
            className="task-item"
          >
            <div 
              className="drag-handle"
              draggable
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, index)}
            >
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span className="task-content">{task.content}</span>
            <span className="task-date">{task.date}</span>
            <button 
              className="delete-button"
              onClick={() => deleteTask(task.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoListApp;
