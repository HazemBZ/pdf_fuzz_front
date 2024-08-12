/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import styles from "../styles.module.css";

const HighlightWindow = ({ highlighted, setHighlighted, highlightedItem }) => {
  const handleKeydown = (event) => {
    if (event.key === "Escape") setHighlighted(false);
    if (event.key === "ArrowLeft") {
      // TODO: Set prev item
    }
    if (event.key === "ArrowRight") {
      // TODO: Set next item
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <div
      className={styles.highlightWindow}
      onClick={() => setHighlighted(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <img src={highlightedItem} height="800" alt="Highlighted item" />
      </div>
    </div>
  );
};

export default HighlightWindow;
