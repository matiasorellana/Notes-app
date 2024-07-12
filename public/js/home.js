document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const addNoteButton = document.getElementById('addNote');

    const loadNotes = async () => {
        const response = await fetch('/notas');
        const notes = await response.json();
        notesContainer.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('grid-item');
            noteElement.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.content}</p>
                <p><small>Etiquetas: ${note.tags.join(', ')}</small></p>
                <p><small>Creado: ${new Date(note.created_at).toLocaleString()}</small></p>
                <p><small>Actualizado: ${new Date(note.updated_at).toLocaleString()}</small></p>
                <button data-id="${note.id}" class="edit-note">Editar</button>
                <button data-id="${note.id}" class="delete-note">Eliminar</button>
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
            await fetch(`/notas/${noteId}`, {
                method: 'DELETE'
            });
            obtenerNotas();
        }
    });
});
