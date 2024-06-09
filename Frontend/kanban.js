

const boardContainer = document.getElementById("boardContainer");
const boardName = document.getElementById("boardName");
const todoContainer = document.querySelector(".todoContainer");
const doingContainer = document.querySelector(".doingContainer");
const doneContainer = document.querySelector(".doneContainer");
const createboardBtn = document.querySelector("#createBoardBtn");
const createboard = document.querySelector("#createboard");
const closeBoard = document.querySelector("#closeBoard");
const boardNameInput = document.querySelector("#boardNameInput");
const createBoardInputBtn = document.querySelector("#createBoardInputBtn");
const createtask = document.querySelector("#createtask");
const closeTask = document.getElementById("closeTask");
const createTaskBtn = document.getElementById("createTaskBtn");
const updateStatusBtn = document.querySelectorAll("#updateStatusBtn");
const closeViewSubtask = document.querySelector("#closeViewSubtask");
const viewtask = document.querySelector("#viewtask");
const subtasklistview = document.querySelector("#subtasklistview");
const viewTaskHeading = document.querySelector("#viewTaskHeading");
const updatesubTaskBtn = document.querySelector("#updatesubTaskBtn");
const viewTaskForm = document.querySelector("#viewTaskForm");
const statusSelectView = document.querySelector("#statusSelectView");
const updatesubTaskBtnUVSing = document.querySelector("#updatesubTaskBtnUVSing");

const BaseURL = `https://kanban-task-mangment-tool-1.onrender.com`;

let currentBoardIfForCheck = null;

let currentBoardId = null;
let selectedBoardElement = null;

createboardBtn.addEventListener("click", () => {
  createboard.classList.toggle("hid");
});

closeBoard.addEventListener("click", () => {
  createtask.classList.toggle("hid");
});

createTaskBtn.addEventListener("click", () => {
    createtask.classList.toggle("hid");
});

closeTask.addEventListener("click", () => {
    createtask.classList.toggle("hid");
});

closeViewSubtask.addEventListener("click", () => {
  getBoardDetails(currentBoardIfForCheck);
  viewtask.classList.toggle("hid");
  
});

updatesubTaskBtnUVSing.addEventListener("click", () => {
  getBoardDetails(currentBoardIfForCheck);
  viewtask.classList.toggle("hid");
})
const addBoard = async () => {
  try {
    const board = {
      name: boardNameInput.value,
    };
    const token = localStorage.getItem("token");
    let url = `${BaseURL}/board`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(board),
    });
    const data = await res.json();
    getBoards();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
createBoardInputBtn.addEventListener("click", () => {
  addBoard();
  createboard.classList.toggle("hid");
  getBoards();
});

async function getBoards(boardId = null) {
  try {
    const token = localStorage.getItem("token");
    let url = `https://kanban-task-mangment-tool-1.onrender.com/board`;
    if (boardId) {
      url += `/${boardId}`;
    }
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data);
    if (!boardId) {
      boardContainer.innerHTML = "";
      let count = 0;
      data.boards.forEach((board) => {
        const div = document.createElement("div");
        div.innerText = board.name;
        const i = document.createElement("span");
        i.classList.add("delete_board");
        i.addEventListener("click", () => deleteBoard(board._id));
        i.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        div.append(i);
        div.className = "board";
        div.addEventListener("click", () => selectBoard(board._id, div));
        boardContainer.appendChild(div);
        if (count === 0) {
          selectBoard(board._id, div);
          count++;
        }
      });
    } else {
      todoContainer.innerHTML = "";
      doingContainer.innerHTML = "";
      doneContainer.innerHTML = "";
      appendData(data.tasks);
      if (currentBoardId !== boardId) {
        currentBoardId = boardId;
        boardName.innerText = data.name;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

getBoards();

async function deleteBoard(boardId) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BaseURL}/board/${boardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data);
    getBoards();
  } catch (error) {
    console.error(error);
  }
}

function selectBoard(boardId, boardElement) {
  if (selectedBoardElement) {
    selectedBoardElement.classList.remove("selected");
  }
  currentBoardId = boardId;
  selectedBoardElement = boardElement;
  selectedBoardElement.classList.add("selected");
  getBoardDetails(boardId);
  currentBoardIfForCheck = boardId;
}

function appendData(tasks) {
  tasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.addEventListener("click", () => {
      viewtask.classList.toggle("hid");
      viewSubtasks(task._id);
    });
    const titleHeading = document.createElement("h3");
    titleHeading.innerText = task.title;
    taskDiv.appendChild(titleHeading);

    const subtaskCount = document.createElement("div");
    let subtaskArrayCount = task.subtasks.length;

    subtaskCount.innerText = ` ${subtaskArrayCount} sub-tasks`;
    const i = document.createElement("span");
    i.classList.add("delete_task_btn");
    i.innerHTML = `<i class="fa-solid fa-trash"></i>`
    i.addEventListener("click", () => deleteTask(task._id, taskDiv));
    taskDiv.append(subtaskCount, i);

    if (task.status === "Todo") {
      taskDiv.classList.add("todoItem");
      todoContainer.appendChild(taskDiv);
    } else if (task.status === "Doing") {
      taskDiv.classList.add("doItem");
      doingContainer.appendChild(taskDiv);
    } else if (task.status === "Done") {
      taskDiv.classList.add("doneItem");
      doneContainer.appendChild(taskDiv);
    }
  });
}

async function getBoardDetails(boardId) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BaseURL}/board/${boardId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data.tasks);

    todoContainer.innerHTML = "";
    doingContainer.innerHTML = "";
    doneContainer.innerHTML = "";

    appendData(data.tasks);
    



    boardName.innerText = data.name;
  } catch (error) {
    console.error(error);
  }
}

const createTaskBtnsubmit = document.getElementById("createTaskBtnsubmit");

createTaskBtnsubmit.addEventListener("click", () => {
    addTask();
});

const addTask = async () => {
    try {
        const taskName = document.getElementById("taskNameInput").value;
        const taskDescription = document.getElementById("taskDescriptionInput").value;
        const status = document.getElementById("statusSelect").value;


        const task = {
            title: taskName,
            description: taskDescription,
            status: status
        };

        const token = localStorage.getItem("token");
        const url = `${BaseURL}/task/${currentBoardId}`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(task),
        });

        const data = await res.json();
        console.log(data.task);
        console.log(status);
        console.log(data.task._id);
        const subtaskArray = document.querySelectorAll(".subtaskInp");
        console.log(subtaskArray);

        subtaskArray.forEach(async (subtask) => {
            const obj = {
                title: subtask.value,
                isCompleted: false,
            };
            createSubtask(data.task._id, obj, currentBoardId);
        })
        getBoardDetails(currentBoardId);
        createtask.classList.toggle("hid"); // Hide the create task dialog
    } catch (error) {
        console.error(error);
    }
};

async function createSubtask(taskId, subtask, currentBoardId) {
    try {
        const token = localStorage.getItem("token");
        const url = `${BaseURL}/subtask/${taskId}`; // Updated URL to include taskId
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(subtask),
        });

        const data = await res.json();
        console.log(data);
        getBoardDetails(currentBoardId);
    } catch (error) {
        console.error(error);
    }
}

const addsubtaskbtn = document.getElementById("addsubtaskbtn");
const subtasklist = document.getElementById("subtasklist");

addsubtaskbtn.addEventListener("click", () => {
    const subtaskInp = document.createElement("input");
    subtaskInp.type = "text";
    subtaskInp.placeholder = "Enter the subtask";
    subtaskInp.classList.add("subtaskInp");
    subtasklist.appendChild(subtaskInp);
})

async function deleteTask(taskId, taskDiv) {
    try {
        const token = localStorage.getItem("token");
        const url = `${BaseURL}/task/${taskId}`;
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        console.log(data);
        taskDiv.remove();
    } catch (error) {
        console.error(error);
    }
}

async function viewSubtasks(taskId) {
    const token = localStorage.getItem("token");
    const url = `${BaseURL}/subtask/${taskId}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    subtaskAppend(data.subtasks, taskId);
    console.log(data);
}

async function subtaskAppend(subtasks, taskId) {
  subtasklistview.innerHTML = "";

  subtasks.forEach((subtask) => {
    const subtaskDiv = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.innerText = taskId.status;
    subtaskDiv.classList.add("subtaskDiv");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    
    
    const flag = subtask.isCompleted;
    console.log(flag, subtask._id);
    
    checkbox.addEventListener("click", () => {
      updateSubtaskfuction(subtask._id, flag);
    })

    checkbox.checked = subtask.isCompleted;
    subtaskDiv.innerText = subtask.title;
    subtasklistview.append( subtaskDiv , checkbox);
  })

  statusSelectView.addEventListener("change", (e) => {
    const status = e.target.value;
    console.log(status);
    updateTaskstatus(taskId, status);
  })

}


async function updateSubtaskfuction(taskId, flag) {
  const token = localStorage.getItem("token");
  const url = `${BaseURL}/subtask/${taskId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isCompleted: flag ? false : true }),
  });
  const data = await res.json();
  console.log(data);
}



async function updateTaskstatus (taskId, status) {
  const token = localStorage.getItem("token");
  const url = `${BaseURL}/task/${taskId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: status }),
  });
  const data = await res.json();
  console.log(data);
}