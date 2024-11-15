import React, { useState, useEffect } from "react";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ title: "", author: "", description: "" });
  const [errors, setErrors] = useState({});
  const [editingBook, setEditingBook] = useState(null);

  // Fetch books
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Add or Edit a book
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = {};
    if (!formData.title) validationErrors.title = "Title is required";
    if (!formData.author) validationErrors.author = "Author is required";
    if (!formData.description) validationErrors.description = "Description is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingBook) {
        // Update existing book
        await axios.put(`http://localhost:8000/books/${editingBook._id}`, formData);
        setEditingBook(null); // Reset editing book after update
      } else {
        // Add new book
        await axios.post("http://localhost:8000/books", formData);
      }

      setFormData({ title: "", author: "", description: "" }); // Reset form data
      setErrors({}); // Clear validation errors
      fetchBooks(); // Fetch updated book list
    } catch (error) {
      console.error("Error adding/updating book:", error);
    }
  };

  // Edit a book
  const handleEdit = (book) => {
    setEditingBook(book); // Set the book to be edited
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
    });
    setErrors({});
  };

  // Delete a book
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/books/${id}`);
      fetchBooks(); // Fetch updated book list after deletion
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <form className="bg-white p-4 shadow rounded mb-4" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-2">{editingBook ? "Edit Book" : "Add a New Book"}</h2>
        <div className="mb-2">
          <label className="block font-medium">Title:</label>
          <input
            type="text"
            className={`w-full border rounded p-2 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        <div className="mb-2">
          <label className="block font-medium">Author:</label>
          <input
            type="text"
            className={`w-full border rounded p-2 ${
              errors.author ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
        </div>
        <div className="mb-2">
          <label className="block font-medium">Description:</label>
          <textarea
            className={`w-full border rounded p-2 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingBook ? "Update Book" : "Add Book"}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-bold mb-2">Book List</h2>
        {books.length > 0 ? (
          <ul className="bg-white shadow rounded divide-y">
            {books.map((book) => (
              <li key={book._id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{book.title}</h3>
                  <p className="text-sm text-gray-600">Author: {book.author}</p>
                  <p className="text-sm text-gray-600">{book.description}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(book)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No books available.</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
