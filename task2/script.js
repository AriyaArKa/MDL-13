class TaskManager {
  constructor() {
    this.tasks = this.loadTasks();
    this.taskInput = document.getElementById("taskInput");
    this.addTaskBtn = document.getElementById("addTaskBtn");
    this.tasksList = document.getElementById("tasksList");
    this.successAlert = document.getElementById("successAlert");
    this.alertMessage = document.getElementById("alertMessage");

    this.bindEvents();
    this.renderTasks();
    this.updateStats();
  }

  bindEvents() {
    this.addTaskBtn.addEventListener("click", () => this.addTask());
    this.taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addTask();
    });
  }

  addTask() {
    const taskText = this.taskInput.value.trim();

    if (taskText === "") {
      alert("Please enter a task!");
      return;
    }

    const task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    this.tasks.unshift(task);
    this.saveTasks();
    this.taskInput.value = "";
    this.renderTasks();
    this.updateStats();
    this.showAlert("Task added successfully!");
  }

  deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
      this.tasks = this.tasks.filter((task) => task.id !== id);
      this.saveTasks();
      this.renderTasks();
      this.updateStats();
      this.showAlert("Task deleted successfully!");
    }
  }

  toggleTask(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.renderTasks();
      this.updateStats();
      this.showAlert(
        task.completed ? "Task completed!" : "Task marked as pending!"
      );
    }
  }

  renderTasks() {
    if (this.tasks.length === 0) {
      this.tasksList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-clipboard-list"></i>
                            <h4>No tasks yet!</h4>
                            <p>Add your first task to get started.</p>
                        </div>
                    `;
      return;
    }

    this.tasksList.innerHTML = this.tasks
      .map(
        (task) => `
                    <div class="task-item d-flex align-items-center ${
                      task.completed ? "task-completed" : ""
                    }">
                        <div class="task-text">
                            <h6 class="mb-1">${task.text}</h6>
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>${
                                  task.createdAt
                                }
                            </small>
                        </div>
                        <div class="task-actions">
                            <button class="btn btn-complete btn-sm me-2" onclick="taskManager.toggleTask(${
                              task.id
                            })">
                                <i class="fas ${
                                  task.completed ? "fa-undo" : "fa-check"
                                }"></i>
                            </button>
                            <button class="btn btn-delete btn-sm" onclick="taskManager.deleteTask(${
                              task.id
                            })">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `
      )
      .join("");
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((task) => task.completed).length;
    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
  }

  showAlert(message) {
    this.alertMessage.textContent = message;
    this.successAlert.classList.add("show");

    setTimeout(() => {
      this.successAlert.classList.remove("show");
    }, 3000);
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  loadTasks() {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  }
}

// Initialize the task manager
const taskManager = new TaskManager();
