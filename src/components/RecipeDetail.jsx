import PropTypes from 'prop-types';


function RecipeDetail(props) {
  const { recipe, onClose } = props;
  console.log('Recipe data:', recipe);
  console.log('Instructions:', recipe.instructions);
  console.log('Ingredients:', recipe.ingredients);
  return (
    <div className="recipe-detail-modal">
      <div className="recipe-detail-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{recipe.title}</h2>
        <img src={recipe.image} alt={recipe.title} />
        <p>Ready in {recipe.readyInMinutes} minutes</p>
        <p>Servings: {recipe.servings}</p>
        {recipe.summary && (
          <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
        )}
        <h3>Instructions:</h3>
        {recipe.instructions ? (
          <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
        ) : (
          <p>No instructions available.</p>
        )}
        <h3>Ingredients:</h3>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
  <ul>
    {recipe.ingredients.map((ingredient, index) => (
      <li key={index}>{ingredient}</li>
    ))}
  </ul>
) : (
  <p>No ingredients available.</p>
)}
      </div>
    </div>
  );
}

RecipeDetail.propTypes = {
  recipe: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    readyInMinutes: PropTypes.number.isRequired,
    servings: PropTypes.number.isRequired,
    summary: PropTypes.string,
    instructions: PropTypes.string,
    ingredients: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onClose: PropTypes.func.isRequired
};


export default RecipeDetail;