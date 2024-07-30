import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import Recipe from './models/Recipe.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const API_KEY = process.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

app.get('/api/autocomplete', async (req, res) => {
  try {
    const query = req.query.query;
    const response = await axios.get(`${BASE_URL}/autocomplete`, {
      params: {
        apiKey: API_KEY,
        number: 10,
        query: query,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    res.status(500).json({ error: 'An error occurred while fetching suggestions' });
  }
});

app.get('/api/saved-recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ _id: -1 }).limit(10);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ error: 'An error occurred while fetching saved recipes' });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'An error occurred while deleting the recipe' });
  }
});

app.post('/api/recipes', async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body,
      source: 'user'
    });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error saving new recipe:', error);
    res.status(500).json({ error: 'An error occurred while saving the recipe' });
  }
});

app.get('/api/recipes/search', async (req, res) => {
  try {
    const query = req.query.q;
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(recipes);
  } catch (error) {
    console.error('Error searching local recipes:', error);
    res.status(500).json({ error: 'An error occurred while searching recipes' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    console.log(`Searching for recipes with query: ${query}`);

    if (!query) {
      return res.json([]);  // Return empty array if no query
    }

    // Search Spoonacular API
    const response = await axios.get(`${BASE_URL}/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query: query,
        number: 10,
        addRecipeInformation: true,
        instructionsRequired: true,
        fillIngredients: true,
      },
    });

    console.log(`Received ${response.data.results.length} recipes from API`);

    // Save recipes from API to MongoDB
    const savedApiRecipes = await Promise.all(response.data.results.map(async (recipe) => {
      const newRecipe = {
        title: recipe.title,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        image: recipe.image,
        summary: recipe.summary,
        instructions: recipe.analyzedInstructions?.[0]?.steps.map(step => step.step).join('\n') || '',
        ingredients: recipe.extendedIngredients?.map(ing => ing.original) || [],
        category: query,
        source: 'api'
      };

      try {
        const savedRecipe = await Recipe.findOneAndUpdate(
          { title: recipe.title, source: 'api' },
          { $set: newRecipe },
          { upsert: true, new: true }
        );
        return savedRecipe;
      } catch (saveError) {
        console.error(`Error saving recipe ${recipe.title}:`, saveError);
        return null;
      }
    }));

    app.put('/api/recipes/:id', async (req, res) => {
      try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        if (!updatedRecipe) {
          return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(updatedRecipe);
      } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'An error occurred while updating the recipe' });
      }
    });

    // Search for local recipes with matching category
    const localRecipes = await Recipe.find({
      $or: [
        { category: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } }
      ],
      source: 'user'  // Only include user-created recipes
    });

    // Combine API and local results
    const allRecipes = [...savedApiRecipes.filter(Boolean), ...localRecipes];

    console.log(`Returning ${allRecipes.length} recipes (${savedApiRecipes.length} from API, ${localRecipes.length} local)`);

    res.json(allRecipes);
  } catch (error) {
    console.error('Error searching recipes:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while searching recipes' });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  console.log(`Fetching recipe with id: ${req.params.id}`);
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'An error occurred while fetching the recipe' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;