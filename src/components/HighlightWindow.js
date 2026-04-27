/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styles from "../styles.module.css";
import { TransformWrapper } from "react-zoom-pan-pinch";
import { TransformComponent } from "react-zoom-pan-pinch";
import { Button, Icon, IconButton } from "@mui/material";
import { Image, PictureAsPdf } from "@mui/icons-material";
import { targetServer } from "settings";

const DocumentViewer = ({ imageURI }) => {
  const extension = "pdf";

  const imageURIToFileURI = (uri) => {
    const parts = uri.split("/");
    const filePart = parts[parts.length - 1];
    console.log("filePart:", filePart);
    const fileName = filePart.split(".")[0] + "." + extension;
    const cleanedFileName = fileName.split("_").slice(1).join("_");
    return cleanedFileName;
  };

  const uri = imageURIToFileURI(imageURI);

  const completeUrl = `http://${targetServer}/api/fuzz/file/read/${uri}`;
  return (
    <object
      data={completeUrl}
      type="application/pdf"
      width="100%"
      height="100%"
    >
      <iframe src={completeUrl} width="100%" height="100%">
        This browser does not support PDFs. Please download the PDF to view it
        <a href={completeUrl}>Download PDF</a>
      </iframe>
    </object>
  );
};

const ImageViewer = ({ imageURI }) => {
  return (
    <TransformWrapper initialScale={1} centerOnInit>
      <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
        {/* <img src={URL.createObjectURL(data)} /> */}
        <img src={imageURI} height="800" alt="Highlighted item" />
      </TransformComponent>
    </TransformWrapper>
  );
};

// TODO: Add zomm-pinch-tool
const HighlightWindow = ({ highlighted, setHighlighted, highlightedItem }) => {
  const [viewMode, setViewMode] = useState("image");

  const handleKeydown = (event) => {
    if (event.key === "Escape") setHighlighted(false);
    if (event.key === "ArrowLeft") {
      // TODO: Set prev item
    }
    if (event.key === "ArrowRight") {
      // TODO: Set next item
    }
  };

  const toggleViewMode = () => {
    if (viewMode === "image") {
      setViewMode("pdf");
    } else {
      setViewMode("image");
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
      <div
        onClick={(e) => e.stopPropagation()}
        className={styles.highlightWindowContent}
      >
        {/* <div className={styles.highlightWindowImageContainer}> */}
        {viewMode === "image" ? (
          <ImageViewer imageURI={highlightedItem} />
        ) : (
          <DocumentViewer imageURI={highlightedItem} />
        )}
        {/* </div> */}
        <div className={styles.highlightWindowsToolbar}>
          <IconButton
            aria-label="View Mode"
            onClick={toggleViewMode}
            color="primary"
          >
            {viewMode === "image" ? <Image /> : <PictureAsPdf />}
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default HighlightWindow;
