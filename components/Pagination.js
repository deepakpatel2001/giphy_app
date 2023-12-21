import styles from "./GifSearch.module.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={styles.paginationDiv}>
      <div>
        <button onClick={handlePrev} className={styles.previous}>
          Previous
        </button>
      </div>
      <div className={styles.adjustingSize}>
        <span
          className={styles.spanData}
        >{`Page ${currentPage} of ${totalPages}`}</span>
      </div>
      <div>
        <button onClick={handleNext} className={styles.next}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;