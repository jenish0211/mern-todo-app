// src/App.js
import React, { useState, useEffect } from "react";
import Login from "../components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [todos, setTodos] = useState([]);
  const [userInput, setUserInput] = useState("");
  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${backendUrl}/todos`)
        .then((res) => res.json())
        .then((data) => setTodos(data))
        .catch((err) => console.error("Error fetching todos:", err));
    }
  }, [isAuthenticated]);

  const addItem = () => {
    if (userInput.trim() !== "") {
      fetch(`${backendUrl}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: userInput }),
      })
        .then((res) => res.json())
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
          setUserInput("");
        })
        .catch((err) => console.error("Error adding todo:", err));
    }
  };

  const deleteItem = (id) => {
    fetch(`${backendUrl}/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((err) => console.error("Error deleting todo:", err));
  };

  const editItem = (id) => {
    const editedValue = prompt("Edit the todo:");
    if (editedValue && editedValue.trim() !== "") {
      fetch(`${backendUrl}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: editedValue }),
      })
        .then((res) => res.json())
        .then((updatedTodo) => {
          setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
        })
        .catch((err) => console.error("Error updating todo:", err));
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">TODO LIST</h1>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add item..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            onClick={addItem}
          >
            ADD
          </button>
        </div>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex justify-between items-center p-3 bg-white rounded shadow"
            >
              {todo.value}
              <div>
                <button
                  className="mr-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => deleteItem(todo._id)}
                >
                  Delete
                </button>
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => editItem(todo._id)}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
