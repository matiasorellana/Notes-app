document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const addNoteButton = document.getElementById('addNote');
    const searchInput = document.getElementById('search');
    const messageContainer = document.getElementById('message');

    const loadNotes = async () => {
        try {
            const response = await fetch('/notes');
            if (!response.ok) throw new Error('Failed to fetch notes');
            const notes = await response.json();
            displayNotes(notes);
            showMessage('Notes loaded successfully', 'success');
        } catch (error) {
            showMessage(error.message, 'error');
        }
    };

    const displayNotes = (notes) => {
        notesContainer.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('grid-item');
            noteElement.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.content}</p>
                <p><small>Labels: ${note.tags.join(', ')}</small></p>
                <p><small>Created: ${new Date(note.created_at).toLocaleString()}</small></p>
                <p><small>Updated: ${new Date(note.updated_at).toLocaleString()}</small></p>
                <button data-id="${note.id}" class="edit-note">Edit Note</button>
            `;
            notesContainer.appendChild(noteElement);
        });
    };

    const showMessage = (message, type) => {
        messageContainer.textContent = message;
        messageContainer.className = `message ${type}`;
        setTimeout(() => {
            messageContainer.textContent = '';
            messageContainer.className = 'message';
        }, 3000);
    };

    loadNotes();

    addNoteButton.addEventListener('click', () => {
        window.location.href = 'edit.html';
    });

    notesContainer.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-note')) {
            const noteId = event.target.dataset.id;
            window.location.href = `edit.html?id=${noteId}`;
        }
    });

    searchInput.addEventListener('input', async (event) => {
        const query = event.target.value.toLowerCase();
        try {
            const response = await fetch('/notes');
            if (!response.ok) throw new Error('Failed to fetch notes');
            const notes = await response.json();
            const filteredNotes = notes.filter(note => 
                note.title.toLowerCase().includes(query) ||
                note.tags.some(tag => tag.toLowerCase().includes(query))
            );
            displayNotes(filteredNotes);
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });
});
