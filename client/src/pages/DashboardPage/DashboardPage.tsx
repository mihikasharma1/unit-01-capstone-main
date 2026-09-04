import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import RecipeCard from '../../components/RecipeCard/RecipeCard';
import Toast from '../../components/Toast/Toast';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { api, getUserId } from '../../lib/api';
import { formatDate, getApiError, type Recipe } from '../../lib/recipes';

import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Recipe[]>('/recipes')
      .then((response) =>
        setRecipes(
          response.data.filter((recipe) => recipe.ownerId === getUserId()),
        ),
      )
      .catch((requestError) =>
        setError(getApiError(requestError, 'Unable to load your recipes.')),
      );
  }, []);

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);

    try {
      await api.delete(`/recipes/${id}`);
      setRecipes((current) => current.filter((recipe) => recipe._id !== id));
      setToast('Recipe deleted successfully.');
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          'You do not have permission to delete this recipe.',
        ),
      );
    }
  };

  return (
    <main className="page-shell dashboard-page">
      <div className="dashboard-header">
        <p className="dashboard-intro">
          Welcome back! Manage your recipes or add a new one.
        </p>

        <h1>Your Recipes</h1>
      </div>

      {error ? <p className="dashboard-error">{error}</p> : null}

      <section className="dashboard-grid" aria-label="Your recipes">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            title={recipe.title}
            image={recipe.image}
            tags={recipe.tags}
            createdAt={formatDate(recipe.createdAt)}
            onDelete={() => requestDelete(recipe._id)}
            onEdit={() => navigate(`/dashboard/${recipe._id}/edit`)}
          />
        ))}
      </section>

      {!error && recipes.length === 0 ? (
        <p className="dashboard-empty-state">
          You have not created any recipes yet.
        </p>
      ) : null}

      <div className="dashboard-actions">
        <Link to="/dashboard/new" className="primary-action">
          Create Recipe
        </Link>

        <Link to="/recipes" className="secondary-action">
          Browse Recipes
        </Link>
      </div>

      {pendingDeleteId ? (
        <ConfirmDialog
          title="Delete recipe?"
          message="Do you want to delete this recipe? This action cannot be undone."
          confirmLabel="Yes, Delete Recipe"
          cancelLabel="Nevermind"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      ) : null}

      {toast ? <Toast message={toast} onClose={() => setToast('')} /> : null}
    </main>
  );
}
