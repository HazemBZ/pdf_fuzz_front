import styles from "../styles.module.css";

const HighlightWindow = ({ highlighted, setHighlighted, highlightedItem }) => {
  return (
    <>
      {highlighted && (
        <div className={styles.highlightWindow} onClick={() => setHighlighted(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <img
              src={highlightedItem.img}
              height="800"
              alt="Highlighted item"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default HighlightWindow;
