
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RecipeForm from '../../components/RecipeForm/RecipeForm';
import Toast from '../../components/Toast/Toast';
import { api } from '../../lib/api';
import { getApiError, type Recipe, type RecipeInput } from '../../lib/recipes';
import './NewRecipePage.css';

export default function NewRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get<Recipe>(`/recipes/${id}`)
      .then((response) => setRecipe(response.data))
      .catch((requestError) => setError(getApiError(requestError, 'Unable to load this recipe.')));
  }, [id]);

  const handleSubmit = async (values: RecipeInput) => {
    setError('');
    setSubmitting(true);
    try {
      if (id) {
        await api.put(`/recipes/${id}`, values);
        setToast('Recipe updated successfully.');
      } else {
        await api.post('/recipes', values);
        setToast('Recipe created successfully.');
      }
      window.setTimeout(() => navigate('/dashboard'), 700);
    } catch (requestError) {
      setError(getApiError(requestError, 'Unable to save recipe.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell new-recipe-page">
      {id && !recipe && !error ? (
        <p className="empty-state">Loading recipe...</p>
      ) : (
        <RecipeForm
          key={recipe?._id ?? 'new'}
          mode={id ? 'edit' : 'create'}
          initialValues={recipe ?? undefined}
          onSubmit={handleSubmit}
          error={error}
          submitting={submitting}
        />
      )}
      {toast ? <Toast message={toast} onClose={() => setToast('')} /> : null}
    </main>
  );
}
