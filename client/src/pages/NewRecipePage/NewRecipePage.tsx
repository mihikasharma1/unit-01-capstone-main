import RecipeForm from '../../components/RecipeForm/RecipeForm';
import './NewRecipePage.css';

export default function NewRecipePage() {
  const handleSubmit = (values: {
    title: string;
    image: string;
    description: string;
    tags: string[];
  }) => {
    console.log('Create recipe', values);
  };

  return (
    <main className="page-shell">
      <RecipeForm mode="create" onSubmit={handleSubmit} />
    </main>
  );
}
