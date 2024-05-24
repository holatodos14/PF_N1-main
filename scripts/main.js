// Buttons
const all = document.querySelector("#all");
const active = document.querySelector("#active");
const completed = document.querySelector("#completed");
// Information to add
const myTaskList = document.querySelector("#task-list");
const newTaskInput = document.getElementById("new-task");
const addBtn = document.getElementById("add-btn");
const deleteAllBtn = document.getElementById("delete-all-btn");
const removeOneTask = document.querySelector(".listTaskButton")

// Initialize local storage if not present
if (localStorage.getItem("myList") === null) {
    localStorage.setItem("myList", JSON.stringify([]));
}

let myList = JSON.parse(localStorage.getItem("myList"));

// Function to apply style line
function style(input, label) {
    if (input.checked === true) {
        label.setAttribute('style', 'text-decoration: line-through');
    } else {
        label.setAttribute('style', 'text-decoration: none');
    }
}

// Functions to view all tasks
function getAllTasks(tasksArray, filter) {
    myTaskList.innerHTML = ''; // Clear the list
    tasksArray.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.className = 'task';
        taskElement.dataset.id = task.id;
        taskElement.innerHTML = `
            <li>
                <label>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
                    <span>${task.title}</span>
                </label>
                ${filter === 'completed' ? `<button class="listTaskButton" onclick="deleteTask(${task.id})"><i class="fa-solid fa-trash"></i></button>` : ''}
            </li>
        `;
        myTaskList.appendChild(taskElement);
        
        // Apply style based on completion state
        const input = taskElement.querySelector('input[type="checkbox"]');
        const label = taskElement.querySelector('label span');
        style(input, label);
    });
}

// Function to update local storage
function updateLocalStorage() {
    localStorage.setItem("myList", JSON.stringify(myList));
}

// Function to add a task
function addTask() {
    const title = newTaskInput.value.trim();
    if (title) {
        const newTask = {
            id: myList.length ? myList[myList.length - 1].id + 1 : 1,
            title,
            completed: false
        };
        myList.push(newTask);
        newTaskInput.value = ''; // Clear the input field
        updateLocalStorage(); // Update local storage
        getAllTasks(myList); // Re-render tasks
    }
}

// Function to mark a task as completed or incomplete
function toggleTask(id) {
    const task = myList.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        updateLocalStorage(); // Update local storage
        getAllTasks(myList); // Re-render the task list
    } else {
        console.error('Task not found.');
    }
}

// Function to delete a task
function deleteTask(id) {
    myList = myList.filter(task => task.id !== id);
    updateLocalStorage(); // Update local storage
    filterTasks("completed");
}

// Function to delete all completed tasks
function deleteAllCompletedTasks() {
    myList = myList.filter(task => !task.completed);
    updateLocalStorage(); // Update local storage
    filterTasks("completed"); // Re-render tasks
}

// Function to filter tasks
function filterTasks(filter) {
    const filteredTasks = myList.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
    });

    getAllTasks(filteredTasks, filter); //

    // Show or hide deleteAllBtn based on filter
    if (filter === 'completed') {
        deleteAllBtn.style.display = 'block';
    } else {
        deleteAllBtn.style.display = 'none';
    }
    addColorButton(filter);
}
function addColorButton(filter) {
    // Remove 'active' class from all buttons
    all.classList.remove('active');
    active.classList.remove('active');
    completed.classList.remove('active');

    // Add 'active' class to the button corresponding to the filter
    switch (filter) {
        case "all":
            all.classList.add('active');
            break;
        case "active":
            active.classList.add('active');
            break;
        case "completed":
            completed.classList.add('active');
            break;
        default:
            // Handle unexpected filter values
            break;
    }
}

// Event listeners
addBtn.addEventListener('click', addTask);
deleteAllBtn.addEventListener('click', deleteAllCompletedTasks);
all.addEventListener('click', () => {
    filterTasks('all');
});
active.addEventListener('click', () => {
    filterTasks('active');
});
completed.addEventListener('click', () => {
    filterTasks('completed');
});

getAllTasks(myList);

