import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { getApiError, type Recipe } from '../../lib/recipes';
import './RecipeDetailPage.css';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get<Recipe>(`/recipes/${id}`)
      .then((response) => setRecipe(response.data))
      .catch((requestError) => setError(getApiError(requestError, 'Unable to load this recipe.')));
  }, [id]);

  if (error) return <main className="page-shell"><p className="empty-state">{error}</p></main>;
  if (!recipe) return <main className="page-shell"><p className="empty-state">Loading recipe...</p></main>;

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
