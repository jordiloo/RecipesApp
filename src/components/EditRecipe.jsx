import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

function EditRecipe({ recipe, onClose, onUpdate }) {
  const [editedRecipe, setEditedRecipe] = useState(recipe);

  useEffect(() => {
    setEditedRecipe(recipe);
  }, [recipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/recipes/${recipe._id}`, editedRecipe);
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe. Please try again.');
    }
  };

  return (
    <div className="edit-recipe-modal">
      <div className="edit-recipe-content">
        <h2>Edit Recipe</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={editedRecipe.title}
            onChange={handleChange}
            placeholder="Recipe Title"
            required
          />
          <input
            type="number"
            name="readyInMinutes"
            value={editedRecipe.readyInMinutes}
            onChange={handleChange}
            placeholder="Ready in (minutes)"
            required
          />
          <input
            type="number"
            name="servings"
            value={editedRecipe.servings}
            onChange={handleChange}
            placeholder="Servings"
            required
          />
          <input
            type="text"
            name="image"
            value={editedRecipe.image}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <textarea
            name="summary"
            value={editedRecipe.summary}
            onChange={handleChange}
            placeholder="Recipe Summary"
          ></textarea>
          <textarea
            name="instructions"
            value={editedRecipe.instructions}
            onChange={handleChange}
            placeholder="Instructions"
            required
          ></textarea>
          <input
            type="text"
            name="category"
            value={editedRecipe.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
          <div className="button-group">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
        </form>
      </div>
    </div>
  );
}

EditRecipe.propTypes = {
  recipe: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default EditRecipe;