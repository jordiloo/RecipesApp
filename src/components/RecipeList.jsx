import { useState } from 'react';
import PropTypes from 'prop-types';
import { getRecipeDetails } from '../api/spoonacular';
import RecipeDetail from './RecipeDetail';
import EditRecipe from './EditRecipe';
import axios from 'axios';

function RecipeList({ recipes, onDelete, onUpdate }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/recipes/${id}`);
      onDelete(id);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    }
  };

  const handleViewRecipe = async (recipe) => {
    if (recipe._id || recipe.id) {
      setIsLoading(true);
      try {
        const fullRecipeDetails = await getRecipeDetails(recipe._id || recipe.id);
        setSelectedRecipe(fullRecipeDetails);
      } catch (error) {
        console.error('Error fetching full recipe details:', error);
        alert('Failed to load recipe details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error('Recipe is missing ID:', recipe);
      alert('Unable to view recipe details due to missing ID.');
    }
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
  };

  const handleUpdateRecipe = (updatedRecipe) => {
    onUpdate(updatedRecipe);
    setEditingRecipe(null);
  };

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <div key={recipe._id || recipe.id} className="recipe-card">
          <img src={recipe.image} alt={recipe.title} />
          <div className="recipe-card-content">
            <h2>{recipe.title}</h2>
            <p>Ready in {recipe.readyInMinutes} minutes</p>
            <p>Servings: {recipe.servings}</p>
            <div className="recipe-card-buttons">
              <button onClick={() => handleViewRecipe(recipe)}>View Recipe</button>
              {recipe.source === 'user' || recipe.source === 'api' && (
                <>
                  <button onClick={() => handleEditRecipe(recipe)}>Edit</button>
                  <button onClick={() => handleDelete(recipe._id)} className="delete-button">
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      {isLoading ? (
        <p>Loading recipe details...</p>
      ) : selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
      {editingRecipe && (
        <EditRecipe
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onUpdate={handleUpdateRecipe}
        />
      )}
    </div>
  );
}

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    readyInMinutes: PropTypes.number.isRequired,
    servings: PropTypes.number.isRequired,
    source: PropTypes.string
  })).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default RecipeList;