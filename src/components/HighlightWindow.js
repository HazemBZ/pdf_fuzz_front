/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import styles from "../styles.module.css";
import { TransformWrapper } from "react-zoom-pan-pinch";
import { TransformComponent } from "react-zoom-pan-pinch";

// TODO: Add zomm-pinch-tool
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
        {/* <img src={highlightedItem} height="800" alt="Highlighted item" /> */}
        <TransformWrapper initialScale={1} centerOnInit>
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            {/* <img src={URL.createObjectURL(data)} /> */}
            <img src={highlightedItem} height="800" alt="Highlighted item" />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default HighlightWindow;
