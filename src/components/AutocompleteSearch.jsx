import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getAutocompleteSuggestions } from '../api/spoonacular';

function AutocompleteSearch({ onSearch, initialSearch }) {
  const [query, setQuery] = useState(initialSearch || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(initialSearch || '');
  }, [initialSearch]);

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        getAutocompleteSuggestions(query)
          .then(data => {
            setSuggestions(data);
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error fetching suggestions:', error);
            setIsLoading(false);
          });
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    onSearch(suggestion.title);
    setShowSuggestions(false);
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search recipes..."
        />
        <button type="submit">Search</button>
      </form>
      {showSuggestions && (
        <div className="suggestions-container">
          {isLoading ? (
            <div className="suggestion-item">Loading...</div>
          ) : suggestions.length > 0 ? (
            <ul className="suggestions-list">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion.title}
                </li>
              ))}
            </ul>
          ) : query.length > 2 ? (
            <div className="suggestion-item">No suggestions found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}

AutocompleteSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  initialSearch: PropTypes.string
};

export default AutocompleteSearch;