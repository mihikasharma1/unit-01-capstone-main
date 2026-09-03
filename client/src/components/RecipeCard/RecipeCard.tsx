import './RecipeCard.css';

type RecipeCardProps = {
  title: string;
  image: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
  onClick?: () => void;
};

export default function RecipeCard({
  title,
  image,
  description,
  tags = [],
  createdAt,
  onClick,
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
    </article>
  );
}
