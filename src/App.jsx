import { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import RecipeList from './components/RecipeList'
// import SearchForm from './components/SearchForm'
import AutoCompleteSearch from './components/AutocompleteSearch'
import CreateRecipe from './components/CreateRecipe'
import { searchRecipes } from './api/spoonacular'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentSearch, setCurrentSearch] = useState('')

  const handleSearch = useCallback(async (query) => {
    setIsLoading(true)
    setError(null)
    setCurrentSearch(query)
    try {
      const results = await searchRecipes(query);
      setRecipes(results);
    } catch (err) {
      console.error('Error searching recipes:', err);
      setError('Failed to search recipes. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, []);

  const handleUpdateRecipe = (updatedRecipe) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      )
    );
  };

  const fetchLatestRecipes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(`/api/search?q=${currentSearch}`);
      setRecipes(response.data);
    } catch (err) {
      console.error('Error fetching latest recipes:', err);
      setError('Failed to fetch latest recipes. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [currentSearch]);

  const handleDelete = (id) => {
    setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== id));
  };

  useEffect(() => {
    if (currentSearch) {
      fetchLatestRecipes();
    }
  }, [currentSearch, fetchLatestRecipes]);

  return (
    <div className="App">
      <h1>Recipe App</h1>
      <AutoCompleteSearch onSearch={handleSearch} initialSearch={currentSearch} />
      <button onClick={fetchLatestRecipes}>Refresh Recipes</button>
      {currentSearch && (
        <button onClick={() => { setCurrentSearch(''); setRecipes([]); }}>Clear Search</button>
      )}
      <CreateRecipe onRecipeCreated={fetchLatestRecipes} />
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <RecipeList recipes={recipes} onDelete={handleDelete} onUpdate={handleUpdateRecipe}
        />
      )}
      <Footer />
    </div>
  )
}

export default App