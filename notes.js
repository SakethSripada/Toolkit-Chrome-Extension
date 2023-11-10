document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('.notes__add')
    const noteListContainer = document.querySelector('.notes__list')
    const titleInput = document.querySelector('.notes__title')
    const bodyTextarea = document.querySelector('.notes__body')
    const searchInput = document.querySelector('.search-input')
    const contextMenu = document.getElementById('context-menu')
    const deleteNoteOption = document.getElementById('delete-note')
    let rightClickedIndex = -1
    const bodyElement = document.body

    let notes = JSON.parse(localStorage.getItem('notes') || '[]')
    let currentNoteIndex = 0

    function renderNoteList() {
        noteListContainer.innerHTML = ''
        const searchText = searchInput.value.toLowerCase()
        if (notes.length === 0) {
            titleInput.placeholder = ""
            bodyTextarea.placeholder = ""
        } else {
            titleInput.placeholder = "Enter title"
            bodyTextarea.placeholder = "Enter text"
        }
        notes.forEach((note, index) => {
            if (note.title.toLowerCase().includes(searchText) || note.body.toLowerCase().includes(searchText)) {
                const noteItem = document.createElement('div')
                noteItem.classList.add('notes__list-item')
                if (index === currentNoteIndex) {
                    noteItem.classList.add('notes__list-item--active')
                }
                const displayedTitle = note.title.length > 16 ? note.title.slice(0, 17) + '...' : note.title
                noteItem.textContent = displayedTitle || 'Untitled'
                noteItem.addEventListener('click', () => {
                    selectNote(index)
                })

                noteItem.addEventListener('contextmenu', (e) => {
                    e.preventDefault()
                    rightClickedIndex = index
                    contextMenu.style.left = e.clientX + 'px'
                    contextMenu.style.top = e.clientY + 'px'
                    contextMenu.style.display = 'block'
                })

                noteListContainer.appendChild(noteItem)
            }
        })
    }

    function selectNote(index) {
        currentNoteIndex = index
        const selectedNote = notes[currentNoteIndex]
        titleInput.value = selectedNote.title || ''
        bodyTextarea.value = selectedNote.body || ''
        renderNoteList()
    }

    function deleteNote() {
        if (rightClickedIndex !== -1) {
            notes.splice(rightClickedIndex, 1)
            localStorage.setItem('notes', JSON.stringify(notes))
            renderNoteList()
            selectNote(currentNoteIndex)
        }
    }

    addButton.addEventListener('click', () => {
        notes.push({ title: '', body: '' })
        localStorage.setItem('notes', JSON.stringify(notes))
        renderNoteList()
        selectNote(notes.length - 1)
    })

    titleInput.addEventListener('input', () => {
        notes[currentNoteIndex].title = titleInput.value
        localStorage.setItem('notes', JSON.stringify(notes))
        renderNoteList()
    })

    bodyTextarea.addEventListener('input', () => {
        notes[currentNoteIndex].body = bodyTextarea.value
        localStorage.setItem('notes', JSON.stringify(notes))
    })

    searchInput.addEventListener('input', () => {
        renderNoteList()
    })

    deleteNoteOption.addEventListener('click', () => {
        deleteNote()
        contextMenu.style.display = 'none'
    })

    document.addEventListener('click', () => {
        contextMenu.style.display = 'none'
        rightClickedIndex = -1
    })

    renderNoteList()
    selectNote(currentNoteIndex)
})