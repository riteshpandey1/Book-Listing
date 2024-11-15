const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new book
router.post('/', async (req, res) => {
    const { title, author, description } = req.body;
    if (!title || !author || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const book = new Book({ title, author, description });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a book by ID
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Edit a book by ID (PUT)
router.put('/:id', async (req, res) => {
    const { title, author, description } = req.body;

    if (!title || !author || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, description },
            { new: true } // Return the updated document
        );
        
        if (!book) return res.status(404).json({ message: 'Book not found' });

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
