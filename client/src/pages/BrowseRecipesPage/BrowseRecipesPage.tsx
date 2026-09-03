
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBar from '../../components/SearchBar/SearchBar';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { api } from '../../lib/api';
import { formatDate, getApiError, type Recipe } from '../../lib/recipes';

import './BrowseRecipesPage.css';

export default function BrowseRecipesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Recipe[]>('/recipes')
      .then((response) => setRecipes(response.data))
      .catch((requestError) =>
        setError(getApiError(requestError, 'Unable to load recipes.')),
      );
  }, []);

  const filteredRecipes = useMemo(() => {
    const input = query.trim().toLowerCase();

    if (!input) return recipes;

    return recipes.filter((recipe) => {
      const haystack = [
        recipe.title,
        recipe.description,
        ...recipe.tags,
        ...recipe.ingredients.map(
          (ingredient) => `${ingredient.name} ${ingredient.quantity}`,
        ),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(input);
    });
  }, [query, recipes]);

  return (
    <main className="page-shell browse-page">
      <section className="browse-panel">

        <div className="browse-content">
          <header className="browse-header">
            <h1>Recipe List</h1>

            <div className="browse-search">
              <SearchBar value={query} onChange={setQuery} />
            </div>
          </header>

          {error ? (
            <p className="browse-empty-state">{error}</p>
          ) : filteredRecipes.length === 0 ? (
            <p className="browse-empty-state">We couldn't find any recipes.</p>
          ) : (
            <section className="recipe-grid" aria-label="Recipe list">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  title={recipe.title}
                  image={recipe.image}
                  description={recipe.description}
                  tags={recipe.tags}
                  createdAt={formatDate(recipe.createdAt)}
                  onClick={() => navigate(`/recipes/${recipe._id}`)}
                />
              ))}
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
