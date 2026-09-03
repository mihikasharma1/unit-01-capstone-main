import { useState } from 'react';
import type { FormEvent } from 'react';
import type { RecipeInput } from '../../lib/recipes';
import './RecipeForm.css';

type IngredientRow = {
  id: number;
  name: string;
  quantity: string;
};

type InstructionRow = {
  id: number;
  step: number;
  description: string;
};

type RecipeFormProps = {
  mode?: 'create' | 'edit';
  initialValues?: {
    title?: string;
    image?: string;
    description?: string;
    tags?: string[];
    ingredients?: { name: string; quantity: string }[];
    instructions?: { step: number; description: string }[];
  };
  onSubmit: (values: RecipeInput) => void | Promise<void>;
  error?: string;
  submitting?: boolean;
};

export default function RecipeForm({
  mode = 'create',
  initialValues = {},
  onSubmit,
  error = '',
  submitting = false,
}: RecipeFormProps) {
  const [validationError, setValidationError] = useState('');
  const [title, setTitle] = useState(initialValues.title ?? '');
  const [image, setImage] = useState(initialValues.image ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [tags, setTags] = useState((initialValues.tags ?? []).join(', '));
  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    (initialValues.ingredients ?? [{ id: 1, name: '', quantity: '' }]).map((item, index) => ({
      id: index + 1,
      name: item.name ?? '',
      quantity: item.quantity ?? '',
    })),
  );
  const [instructions, setInstructions] = useState<InstructionRow[]>(
    (initialValues.instructions ?? [{ id: 1, step: 1, description: '' }]).map((item, index) => ({
      id: index + 1,
      step: item.step ?? index + 1,
      description: item.description ?? '',
    })),
  );

  const addIngredient = () => {
    setIngredients((current) => [...current, { id: Date.now(), name: '', quantity: '' }]);
  };

  const removeIngredient = (id: number) => {
    setIngredients((current) => (current.length === 1 ? current : current.filter((item) => item.id !== id)));
  };

  const addInstruction = () => {
    setInstructions((current) => [
      ...current,
      { id: Date.now(), step: current.length + 1, description: '' },
    ]);
  };

  const removeInstruction = (id: number) => {
    setInstructions((current) => (current.length === 1 ? current : current.filter((item) => item.id !== id)));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const values: RecipeInput = {
      title,
      image,
      description,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      ingredients: ingredients
        .filter((ingredient) => ingredient.name.trim() || ingredient.quantity.trim())
        .map((ingredient) => ({
          name: ingredient.name.trim(),
          quantity: ingredient.quantity.trim(),
        })),
      instructions: instructions
        .filter((instruction) => instruction.description.trim())
        .map((instruction, index) => ({
          step: index + 1,
          description: instruction.description.trim(),
        })),
    };

    if (!values.title || !values.image || !values.description) {
      setValidationError('Title, image URL, and description are required.');
      return;
    }
    if (values.ingredients.length === 0 || values.ingredients.some((item) => !item.name || !item.quantity)) {
      setValidationError('Add a name and quantity for at least one ingredient.');
      return;
    }
    if (values.instructions.length === 0) {
      setValidationError('Add at least one instruction step.');
      return;
    }

    setValidationError('');
    onSubmit(values);
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h2>{mode === 'create' ? 'Create recipe' : 'Edit recipe'}</h2>
      {validationError || error ? <p className="form-error">{validationError || error}</p> : null}

      <label className="field-label" htmlFor="title">
        Title
      </label>
      <input
        id="title"
        className="text-input"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Recipe title"
      />

      <label className="field-label" htmlFor="image">
        Image URL
      </label>
      <input
        id="image"
        className="text-input"
        type="text"
        value={image}
        onChange={(event) => setImage(event.target.value)}
        placeholder="https://example.com/image.jpg"
      />

      <label className="field-label" htmlFor="description">
        Description
      </label>
      <textarea
        id="description"
        className="text-area"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Write a short recipe description"
      />

      <div className="row-section">
        <div className="section-header">
          <label className="field-label">Ingredients</label>
          <button type="button" className="small-button" onClick={addIngredient}>
            Add ingredient
          </button>
        </div>

        {ingredients.map((ingredient, index) => (
          <div key={ingredient.id} className="nested-row">
            <input
              className="text-input small"
              type="text"
              value={ingredient.name}
              onChange={(event) => {
                const updated = [...ingredients];
                updated[index].name = event.target.value;
                setIngredients(updated);
              }}
              placeholder="Ingredient name"
            />
            <input
              className="text-input small"
              type="text"
              value={ingredient.quantity}
              onChange={(event) => {
                const updated = [...ingredients];
                updated[index].quantity = event.target.value;
                setIngredients(updated);
              }}
              placeholder="Quantity"
            />
            <button
              type="button"
              className="remove-button"
              onClick={() => removeIngredient(ingredient.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="row-section">
        <div className="section-header">
          <label className="field-label">Instructions</label>
          <button type="button" className="small-button" onClick={addInstruction}>
            Add step
          </button>
        </div>

        {instructions.map((instruction, index) => (
          <div key={instruction.id} className="nested-row vertical">
            <div className="instruction-step">Step {index + 1}</div>
            <textarea
              className="text-area"
              value={instruction.description}
              onChange={(event) => {
                const updated = [...instructions];
                updated[index].description = event.target.value;
                setInstructions(updated);
              }}
              placeholder="Describe this step"
            />
            <button
              type="button"
              className="remove-button"
              onClick={() => removeInstruction(instruction.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <label className="field-label" htmlFor="tags">
        Tags
      </label>
      <input
        id="tags"
        className="text-input"
        type="text"
        value={tags}
        onChange={(event) => setTags(event.target.value)}
        placeholder="vegan, healthy, quick"
      />

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : mode === 'create' ? 'Create recipe' : 'Save changes'}
      </button>
    </form>
  );
}
