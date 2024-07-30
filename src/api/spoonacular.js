import axios from 'axios';

export const getAutocompleteSuggestions = async (query) => {
  try {
    const response = await axios.get(`/api/autocomplete?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return [];
  }
};

export const searchRecipes = async (query) => {
  try {
    // Search in local database
    const localResponse = await axios.get(`/api/recipes/search?q=${query}`);
    
    // Search in Spoonacular API
    const apiResponse = await axios.get(`/api/search?q=${query}`);
    
    // Combine results, giving priority to local recipes
    const localRecipes = localResponse.data.map(recipe => ({...recipe, source: 'local'}));
    const apiRecipes = apiResponse.data
      .filter(apiRecipe => !localRecipes.some(localRecipe => localRecipe.title === apiRecipe.title))
      .map(recipe => ({...recipe, source: 'api'}));

    return [...localRecipes, ...apiRecipes];
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

export const getRecipeDetails = async (id) => {
  try {
    const response = await axios.get(`/api/recipes/${id}`);
    console.log('Recipe details from API:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error.response ? error.response.data : error.message);
    throw error;
  }
};