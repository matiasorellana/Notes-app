document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const noteId = urlParams.get('id');
    const noteForm = document.getElementById('note-form');

    if (noteId) {
        // Fetch the note details and populate the form
        const response = await fetch(`/notes/${noteId}`);
        const note = await response.json();
        document.getElementById('note-id').value = note.id;
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-tags').value = note.tags.join(', ');
    }

    noteForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('note-id').value;
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        const tags = document.getElementById('note-tags').value.split(',').map(tag => tag.trim());

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/notes/${id}` : '/notes';
        
        await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content, tags })
        });

        window.location.href = '/';
    });
});
