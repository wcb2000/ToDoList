const taskList = document.getElementById("task-list");
const addTaskButton = document.getElementById("add-task");
const newTaskInput = document.getElementById("new-task");
const clearTasksButton = document.getElementById("clear-tasks");
const saveTasksButton = document.getElementById("save-tasks");
const taskForm = document.getElementById("task-form");

let tasks = [];

addTaskButton.addEventListener("click", addTask);
taskList.addEventListener("click", deleteTask);
clearTasksButton.addEventListener("click", clearTasks);
saveTasksButton.addEventListener("click", saveTasks);
window.addEventListener("load", loadTasks);

function clearTasks() {
  taskList.innerHTML = "";
  localStorage.clear();
}

function saveTasks() {
  const taskItems = taskList.querySelectorAll("li");
  const tasks = [];

  taskItems.forEach((taskItem) => {
    const taskText = taskItem.querySelector(".task-text").innerText;
    const dueDateText = taskItem.querySelector(".due-date").innerText;
    tasks.push({ text: taskText, dueDate: dueDateText });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function updateTasks() {
    // Clear the task list
    taskList.innerHTML = '';
  
    // Loop through the tasks array and create a new task element for each task
    tasks.forEach(task => {
      const newTask = createTaskElement(task.text, task.dueDate);
  
      // Set the task item's ID attribute to the task's ID
      newTask.dataset.id = task.id;
  
      // Append the new task element to the task list
      taskList.appendChild(newTask);
    });
  
    // Save the tasks list to localStorage
    saveTasks();
  }

function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (storedTasks) {
    tasks = storedTasks;
    tasks.forEach((task) => {
      const newTask = createTaskElement(task.text, task.dueDate);
      taskList.appendChild(newTask);
    });
  }
}

function createTaskElement(taskText, dueDateText) {
  const newTask = document.createElement("li");
  newTask.className = "task-item";

  const taskTextElement = document.createElement("span");
  taskTextElement.className = "task-text";
  taskTextElement.textContent = taskText;
  newTask.appendChild(taskTextElement);

  const dueDateElement = document.createElement("span");
  dueDateElement.className = "due-date";
  dueDateElement.textContent = dueDateText;
  newTask.appendChild(dueDateElement);

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", editTask); // Add event listener to edit button
  newTask.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  newTask.appendChild(deleteBtn);

  return newTask;
}

function addTask() {
    // Get the task input
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
  
    // Get the due date input
    const dueDateInput = document.getElementById('due-date-input');
    const dueDateText = dueDateInput.value.trim();
  
    // If the task input is empty, do nothing
    if (!taskText) return;
  
    // Create a new task object
    const task = {
      id: Date.now(),
      text: taskText,
      dueDate: dueDateText, // Add a due date property to the task object
    };
  
    // Add the task to the tasks array
    tasks.push(task);
  
    // Clear the task input
    taskInput.value = '';
  
    // Clear the due date input
    dueDateInput.value = '';
  
    // Create a new task element
    const newTask = document.createElement('li');
    newTask.classList.add('task-item');
    newTask.innerHTML = `
      <span class="task-text">${task.text}</span>
      <span class="due-date">${task.dueDate}</span>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;
  
    // Add event listeners to the new edit and delete buttons
    const editBtn = newTask.querySelector('.edit-btn');
    const deleteBtn = newTask.querySelector('.delete-btn');
    editBtn.addEventListener('click', editTask);
    deleteBtn.addEventListener('click', deleteTask);
  
    // Append the new task element to the task list
    taskList.appendChild(newTask);
  
    // Update the tasks list
    updateTasks();
  }
  

function deleteTask(e) {
  if (e.target.classList.contains("delete-btn")) {
    const taskItem = e.target.parentElement;
    const taskText = taskItem.querySelector(".task-text").innerText;
    const taskIndex = tasks.findIndex((task) => task.text === taskText);
    tasks.splice(taskIndex, 1);
    taskList.removeChild(taskItem);
  }
}

document.querySelectorAll(".task-item").forEach((item) => {
  item.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
      editTask(item);
    }
  });
});

function editTask(event) {
    const taskItem = event.target.closest(".task-item");
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(taskItem.dataset.id));
    const taskText = taskItem.querySelector(".task-text").textContent;
    const taskDueDate = taskItem.querySelector(".due-date").textContent;
  
    const taskTextInput = document.createElement("input");
    taskTextInput.type = "text";
    taskTextInput.className = "edit-task";
    taskTextInput.value = taskText;
  
    const taskDueDateInput = document.createElement("input");
    taskDueDateInput.type = "date";
    taskDueDateInput.className = "edit-due-date";
    taskDueDateInput.value = taskDueDate;
  
    taskItem.innerHTML = "";
    taskItem.appendChild(taskTextInput);
    taskItem.appendChild(taskDueDateInput);
  
    taskTextInput.addEventListener("blur", () => {
      const newTaskText = taskTextInput.value.trim();
      const newDueDateText = taskDueDateInput.value.trim();
  
      if (!newTaskText) {
        tasks.splice(taskIndex, 1);
        taskList.removeChild(taskItem);
      } else {
        tasks[taskIndex].text = newTaskText;
        tasks[taskIndex].dueDate = newDueDateText;
  
        const taskTextElement = document.createElement("span");
        taskTextElement.className = "task-text";
        taskTextElement.textContent = newTaskText;
  
        const dueDateElement = document.createElement("span");
        dueDateElement.className = "due-date";
        dueDateElement.textContent = newDueDateText;
  
        taskItem.innerHTML = "";
        taskItem.appendChild(taskTextElement);
        taskItem.appendChild(dueDateElement);
        taskItem.appendChild(editBtn);
        taskItem.appendChild(deleteBtn);
  
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", editTask);
  
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", deleteTask);
      }
  
      updateTasks();
    });
  }
  
  