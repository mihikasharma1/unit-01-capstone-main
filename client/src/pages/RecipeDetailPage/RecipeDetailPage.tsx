import './RecipeDetailPage.css';

const recipe = {
  title: 'Chickpea Stew',
  image:
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
  description: 'A warm, spicy chickpea stew with rich flavor and bright, comforting texture.',
  tags: ['Vegan', 'Gluten-free', 'Easy'],
  ingredients: [
    { name: 'Chickpeas', quantity: '2 cans' },
    { name: 'Tomatoes', quantity: '3 cups' },
    { name: 'Garlic', quantity: '2 cloves' },
  ],
  instructions: [
    { step: 1, description: 'Sauté garlic in olive oil until fragrant.' },
    { step: 2, description: 'Add tomatoes and simmer with spices.' },
    { step: 3, description: 'Fold in chickpeas and cook until thickened.' },
  ],
};

export default function RecipeDetailPage() {
  return (
    <main className="page-shell recipe-detail-page">
      <article className="recipe-detail-card">
        <img className="detail-image" src={recipe.image} alt={recipe.title} />

        <div className="detail-body">
          <h1>{recipe.title}</h1>
          <p className="detail-description">{recipe.description}</p>

          <div className="recipe-tags">
            {recipe.tags.map((tag) => (
              <span key={tag} className="recipe-tag">
                {tag}
              </span>
            ))}
          </div>

          <section className="detail-section">
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.name}>
                  <span>{ingredient.name}</span>
                  <span>{ingredient.quantity}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="detail-section">
            <h2>Instructions</h2>
            <ol>
              {recipe.instructions.map((instruction) => (
                <li key={instruction.step}>
                  <strong>Step {instruction.step}:</strong> {instruction.description}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </article>
    </main>
  );
}
