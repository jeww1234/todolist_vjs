import "./style.css";

let taskinput = document.getElementById("task-input");
console.log(taskinput);

//마감일
const deadline = document.getElementById("deadline");
let deadlineSelected = deadline.value;
if (!deadlineSelected || isNaN(new Date(deadlineSelected))) {
  deadlineSelected = new Date().toISOString().split("T")[0]; // 오늘 날짜로 기본 설정
}

deadline.addEventListener("change", () => {
  deadlineSelected = deadline.value;
  console.log("1231231", deadlineSelected);
});

//정렬
const prioritySort = document.getElementById("sort");
console.log(prioritySort);
let prioritySorted = prioritySort.value;

prioritySort.addEventListener("change", () => {
  prioritySorted = prioritySort.value;
  console.log(prioritySorted);
  if (prioritySorted === "중요도") {
    taskList.sort((a, b) => parseInt(b.priority) - parseInt(a.priority));
  }else if(prioritySorted === "마감일") 
    taskList.sort((a,b) =>new Date(a.dueDate) - new Date(b.dueDate))
  render();
});

//중요도
const prioritySelect = document.getElementById("prioritySelect");
let prioritySelected = prioritySelect.value;

prioritySelect.addEventListener("change", () => {
  prioritySelected = prioritySelect.value;
  console.log(prioritySelected);
  taskinput.focus();
});

//주기
const cycleSelect = document.getElementById("cycleSelect");
let cycleSelected = cycleSelect.value;

cycleSelect.addEventListener("change", () => {
  cycleSelected = cycleSelect.value;
  console.log(cycleSelected);
  taskinput.focus();
});

taskinput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const tasks = taskinput.value.trim();
    if (tasks !== "") {
      addtask();
    }
  }
});

let addbutton = document.getElementById("add-button");
let taskList = [];
let tabs = document.querySelectorAll(".task-tabs div");
console.log(tabs);
let mode = "all";

const filter = (event) => {
  console.log("event", event.target.id);
  mode = event.target.id;
  render();
};

for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener("click", (e) => filter(e));
}

const randomIDGenerate = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

const addtask = () => {
  console.log("haha");
  let task = {
    id: randomIDGenerate(),
    taskContent: taskinput.value,
    isComplete: false,
    priority: prioritySelected,
    cycle: cycleSelected,
    dueDate: deadlineSelected,
    daysLeft: Math.ceil(
      (new Date(deadlineSelected) - new Date()) / (1000 * 60 * 60 * 24)
    ),
  };
  taskList.push(task);
  const today = new Date();
  const daysLeft = Math.ceil(
    (new Date(task.dueDate) - today) / (1000 * 60 * 60 * 24)
  );
  console.log("task", taskList);
  taskinput.value = "";

  render();
};

const toggleComplete = (id) => {
  console.log(id, "토글");
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  console.log(taskList);
  render();
};

const deletetask = (id) => {
  console.log("딜리트", id);
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList.splice(i, 1);
      break;
    }
  }
  render();
};

const renderPriorityStars = (priority) => {
  const startCount = parseInt(priority);
  return "⭐".repeat(startCount);
};

const renderCycletext = (cycle) => {
  const cycleText = cycle;
  return cycleText;
};
const getFontColor = (daysLeft) => {
  if (daysLeft <= 1) return "red";
  else if (daysLeft <= 3) return "orange";
  else return "green";
};

const render = () => {
  let list = [];
  //선택한 탭에 따라 리스트를 다르게
  //all - taskList
  if (mode === "all") {
    //taskList
    list = taskList;
  } else if (mode === "ndone") {
    //filterList
    list = taskList.filter((task) => !task.isComplete);
  } else if (mode === "done") {
    list = taskList.filter((task) => task.isComplete);
  }
  let resultHtml = "";
  for (let i = 0; i < list.length; i++) {
    list[i].daysLeft = Math.ceil(
      (new Date(list[i].dueDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    const color = getFontColor(list[i].daysLeft);
    if (list[i].isComplete === true) {
      resultHtml += `<div class="flex flex-col">
      <div class="flex pc-box">
            <div class = "priority-area">중요도 : ${renderPriorityStars(
              list[i].priority
            )}</div>
            <div class = "cycle-area">주기 : ${renderCycletext(
              list[i].cycle
            )}</div>
            </div>
            <div class="flex justify-between items-center p-[5px]">

            <div class="task-done">${list[i].taskContent}</div>

            <div>
              <button class="check-btn" data-id="${list[i].id}">Check</button>
              <button class="delete-btn" data-id="${list[i].id}">Delete</button>
            </div>
            </div>

            
        </div>`;
    } else {
      resultHtml += `<div class="flex flex-col">
      <div class="flex pc-box">
            <div class = "priority-area">중요도 : ${renderPriorityStars(
              list[i].priority
            )}</div>
            <div class = "cycle-area">주기 : ${renderCycletext(
              list[i].cycle
            )}</div>
            </div>
            <div class="flex justify-between items-center px-[10px]">

            <div class="task-ndone" style= "color:${color}">${
        list[i].taskContent
      }</div>

            <div>
              <button class="check-btn bg-[#ccc]" data-id="${list[i].id}">Check</button>
              <button class="delete-btn bg-[#ccc]" data-id="${list[i].id}">Delete</button>
            </div>
            </div>

            

            
        </div>`;
    }
  }

  document.getElementById("task-board").innerHTML = resultHtml;

  //모듈방식 온클릭x check
  document.querySelectorAll(".check-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      toggleComplete(id);
    });
  });

  //delete
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      deletetask(id);
    });
  });
};

addbutton.addEventListener("click", addtask);
