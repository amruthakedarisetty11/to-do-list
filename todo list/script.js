const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>

            <div>
                <button class="toggle" data-id="${task.id}">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="delete" data-id="${task.id}">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Add task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

// Add button event
addBtn.addEventListener("click", addTask);

// Enter key event
taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Event Delegation
taskList.addEventListener("click", e => {
    const id = Number(e.target.dataset.id);

    // Toggle completion
    if (e.target.classList.contains("toggle")) {
        tasks = tasks.map(task =>
            task.id === id
                ? { ...task, completed: !task.completed }
                : task
        );
    }

    // Delete task
    if (e.target.classList.contains("delete")) {
        tasks = tasks.filter(task => task.id !== id);
    }

    saveTasks();
    renderTasks();
});

// Filter buttons
document.querySelector(".filters").addEventListener("click", e => {
    if (e.target.dataset.filter) {
        currentFilter = e.target.dataset.filter;
        renderTasks();
    }
});

// Initial render
renderTasks();
