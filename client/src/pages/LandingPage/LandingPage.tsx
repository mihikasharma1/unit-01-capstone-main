import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <main className="page-shell landing-page">
      <section className="hero-card">
        <h1>Welcome to Spoonful</h1>
        <p>Discover and share recipes that make everyday meals feel special.</p>

        <div className="cta-row">
          <Link to="/recipes" className="primary-action">
            Explore Recipes
          </Link>
          <Link to="/login" className="secondary-action">
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
