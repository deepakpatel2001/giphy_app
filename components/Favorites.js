// Favorites.js
import { useState } from "react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  const handleRemoveFavorite = (gifId) => {
    setFavorites(favorites.filter((fav) => fav.id !== gifId));
  };

  return (
    <div>
      <h2>Favorites</h2>
      {favorites.map((fav) => (
        <div key={fav.id}>
          <img src={fav.images.fixed_height.url} alt={fav.title} />
          <button onClick={() => handleRemoveFavorite(fav.id)}>
            Remove from Favorites
          </button>
        </div>
      ))}
    </div>
  );
};

export default Favorites;