// DOM Elements
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const modeBtns = document.querySelectorAll(".mode-btn");
const timeBtns = document.querySelectorAll(".time-btn");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const minimizeBtn = document.getElementById("minimize-btn");
const settingsBtn = document.getElementById("settings-btn");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const settingsModal = document.getElementById("settings-modal");
const updateSettingsBtn = document.getElementById("update-settings");
const container = document.querySelector(".container");

// Mini Window Controls
const miniTimerBtn = document.getElementById("mini-timer-btn");
const miniBreakBtn = document.getElementById("mini-break-btn");
const miniLongBreakBtn = document.getElementById("mini-long-break-btn");

// Timer Variables
let timer;
let isRunning = false;
let currentMode = "focus";
let modeTimes = {
  focus: 25 * 60,
  "short-break": 5 * 60,
  "long-break": 15 * 60,
};
let timeLeft = modeTimes[currentMode];

let miniWindow = null;

// Add this with your other DOM element declarations at the top
const exitFullscreenBtn = document.createElement("button");
exitFullscreenBtn.className = "exit-fullscreen-btn";
exitFullscreenBtn.innerHTML = `
  <svg width="16" height="16" viewBox="0 0 16 16">
    <path fill="currentColor" d="M5.5 0h-5v5h1V1h4V0zM10.5 0v1h4v4h1V0h-5zM0.5 10.5v4h4v1h-5v-5h1zM14.5 10.5h1v5h-5v-1h4v-4z"/>
  </svg>
  Exit Fullscreen
`;
document.body.appendChild(exitFullscreenBtn);

// Initialize
updateDisplay();

// Event Listeners
startBtn.addEventListener("click", toggleTimer);

modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => switchMode(btn.dataset.mode));
});

timeBtns.forEach((btn) => {
  btn.addEventListener("click", () => addTime(parseInt(btn.dataset.minutes)));
});

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && taskInput.value.trim() !== "") {
    addTask(taskInput.value.trim());
    taskInput.value = "";
  }
});

// Control Button Event Listeners
minimizeBtn.addEventListener("click", toggleMinimize);
settingsBtn.addEventListener("click", toggleSettings);
fullscreenBtn.addEventListener("click", toggleFullscreen);
updateSettingsBtn.addEventListener("click", updateTimerSettings);

// Mini Window Control Event Listeners
miniTimerBtn.addEventListener("click", () => switchMode("focus"));
miniBreakBtn.addEventListener("click", () => switchMode("short-break"));
miniLongBreakBtn.addEventListener("click", () => switchMode("long-break"));

// Functions
function createMiniWindow() {
  // Create mini window if it doesn't exist
  if (!miniWindow) {
    miniWindow = document.createElement("div");
    miniWindow.className = "mini-window";
    miniWindow.innerHTML = `
      <div id="mini-timer">25:00</div>
      <div class="mini-controls">
        <button class="mini-control-btn" id="mini-timer-btn" title="Timer">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 2C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-12h-2v4h2v-4z"/>
          </svg>
        </button>
        <button class="mini-control-btn" id="mini-break-btn" title="Break">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M2 21v-2h18v2H2zm3-6.857V8.857C5 5.641 7.641 3 10.857 3h2.286C16.359 3 19 5.641 19 8.857v5.286h-2V8.857C17 6.744 15.256 5 13.143 5h-2.286C8.744 5 7 6.744 7 8.857v5.286H5z"/>
          </svg>
        </button>
        <button class="mini-control-btn" id="mini-long-break-btn" title="Long Break">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14z"/>
            <path fill="currentColor" d="M9 8h2v8H9zm4 0h2v8h-2z"/>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(miniWindow);

    // Add event listeners to mini window controls
    const miniTimerBtn = miniWindow.querySelector("#mini-timer-btn");
    const miniBreakBtn = miniWindow.querySelector("#mini-break-btn");
    const miniLongBreakBtn = miniWindow.querySelector("#mini-long-break-btn");

    miniTimerBtn.addEventListener("click", () => switchMode("focus"));
    miniBreakBtn.addEventListener("click", () => switchMode("short-break"));
    miniLongBreakBtn.addEventListener("click", () => switchMode("long-break"));

    // Make mini window draggable
    makeDraggable(miniWindow);

    // Position mini window initially
    miniWindow.style.position = "fixed";
    miniWindow.style.right = "20px";
    miniWindow.style.top = "20px";
  }

  // Show mini window
  miniWindow.style.display = "block";
}

function removeMiniWindow() {
  if (miniWindow) {
    miniWindow.style.display = "none";
  }
}

function toggleMinimize() {
  const isMinimized = minimizeBtn.classList.toggle("minimized");

  if (isMinimized) {
    createMiniWindow();
  } else {
    removeMiniWindow();
  }

  // Update minimize button icon
  minimizeBtn.innerHTML = isMinimized
    ? '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M14 8v1H3V8h11z"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M14 8v1H3V8h11z"/></svg>';
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  // Update main timer
  timerDisplay.textContent = timeString;

  // Update mini timer if it exists
  if (miniWindow && miniWindow.style.display === "block") {
    const miniTimer = miniWindow.querySelector("#mini-timer");
    if (miniTimer) {
      miniTimer.textContent = timeString;
    }

    // Update active states for mini controls
    const miniTimerBtn = miniWindow.querySelector("#mini-timer-btn");
    const miniBreakBtn = miniWindow.querySelector("#mini-break-btn");
    const miniLongBreakBtn = miniWindow.querySelector("#mini-long-break-btn");

    if (miniTimerBtn && miniBreakBtn && miniLongBreakBtn) {
      miniTimerBtn.classList.toggle("active", currentMode === "focus");
      miniBreakBtn.classList.toggle("active", currentMode === "short-break");
      miniLongBreakBtn.classList.toggle("active", currentMode === "long-break");
    }
  }

  // Update the document title with timer and mode
  const modeText = currentMode
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  document.title = `${timeString} - ${modeText}`;
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timer);
    startBtn.textContent = "Start";
    isRunning = false;
  } else {
    timer = setInterval(() => {
      timeLeft--;
      updateDisplay();

      if (timeLeft <= 0) {
        clearInterval(timer);
        startBtn.textContent = "Start";
        isRunning = false;
        alert(
          `${currentMode === "focus" ? "Work" : "Break"} session complete!`
        );
      }
    }, 1000);
    startBtn.textContent = "Pause";
    isRunning = true;
  }
}

function switchMode(mode) {
  if (isRunning) {
    if (!confirm("Switch mode? This will reset the current timer.")) return;
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = "Start";
  }

  currentMode = mode;
  timeLeft = modeTimes[mode];
  updateDisplay();

  modeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
}

function addTime(minutes) {
  if (!isRunning) {
    timeLeft += minutes * 60;
    updateDisplay();
  }
}

function toggleSettings() {
  settingsModal.classList.toggle("show");
  // Set current values in settings
  document.getElementById("focus-duration").value = Math.floor(
    modeTimes.focus / 60
  );
  document.getElementById("short-break").value = Math.floor(
    modeTimes["short-break"] / 60
  );
  document.getElementById("long-break").value = Math.floor(
    modeTimes["long-break"] / 60
  );
}

function toggleFullscreen() {
  container.classList.add("fullscreen");
}

function updateTimerSettings() {
  const focusDuration = parseInt(
    document.getElementById("focus-duration").value
  );
  const shortBreak = parseInt(document.getElementById("short-break").value);
  const longBreak = parseInt(document.getElementById("long-break").value);

  if (
    isNaN(focusDuration) ||
    isNaN(shortBreak) ||
    isNaN(longBreak) ||
    focusDuration < 1 ||
    shortBreak < 1 ||
    longBreak < 1
  ) {
    alert("Please enter valid numbers for all durations");
    return;
  }

  // Update timer settings
  modeTimes = {
    focus: focusDuration * 60,
    "short-break": shortBreak * 60,
    "long-break": longBreak * 60,
  };

  // Update current timer if not running
  if (!isRunning) {
    timeLeft = modeTimes[currentMode];
    updateDisplay();
  }

  // Close settings modal
  settingsModal.classList.remove("show");
}

// Make the minimized window draggable
function makeDraggable(element) {
  let isDragging = false;
  let startX, startY;

  function onMouseDown(e) {
    // Don't start drag if clicking on a button or control
    if (
      e.target.closest(".control-btn") ||
      e.target.closest(".mini-control-btn")
    ) {
      return;
    }

    isDragging = true;
    element.classList.add("dragging");

    // Get the current mouse position
    startX = e.clientX - element.offsetLeft;
    startY = e.clientY - element.offsetTop;

    // Add temporary event listeners
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e) {
    if (!isDragging) return;

    e.preventDefault();

    // Calculate the new position
    let newX = e.clientX - startX;
    let newY = e.clientY - startY;

    // Get window boundaries
    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;

    // Keep the element within the window bounds
    newX = Math.min(Math.max(0, newX), maxX);
    newY = Math.min(Math.max(0, newY), maxY);

    // Update the element position
    element.style.left = newX + "px";
    element.style.top = newY + "px";
  }

  function onMouseUp() {
    isDragging = false;
    element.classList.remove("dragging");

    // Remove temporary event listeners
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  // Add the main mouse down listener
  element.addEventListener("mousedown", onMouseDown);

  // Store the event listener removal function
  element.cleanupDraggable = () => {
    element.removeEventListener("mousedown", onMouseDown);
  };
}

function removeDraggable(element) {
  if (element.cleanupDraggable) {
    element.cleanupDraggable();
  }
  element.style.position = "";
  element.style.left = "";
  element.style.top = "";
  element.classList.remove("dragging");
}

// Helper function to re-attach event listeners after removing draggable
function attachEventListeners(element) {
  const startBtn = element.querySelector("#start-btn");
  const modeBtns = element.querySelectorAll(".mode-btn");
  const timeBtns = element.querySelectorAll(".time-btn");
  const taskInput = element.querySelector("#task-input");
  const minimizeBtn = element.querySelector("#minimize-btn");
  const settingsBtn = element.querySelector("#settings-btn");
  const fullscreenBtn = element.querySelector("#fullscreen-btn");
  const miniTimerBtn = element.querySelector("#mini-timer-btn");
  const miniBreakBtn = element.querySelector("#mini-break-btn");
  const miniLongBreakBtn = element.querySelector("#mini-long-break-btn");

  if (startBtn) startBtn.addEventListener("click", toggleTimer);
  if (modeBtns)
    modeBtns.forEach((btn) => {
      btn.addEventListener("click", () => switchMode(btn.dataset.mode));
    });
  if (timeBtns)
    timeBtns.forEach((btn) => {
      btn.addEventListener("click", () =>
        addTime(parseInt(btn.dataset.minutes))
      );
    });
  if (taskInput)
    taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && taskInput.value.trim() !== "") {
        addTask(taskInput.value.trim());
        taskInput.value = "";
      }
    });
  if (minimizeBtn) minimizeBtn.addEventListener("click", toggleMinimize);
  if (settingsBtn) settingsBtn.addEventListener("click", toggleSettings);
  if (fullscreenBtn) fullscreenBtn.addEventListener("click", toggleFullscreen);
  if (miniTimerBtn)
    miniTimerBtn.addEventListener("click", () => switchMode("focus"));
  if (miniBreakBtn)
    miniBreakBtn.addEventListener("click", () => switchMode("short-break"));
  if (miniLongBreakBtn)
    miniLongBreakBtn.addEventListener("click", () => switchMode("long-break"));
}

function addTask(taskText) {
  const taskItem = document.createElement("li");
  taskItem.innerHTML = `
    <span>${taskText}</span>
    <div class="task-actions">
      <button class="complete-btn">✓</button>
      <button class="delete-btn">✕</button>
    </div>
  `;

  taskList.appendChild(taskItem);

  taskItem.querySelector(".complete-btn").addEventListener("click", () => {
    taskItem.style.textDecoration = "line-through";
    taskItem.style.opacity = "0.6";
  });

  taskItem.querySelector(".delete-btn").addEventListener("click", () => {
    taskItem.remove();
  });
}

// Close settings modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.remove("show");
  }
});

// Add exit fullscreen handler
exitFullscreenBtn.addEventListener("click", () => {
  container.classList.remove("fullscreen");
});

// Add keyboard event listener for Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && container.classList.contains("fullscreen")) {
    container.classList.remove("fullscreen");
  }
});
