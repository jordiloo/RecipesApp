import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function SearchForm({ onSearch, initialSearch }) {
  const [term, setTerm] = useState(initialSearch || '');

  useEffect(() => {
    setTerm(initialSearch || '');
  }, [initialSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term.trim());
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search recipes..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        aria-label="Search for recipes"
      />
      <button type="submit">Search</button>
    </form>
  );
}

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired,
  initialSearch: PropTypes.string
};

export default SearchForm;