document.addEventListener('DOMContentLoaded', function() {
  const todoTable = document.getElementById("to-do-list-table")
  const addTaskButton = document.getElementById("add-task-btn")
  const addTaskModal = document.getElementById("add-row-modal")
  const taskInfoModal = document.getElementById("task-info-modal")
  const scheduleModal = document.getElementById("schedule-modal")
  const scheduleButton = document.getElementById("schedule-btn")
  
  let taskDataArrayJSON = localStorage.getItem("taskDataArray");
  let taskDataArray = JSON.parse(taskDataArrayJSON) || [];

  if (taskDataArray.length > 0) {
    for (let i = 0; i < taskDataArray.length; i++) {
      const taskData = taskDataArray[i];
      const newRow = createTableRow(taskData);
      todoTable.appendChild(newRow);
    }
  }

  function createTableRow(taskData) {
    const newRow = document.createElement("tr");

    const taskCell = document.createElement("td");
    taskCell.className = "table-cell";
    taskCell.textContent = taskData.task;
    newRow.appendChild(taskCell);
  
  
  const dateCell = document.createElement("td")
  dateCell.className = "table-cell editable-cell"
  dateCell.textContent = taskData.date
  newRow.appendChild(dateCell)

  const statusCell = document.createElement("td");
    statusCell.className = "table-cell";
    statusCell.textContent = taskData.status;
    newRow.appendChild(statusCell)

  const linkCell = document.createElement("td")
  linkCell.className = "table-cell link-cell"
  const linkAnchor = document.createElement("a")
  linkAnchor.target = "_blank"
  linkAnchor.href = taskData.link
  linkAnchor.textContent = taskData.truncatedLink
  linkCell.appendChild(linkAnchor)
  newRow.appendChild(linkCell)

  const deleteCell = document.createElement("td")
  const deleteButton = document.createElement("button")
  deleteButton.className = "deleteButton"
  const deleteIcon = document.createElement("span")
  deleteIcon.className = "material-icons"
  deleteIcon.textContent = "delete"
  deleteButton.appendChild(deleteIcon)
  deleteCell.appendChild(deleteButton)
  newRow.appendChild(deleteCell)
  return newRow
}
  let restrictedURLs = [
    'chrome://*',
    'chrome-extension://*',
    'chrome://newtab/',
    'file://*'
  ]
  function openAddTaskModal() {
    addTaskModal.style.display = "block"
    addTaskModal.style.overflow = "hidden"
  }
  
  function openScheduleModal() {
    const documentBody = document.body
    documentBody.style.height = "600px"
    scheduleModal.style.display = "block"
  }



addTaskButton.addEventListener("click", openAddTaskModal)
scheduleButton.addEventListener("click", openScheduleModal)



todoTable.addEventListener("click", function(event) {
  if (event.target.classList.contains("deleteButton")) {
    deleteTask(event.target)
  }
})

window.onclick = function(event) {
  if (event.target === addTaskModal) {
    addTaskModal.style.display = "none"
  } else if (event.target === taskInfoModal) {
    taskInfoModal.style.display = "none"
  } else if (event.target === scheduleModal) {
      const documentBody = document.body
      documentBody.style.height ="280px"
      scheduleModal.style.display = "none"
    }

}

  function areAllInputsFilled() {
    /*const inputElements = document.getElementsByClassName("add-row-input")
    for (const inputElement of inputElements) {
      if (inputElement.value.trim() === '') {
        return false
      }
    }
    return true
    */
   return true
  }

  function addTask() {
    if (areAllInputsFilled()) {
      const addTaskModal = document.getElementById("add-row-modal");
      addTaskModal.style.display = "none";
  
      const table = document.getElementById("to-do-list-table");
      const newRow = document.createElement("tr");
      const taskInput = document.getElementById("add-task");
      const dateInput = document.getElementById("add-date");
      const linkInput = document.getElementById("add-link");
      const statusInput = document.getElementById("add-status");
      const linkValue = linkInput.value.trim();
  
      const truncatedLinkValue =
        linkValue.length > 25 ? linkValue.substring(0, 25) + "..." : linkValue;
  
      if (restrictedURLs.some((url) => linkValue.startsWith(url))) {
        alert("Cannot add a row with a restricted URL.");
        return;
      }
  
  
      const taskData = {
        task: taskInput.value,
        date: dateInput.value,
        status: statusInput.value,
        link: linkInput.value,
        truncatedLink: truncatedLinkValue
      };
  
      taskDataArray.push(taskData);
      localStorage.setItem("taskDataArray", JSON.stringify(taskDataArray));
  
      newRow.innerHTML = `
        <td class="table-cell task-cell">${taskInput.value}</td>
        <td class="table-cell editable-cell">${dateInput.value}</td>
        <td class="table-cell status-cell" id="statusCell">${statusInput.value}</td>
        <td class="table-cell link-cell"><a target='_blank' href='${linkValue}'>${truncatedLinkValue}</a></td>
        <td><button class="deleteButton"><span class="material-icons">delete</span></button></td>
      `;
 
      dateInput.value = "";
      linkInput.value = "";
  
      const deleteButton = newRow.querySelector(".deleteButton");
      deleteButton.addEventListener("click", function () {
        deleteTask(newRow);
      });
  
      const editableCells = newRow.querySelectorAll(".editable-cell");
      editableCells.forEach((cell) => {
        cell.addEventListener("dblclick", function (event) {
          event.preventDefault();
          const cellText = cell.innerText.trim();
          const inputField = document.createElement("input");
          inputField.value = cellText;
          cell.innerText = "";
          cell.appendChild(inputField);
          inputField.focus();
  
          inputField.addEventListener("blur", function () {
            const newText = inputField.value.trim();
            cell.innerText = newText;
          });
        });
      });
  
      table.appendChild(newRow);
    } else {
      alert("All fields are not filled. Please try again.");
    }
  }

  const addTaskSubmitButton = document.getElementById("addRowSubmit")
  addTaskSubmitButton.addEventListener("click", addTask)

  const deleteButtons = document.querySelectorAll(".deleteButton")
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      deleteTask(this)
    })
  })

  function deleteTask(button) {
    const row = button.closest("tr")
    if (row) {
      row.remove()
      const taskDataArray = JSON.parse(localStorage.getItem("taskDataArray"))
      const taskIndex = taskDataArray.findIndex((task) => task.task === row.querySelector(".table-cell").textContent)
      taskDataArray.splice(taskIndex, 1)
      localStorage.setItem("taskDataArray", JSON.stringify(taskDataArray))
    } else {
      console.log('Row element not found.')
    }
  }
    

  const startHour = 8
  const endHour = 24
  
  const scheduleList = document.getElementById('schedule-list')

  for (let hour = startHour ;hour <= endHour ;hour++) {
    const listItem = document.createElement('li')
    const timeSpan = document.createElement('span')
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    timeSpan.textContent = formatTime(hour)
  
    timeSpan.addEventListener('click', () => {
      const inputField = document.createElement('input')
      inputField.type = 'text'
      inputField.value = formatTime(hour)
      inputField.addEventListener('blur', () => {
        const newTime = inputField.value
        timeSpan.textContent = newTime
        localStorage.setItem(`time${hour}`, newTime)
      })
      inputField.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
          const newTime = inputField.value
          timeSpan.textContent = newTime
          localStorage.setItem(`time${hour}`, newTime)
        }
      })
      inputField.addEventListener('click', event => event.stopPropagation())
      timeSpan.textContent = ''
      timeSpan.appendChild(inputField)
      inputField.focus()
      inputField.select()
    })
  
    const eventInput = document.createElement('input')
    eventInput.type = 'text'
    eventInput.placeholder = `Event ${hour - startHour + 1}`
  
    const savedTime = localStorage.getItem(`time${hour}`)
    if (savedTime) {
      timeSpan.textContent = savedTime
    }
  
    const savedEvent = localStorage.getItem(`event${hour}`)
    if (savedEvent) {
      eventInput.value = savedEvent
    }
  
    eventInput.addEventListener('input', () => {
      localStorage.setItem(`event${hour}`, eventInput.value)
    })
  
    listItem.appendChild(checkbox)
    listItem.appendChild(timeSpan)
    listItem.appendChild(eventInput)
    scheduleList.appendChild(listItem)
  }
  
  function formatTime(hour) {
    if (hour === 24) {
      return `12:00 AM`
    } else if (hour < 12) {
      return `${hour}:00 AM`
    } else if (hour === 12) {
      return `${hour}:00 PM`
    } else if (hour > 12 && hour < 24) {
      return `${hour - 12}:00 PM`
    }
  }
  })