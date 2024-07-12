const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const PUBLIC = path.join(__dirname, 'public');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(PUBLIC));

let notes = [];  // Notes storage

// Generate id
const generateId = () => {
    return 'xxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 36 | 0).toString(36);
    });
};

// home page route
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC, 'home.html'));
});

// edit page route
app.get('/edit.html', (req, res) => {
    res.sendFile(path.join(PUBLIC, 'edit.html'));
});

// API to get the notes
app.get('/notas', (req, res) => {
    res.json(notes);
});

// API to get notes by id
app.get('/notas/:id', (req, res) => {
    const note = notes.find(n => n.id === req.params.id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).send('Nota no encontrada');
    }
});

// API to create a note
app.post('/notas', (req, res) => {
    const newNote = {
        id: generateShortUUID(),
        title: req.body.title,
        content: req.body.content,
        created_at: new Date(),
        updated_at: new Date(),
        tags: req.body.tags || []
    };
    notes.push(newNote);
    res.status(201).json(newNote);
});

// API to update a note
app.put('/notas/:id', (req, res) => {
    const noteIndex = notes.findIndex(n => n.id === req.params.id);
    if (noteIndex !== -1) {
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: req.body.title,
            content: req.body.content,
            updated_at: new Date(),
            tags: req.body.tags || []
        };
        res.json(notes[noteIndex]);
    } else {
        res.status(404).send('Nota no encontrada');
    }
});

// API to delete a note
app.delete('/notas/:id', (req, res) => {
    notes = notes.filter(n => n.id !== req.params.id);
    res.status(204).send();
});

// check running server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
