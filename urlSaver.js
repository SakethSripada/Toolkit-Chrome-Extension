let myLeads = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const tabBtn = document.getElementById("tab-btn")

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        myLeads.push(tabs[0].url)
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
    })
})

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        const truncatedLinkValue = leads[i].length > 25 ? leads[i].substring(0, 25) + "..." : leads[i];
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>${truncatedLinkValue}</a>
                <!-- Add a data-index attribute to identify the item -->
                <button class="delete-item" data-index="${i}" style="display: none;">Delete</button>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

// Handle right-click on list items to show the delete button
ulEl.addEventListener("contextmenu", function (e) {
    e.preventDefault(); // Prevent the default context menu
    const target = e.target;
    if (target.tagName === "A") {
        const listItem = target.parentElement;
        const deleteButton = listItem.querySelector(".delete-item");
        if (deleteButton) {
            // Hide all delete buttons first
            document.querySelectorAll(".delete-item").forEach(btn => btn.style.display = "none");
            // Show the delete button for the right-clicked item
            deleteButton.style.display = "inline";
            deleteButton.style.backgroundColor = "red";
            deleteButton.textContent = `DELETE?`
            // Position the delete button next to the item
            deleteButton.style.left = (e.clientX - ulEl.getBoundingClientRect().left) + "px";
            deleteButton.style.top = (e.clientY - ulEl.getBoundingClientRect().top) + "px";
        }
    }
});

// Handle clicking on the delete buttons to remove items
ulEl.addEventListener("click", function (e) {
    const target = e.target;
    if (target.classList.contains("delete-item")) {
        const index = target.getAttribute("data-index");
        if (index !== null) {
            myLeads.splice(index, 1);
            localStorage.setItem("myLeads", JSON.stringify(myLeads));
            render(myLeads);
        }
    }
});

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
})

inputBtn.addEventListener("click", function() {
    myLeads.push(inputEl.value)
    inputEl.value = ""
    localStorage.setItem("myLeads", JSON.stringify(myLeads) )
    render(myLeads)
})

