import {
  ImageList,
  ImageListItem,
  Box,
  Container,
  ImageListItemBar,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useMemo } from "react";
import styles from "styles.module.css";
import { targetServer } from "settings";

const PagesGallery = ({ itemClick, items, loading }) => {
  const matches = useMemo(() => items.length, [items]);

  const LoadedItems = () => {
    if (matches === 0) return <h1>🧐 Nothing found</h1>;
    return items
      .map((item) => ({ ...item, title: item.title.replace("assets/", "") }))
      .map((item, i) => {
        const imageLocation = `http://${targetServer}/api/fuzz/image/path/${item.img}`;

        return (
          <ImageListItem
            className={styles.imageBar}
            title={item.title}
            key={i}
            onClick={() => itemClick(imageLocation)}
          >
            <img
              src={imageLocation + "?w=164&h=164&fit=crop&auto=format"}
              srcSet={
                imageLocation + "?w=164&h=164&fit=crop&auto=format@dpr=2 x2"
              }
              alt={item.title}
              loading="lazy"
              width="100%"
              height="100%"
            />
            <ImageListItemBar
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundSize: "100% 100%",
                backgroundPosition: "0px 0px",
                backgroundImage:
                  "linear-gradient(90deg, rgb(70, 65, 93) 0%, rgba(19, 31, 39, 0.52) 100%)",
              }}
              title={item.title}
              sx={{ height: 25 }}
              actionIcon={
                <IconButton
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                  aria-label={`info about ${item.title}`}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        );
      });
  };

  return (
    <Container
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        height: "80%",
      }}
    >
      <Box
        sx={{ boxShadow: 5, width: "80%", height: "80%" }}
        style={{
          display: "flex",
          justifyContent: "center",
          border: "4px solid black",
          borderRadius: "5px",
          alignItems: loading ? "center" : "flex-start",
        }}
      >
        {loading ? (
          <div className={styles["dot-flashing"]}></div>
        ) : (
          <ImageList
            sx={{ width: "90%", height: "90%" }}
            cols={2}
            rowHeight={164}
            gap={5}
          >
            <LoadedItems />
          </ImageList>
        )}
      </Box>
    </Container>
  );
};

export default PagesGallery;
