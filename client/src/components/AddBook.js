import React, { useState } from 'react';
import api from '../utils/api';

function AddBook({ onAdd, showToast }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [genre, setGenre] = useState('General');
  const [pages, setPages] = useState('');
  const [publisher, setPublisher] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const bookData = {
        title,
        author,
        description: description || 'No description available.',
        isbn,
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
        genre,
        pages: pages ? parseInt(pages) : null,
        publisher
      };
      
      await api.post('/api/books', bookData);
      
      // Reset form
      setTitle('');
      setAuthor('');
      setDescription('');
      setIsbn('');
      setPublishedYear('');
      setGenre('General');
      setPages('');
      setPublisher('');
      
      if (showToast) showToast('Book added successfully!');
      if (onAdd) onAdd();
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Failed to add book');
    }
    setLoading(false);
  };

  return (
    <div className="add-book-form">
      <h3 className="form-title">Add New Book</h3>
      <p className="field-help">Capture just enough detail to help students find and request the right title.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="book-title">Book Title</label>
            <input
              id="book-title"
              className="form-input"
              type="text"
              placeholder="Book Title *"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="book-author">Author</label>
            <input
              id="book-author"
              className="form-input"
              type="text"
              placeholder="Author Name *"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="book-description">Description</label>
          <textarea
            id="book-description"
            className="form-input"
            placeholder="Book Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="field-label" htmlFor="book-isbn">ISBN</label>
            <input
              id="book-isbn"
              className="form-input"
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={e => setIsbn(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="book-year">Published Year</label>
            <input
              id="book-year"
              className="form-input"
              type="number"
              placeholder="Published Year"
              value={publishedYear}
              onChange={e => setPublishedYear(e.target.value)}
              min="1000"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="book-genre">Genre</label>
            <select
              id="book-genre"
              className="form-input"
              value={genre}
              onChange={e => setGenre(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="History">History</option>
              <option value="Biography">Biography</option>
              <option value="Philosophy">Philosophy</option>
              <option value="Art">Art</option>
              <option value="Business">Business</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="book-pages">Pages</label>
            <input
              id="book-pages"
              className="form-input"
              type="number"
              placeholder="Number of Pages"
              value={pages}
              onChange={e => setPages(e.target.value)}
              min="1"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="book-publisher">Publisher</label>
            <input
              id="book-publisher"
              className="form-input"
              type="text"
              placeholder="Publisher"
              value={publisher}
              onChange={e => setPublisher(e.target.value)}
            />
          </div>
        </div>

        <button className="btn add-book-submit-btn" type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
}

export default AddBook;
