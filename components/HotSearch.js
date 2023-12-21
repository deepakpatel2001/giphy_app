// HotSearch.js
import { useState } from "react";
import styles from "./GifSearch.module.css";

const HotSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Amazing gifs..."
        value={searchTerm}
        onChange={handleSearchChange}
        className={styles.inputSearchGif}
      />
    </div>
  );
};

export default HotSearch;