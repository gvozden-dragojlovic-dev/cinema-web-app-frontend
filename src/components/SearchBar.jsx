import React from "react";

const SearchBar = ({ onSearch, searchTerm }) => {
  const [term, setTerm] = React.useState(searchTerm || "");

  React.useEffect(() => {
    setTerm(searchTerm || "");
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 
    justify-center mb-4"
    >
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search thousand of movies..."
        className="input input-primary"
      />
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
};

export default SearchBar;