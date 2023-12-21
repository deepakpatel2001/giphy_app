// components/GifSearch.js
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./GifSearch.module.css";
import Pagination from "./Pagination";
import { useRouter } from "next/router";
import { auth, database } from "../firebase/firebaseConfig";
import { get, child, set } from "firebase/database";
import Spinner from "./Spinner";

const GifSearch = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setShowWelcome(true);
        await loadFavorites(); // Load favorites only when the user is authenticated
      } else {
        // User is not authenticated, redirect to login
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router, auth.currentUser]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const limit = 9;
      const offset = (currentPage - 1) * limit;
      const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
        params: {
          q: searchTerm,
          api_key: "XKbJpLbW2msnrbqybU6Wsc2199ZSTm6Q",
          offset: offset,
          limit: limit,
        },
      });
      setGifs(response.data.data);
      setTotalPages(Math.ceil(response.data.pagination.total_count / limit));
    } catch (error) {
      console.error("GIF search error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const snapshot = await get(
        child(database.ref(auth.currentUser.uid), "favorites")
      );
      if (snapshot.exists()) {
        setFavorites(Object.values(snapshot.val()));
      } else {
        // If no favorites exist, set an empty array
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error loading favorites", error.message);
    }
  };

  const handleFavorite = (gif) => {
    const isFavorite = favorites.some((favorite) => favorite.id === gif.id);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((favorite) => favorite.id !== gif.id);
    } else {
      updatedFavorites = [...favorites, gif];
    }

    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites);
  };

  const saveFavorites = async (favorites) => {
    try {
      await set(
        child(database.ref(auth.currentUser.uid), "favorites"),
        favorites
      );
    } catch (error) {
      console.error("Error saving favorites", error.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    handleSearch();
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Handle successful logout
      router.push("/");
    } catch (error) {
      console.error("Logout error", error.message);
    }
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.welcomeContainer}>
        {showWelcome && (
          <h2 className={styles.welcomeContainerHeading}>
            Hello, {auth.currentUser.email}👋
          </h2>
        )}
      </div>

      <div className={styles.searchContainer}>
        {/* Include the HotSearch component */}
        <div>
          <input
            type="text"
            placeholder="Search for GIFs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.inputSearchGif}
          />
        </div>

        <div>
          <button onClick={handleSearch} className={styles.searchBtn}>
            Search
          </button>
        </div>
      </div>
      {loading && <Spinner />}
      {gifs.length > 0 && !loading && (
        <>
          <div className={styles.gifGrid}>
            {gifs.map((gif) => (
              <div key={gif.id} className={styles.gifItem}>
                <img src={gif.images.fixed_height.url} alt={gif.title} />
                <button
                  onClick={() => handleFavorite(gif)}
                  className={styles.favoriteBtn}
                >
                  Favorite
                </button>
              </div>
            ))}
          </div>
          <div className={styles.paginationContainer}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {favorites.length > 0 && !loading && (
        <>
          <h2 className={styles.favoriteHeading}>Favorites</h2>
          <div className={styles.favoriteGrid}>
            {favorites.map((favorite) => (
              <div key={favorite.id} className={styles.favoriteItem}>
                <img
                  src={favorite.images.fixed_height.url}
                  alt={favorite.title}
                />
              </div>
            ))}
          </div>
        </>
      )}

      <div className={styles.logOutContainer}>
        <button onClick={handleLogout} className={styles.logBtn}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default GifSearch;