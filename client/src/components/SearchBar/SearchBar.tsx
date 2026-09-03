import './SearchBar.css';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder = 'Search recipes' }: SearchBarProps) {
  return (
    <div className="searchbar-wrap">
      <input
        className="searchbar"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
