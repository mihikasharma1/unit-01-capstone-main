import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import './BrowseRecipesPage.css';

const mockRecipes = [
  {
    _id: '1',
    title: 'Chickpea Stew',
    description: 'A warm, hearty bowl for a cozy dinner.',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    tags: ['Vegan', 'Gluten-free', 'Easy'],
    createdAt: '2/13/25',
  },
  {
    _id: '2',
    title: 'Garden Salad',
    description: 'Fresh greens with a bright lemon dressing.',
    image:
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1200&q=80',
    tags: ['Vegetarian', 'Healthy'],
    createdAt: '2/16/25',
  },
];

export default function BrowseRecipesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filteredRecipes = useMemo(() => {
    const input = query.trim().toLowerCase();
    if (!input) return mockRecipes;

    return mockRecipes.filter((recipe) => {
      const haystack = [
        recipe.title,
        recipe.description,
        ...recipe.tags,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(input);
    });
  }, [query]);

  return (
    <main className="page-shell browse-page">
      <div className="browse-header">
        <h1>Browse Recipes</h1>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="empty-state">No matching recipes found.</p>
      ) : (
        <section className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              title={recipe.title}
              image={recipe.image}
              description={recipe.description}
              tags={recipe.tags}
              createdAt={recipe.createdAt}
              onClick={() => navigate(`/recipes/${recipe._id}`)}
            />
          ))}
        </section>
      )}
    </main>
  );
}
