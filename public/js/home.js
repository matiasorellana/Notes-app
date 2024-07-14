document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const addNoteButton = document.getElementById('addNote');

    const loadNotes = async () => {
        const response = await fetch('/notes');
        const notes = await response.json();
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
                <button data-id="${note.id}" class="delete-note">Delete Note</button>
            `;
            notesContainer.appendChild(noteElement);
        });
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

        if (event.target.classList.contains('delete-note')) {
            const noteId = event.target.dataset.id;
            await fetch(`/notes/${noteId}`, {
                method: 'DELETE'
            });
            loadNotes();
        }
    });
});
