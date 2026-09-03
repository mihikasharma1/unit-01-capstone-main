import './RecipeCard.css';

type RecipeCardProps = {
  title: string;
  image: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function RecipeCard({
  title,
  image,
  description,
  tags = [],
  createdAt,
  onClick,
  onEdit,
  onDelete,
}: RecipeCardProps) {
  return (
    <article className="recipe-card" onClick={onClick}>
      <img className="recipe-card-image" src={image} alt={title} />

      <div className="recipe-card-body">
        <h2>{title}</h2>
        {createdAt ? <p className="recipe-date">Created on {createdAt}</p> : null}
        {description ? <p className="recipe-description">{description}</p> : null}

        {tags.length > 0 ? (
          <div className="recipe-tags">
            {tags.map((tag) => (
              <span key={tag} className="recipe-tag">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {onEdit || onDelete ? (
        <div className="recipe-card-actions">
          {onDelete ? (
            <button
              type="button"
              className="recipe-action delete-action"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </button>
          ) : null}
          {onEdit ? (
            <button
              type="button"
              className="recipe-action edit-action"
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
            >
              Edit
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
