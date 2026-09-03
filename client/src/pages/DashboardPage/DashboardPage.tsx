import { Link } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import './DashboardPage.css';

const mockRecipes = [
  {
    _id: '1',
    title: 'Chickpea Stew',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    tags: ['Vegan', 'Easy'],
    createdAt: '2/13/25',
  },
  {
    _id: '2',
    title: 'Garden Salad',
    image:
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1200&q=80',
    tags: ['Vegetarian'],
    createdAt: '2/16/25',
  },
];

export default function DashboardPage() {
  return (
    <main className="page-shell dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/dashboard/new" className="primary-action">
          Create recipe
        </Link>
      </div>

      <section className="dashboard-grid">
        {mockRecipes.map((recipe) => (
          <div key={recipe._id} className="dashboard-card-wrap">
            <RecipeCard
              title={recipe.title}
              image={recipe.image}
              tags={recipe.tags}
              createdAt={recipe.createdAt}
            />

            <div className="dashboard-actions">
              <button type="button" className="mini-button danger">
                Delete
              </button>
              <button type="button" className="mini-button success">
                Edit
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
