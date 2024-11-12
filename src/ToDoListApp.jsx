import React, { useState, useEffect, useCallback } from 'react';

const ToDoListApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState(""); // "add" or "view"
  const [taskDetails, setTaskDetails] = useState({
    content: "",
    category: "",
    date: "",
    notes: ""
  });

  // Fetch tasks from the database on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch(`http://localhost/osp-project/handle_data.php?emailid=${userEmail}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setTasks(data.map(task => ({
          id: task.task_id,
          content: task.task_name,
          category: task.category,
          date: task.date,
          notes: task.notes
        })));
      } else {
        console.error("Failed to fetch tasks:", data);
      }
    };
    fetchTasks();
  }, []);

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
    setTaskDetails(prevDetails => ({ ...prevDetails, content: newTask }));
    if (newTask.trim() !== "") {
      setPopupMode("add");
      setShowPopup(true);
    }
  };

  const handleSubmit = async () => {
    const task = {
      content: taskDetails.content,
      category: taskDetails.category,
      date: taskDetails.date,
      notes: taskDetails.notes
    };

    const userEmail = localStorage.getItem('userEmail');
    const response = await fetch('http://localhost/osp-project/handle_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        action: 'addTask',
        emailid: userEmail,
        content: task.content,
        category: task.category,
        date: task.date,
        notes: task.notes
      })
    });

    const data = await response.json();
    if (data.success) {
      setTasks(t => [...t, { id: data.task_id, ...task }]);
      setNewTask("");
      setTaskDetails({ content: "", category: "", date: "", notes: "" });
      setShowPopup(false);
    } else {
      alert("Error adding task");
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch('http://localhost/osp-project/handle_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        action: 'deleteTask',
        task_id: id
      })
    });

    const data = await response.json();
    if (data.success) {
      setTasks(tasks.filter(task => task.id !== id));
    } else {
      alert("Error deleting task");
    }
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

  const handleTaskClick = (task) => {
    setTaskDetails(task);
    setPopupMode("view");
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setTaskDetails({ content: "", category: "", date: "", notes: "" });
  };

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
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>

      {showPopup && popupMode === "add" && (
        <div className="popup">
          <div className="popup-content">
            <h3 className="popup-title">Add Task Details</h3>
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={taskDetails.category}
              onChange={handlePopupChange}
              className="popup-input"
            />
            <input
              type="date"
              name="date"
              value={taskDetails.date}
              onChange={handlePopupChange}
              className="popup-input"
            />
            <textarea
              name="notes"
              placeholder="Notes"
              value={taskDetails.notes}
              onChange={handlePopupChange}
              className="popup-input"
            />
            <button className="confirm-button" onClick={handleSubmit}>
              Confirm
            </button>
            <button className="cancel-button" onClick={handlePopupClose}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showPopup && popupMode === "view" && (
        <div className="popup">
          <div className="popup-content">
            <h3 className="popup-title" style={{ fontWeight: 'bold' }}>{taskDetails.content}</h3>
            <p>Category: {taskDetails.category}</p>
            <p>Date: {taskDetails.date}</p>
            <p>Notes: {taskDetails.notes}</p>
            <button className="close-button" onClick={handlePopupClose}>
              ✕
            </button>
          </div>
        </div>
      )}

      <ul className="task-list">
        {tasks.map((task, index) => (
          <li
            key={task.id}
            className="task-item"
            onClick={() => handleTaskClick(task)}
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
              onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoListApp;
