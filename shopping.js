document.addEventListener('DOMContentLoaded', function() {
  const shoppingTable = document.getElementById("shopping-list-table");
  const addRowButton = document.getElementById("add-row-btn");
  const addRowWindow = document.getElementById("add-row-modal");
  const linkInput = document.getElementById("add-link");

  let restrictedURLs = [
    'chrome://*',
    'chrome-extension://*',
    'chrome://newtab/',
    'file://*'
  ];

  addRowButton.addEventListener("click", function() {    
    addRowWindow.style.display = "block";
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url;
      if (!restrictedURLs.some(pattern => new RegExp(pattern).test(url))) {
        linkInput.value = url;
        const event = new Event('input', { bubbles: true });
        linkInput.dispatchEvent(event);
      }
    });
  });

  window.onclick = function(event) {
    if (event.target === addRowWindow) {
      addRowWindow.style.display = "none";
    }
  };

  function areAllInputsFilled() {
    /*const inputElements = document.getElementsByClassName("add-row-input");
    for (const inputElement of inputElements) {
      if (inputElement.value.trim() === '') {
        return false;
      }
    }
    return true;*/
    return true
  }

  function addRow() {
    if (areAllInputsFilled()) {
      addRowWindow.style.display = "none";
      const table = document.getElementById("shopping-list-table");
      const newRow = document.createElement("tr");
      const store = document.getElementById("add-store");
      const price = document.getElementById("add-price");
      const item = document.getElementById("add-item");
      const link = document.getElementById("add-link");
      const linkValue = link.value.trim();
  
      const truncatedLinkValue = linkValue.length > 25 ? linkValue.substring(0, 25) + "..." : linkValue;

      if (restrictedURLs.some(url => linkValue.startsWith(url))) {
        alert("Cannot add a row with a restricted URL.");
        return;
      }

      newRow.innerHTML = `
        <td class="table-cell editable-cell wrap-cell">${item.value}</td>
        <td class="table-cell editable-cell">${store.value}</td>
        <td class="table-cell editable-cell">$${price.value}</td>
        <td class="table-cell link-cell"><a target='_blank' href='${linkValue}'>${truncatedLinkValue}</a></td>
        <td><button class="deleteButton"><span class="material-icons">delete</span></button></td>
      `;

      const rowData = {
        id: Date.now(),
        item: item.value,
        store: store.value,
        price: price.value,
        link: linkValue,
        truncatedLink: truncatedLinkValue
      };
      saveRowToLocalStorage(rowData);

      store.value = "";
      price.value = "";
      item.value = "";
      table.appendChild(newRow);

      const deleteButton = newRow.querySelector(".deleteButton");
      deleteButton.addEventListener("click", function () {
        deleteRow(this);
      });

      const editableCells = newRow.querySelectorAll(".editable-cell");
      editableCells.forEach(cell => {
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
    } else {
      alert("All fields are not filled. Please try again.");
    }
  }

  function saveRowToLocalStorage(rowData) {
    let storedRowsJSON = localStorage.getItem("storedRows");
    let storedRows = JSON.parse(storedRowsJSON) || [];
    storedRows.push(rowData);
    localStorage.setItem("storedRows", JSON.stringify(storedRows));
  }

  const addButton = document.getElementById("addRowSubmit");
  addButton.addEventListener("click", addRow);

  function deleteRow(button) {
    const row = button.closest("tr");
    if (row) {
      row.remove();
      const id = parseInt(row.dataset.id);
      deleteRowFromLocalStorage(id);
    } else {
      console.log('Row element not found.');
    }
  }

  function deleteRowFromLocalStorage(id) {
    let storedRowsJSON = localStorage.getItem("storedRows");
    let storedRows = JSON.parse(storedRowsJSON) || [];
    storedRows = storedRows.filter(rowData => rowData.id !== id);
    localStorage.setItem("storedRows", JSON.stringify(storedRows));
  }

  function loadStoredRows() {
    let storedRowsJSON = localStorage.getItem("storedRows");
    let storedRows = JSON.parse(storedRowsJSON) || [];
    storedRows.forEach(rowData => {
      const newRow = createRowElement(rowData);
      shoppingTable.appendChild(newRow);
    });
  }

  function createRowElement(rowData) {
    const newRow = document.createElement("tr");
    newRow.dataset.id = rowData.id;
    newRow.innerHTML = `
      <td class="table-cell editable-cell task-cell">${rowData.item}</td>
      <td class="table-cell editable-cell">${rowData.store}</td>
      <td class="table-cell editable-cell">$${rowData.price}</td>
      <td class="table-cell link-cell"><a target='_blank' href='${rowData.link}'>${rowData.truncatedLink}</a></td>
      <td><button class="deleteButton"><span class="material-icons">delete</span></button></td>
    `;
    const deleteButton = newRow.querySelector(".deleteButton");
    deleteButton.addEventListener("click", function () {
      deleteRow(this);
    });
    return newRow;
  }

  loadStoredRows();
});