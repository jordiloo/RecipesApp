import { useState } from 'react';
import axios from 'axios';

function CreateRecipe() {
  const initialRecipeState = {
    title: '',
    readyInMinutes: '',
    servings: '',
    image: '',
    summary: '',
    instructions: '',
    ingredients: [''],
    category: ''
  };

  const [recipe, setRecipe] = useState(initialRecipeState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = recipe.ingredients.map((ingredient, i) => 
      i === index ? value : ingredient
    );
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, '']
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/recipes', recipe);
      alert('Recipe saved successfully!');
      // Reset form
      setRecipe(initialRecipeState);
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again.');
    }
  };

  return (
    <div className="create-recipe">
      <h2>Create New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          placeholder="Recipe Title"
          required
        />
        <input
          type="number"
          name="readyInMinutes"
          value={recipe.readyInMinutes}
          onChange={handleChange}
          placeholder="Ready in (minutes)"
          required
        />
        <input
          type="number"
          name="servings"
          value={recipe.servings}
          onChange={handleChange}
          placeholder="Servings"
          required
        />
        <input
          type="text"
          name="image"
          value={recipe.image}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <textarea
          name="summary"
          value={recipe.summary}
          onChange={handleChange}
          placeholder="Recipe Summary"
        ></textarea>
        <textarea
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          placeholder="Instructions"
          required
        ></textarea>
        {recipe.ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            value={ingredient}
            onChange={(e) => handleIngredientChange(index, e.target.value)}
            placeholder={`Ingredient ${index + 1}`}
          />
        ))}
        <button type="button" onClick={addIngredient}>Add Ingredient</button>
        <input
          type="text"
          name="category"
          value={recipe.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <button type="submit">Save Recipe</button>
      </form>
    </div>
  );
}

export default CreateRecipe;