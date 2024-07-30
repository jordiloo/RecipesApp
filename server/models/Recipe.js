import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: String,
  readyInMinutes: Number,
  servings: Number,
  image: String,
  summary: String,
  instructions: String,
  ingredients: [String],
  category: String,
  source: { type: String, default: 'user' }  // 'user' for manually created, 'api' for Spoonacular
});

export default mongoose.model('Recipe', recipeSchema);