import { withStyles } from "@mui/styles";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import FilesSelector from "./components/FilesSelector";
import HighlightWindow from "./components/HighlightWindow";
import NavBar from "./components/NavBar";
import PagesGallery from "./components/PagesGallery";
import SearchInput from "./components/SearchInput";
import styles from "./styles.module.css";
import { targetServer } from "settings";

const App = ({ classes }) => {
  const [metas, setMetas] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState({});

  const fetchFilesMeta = async () => {
    const response = await axios.get(
      `http://${targetServer}/api/fuzz/file/names`
    );
    const data = await response.data;
    setMetas(data);
  };

  const fetchMatchImages = useCallback(
    async (cb) => {
      setLoading(true);
      const files = metas
        .filter((meta) => selected.includes(meta.name))
        .map((m) => m.path);
      const response = await axios.post(
        `http://${targetServer}/api/fuzz/image/by/keyword`,

        { files, keyword: searchWord }
      );
      const data = response.data;
      cb(data);
      setLoading(false);
    },
    [metas, searchWord, selected]
  );

  const highlightItem = (item) => {
    setHighlighted(true);
    setHighlightedItem(item);
  };

  const handleItemSelection = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((el) => el !== item));
    } else {
      setSelected((old) => [...old, item]);
    }
  };

  const onSearchClick = async (el) => {
    fetchMatchImages((data) => {
      const newItems = data.flatMap(({ file, keyword, matchedImages }) =>
        matchedImages.map((matchImage) => ({
          img: matchImage,
          title: `${file}_${keyword}`,
        }))
      );
      setItems(newItems);
    });
  };

  useEffect(() => {
    fetchFilesMeta();
  }, []);

  return (
    <div className={styles.appWrapper}>
      <NavBar position="static" highlighted={highlighted} />
      {highlighted && (
        <HighlightWindow
          highlighted={highlighted}
          setHighlighted={setHighlighted}
          highlightedItem={highlightedItem}
        />
      )}
      <div className={styles.tools}>
        <div className={styles.fileSelector}>
          {metas ? (
            <FilesSelector
              metas={metas}
              handleItemSelection={handleItemSelection}
            />
          ) : (
            <p>Loading ...</p>
          )}
        </div>
        <div className={styles.galleryContainer}>
          <SearchInput
            onChange={(e) => setSearchWord(e.target.value)}
            wordValue={searchWord}
            searchClick={onSearchClick}
          />
          {items ? (
            <PagesGallery
              loading={loading}
              items={items}
              itemClick={highlightItem}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

const muiStyles = {
  buttonGroupLayout: {
    display: "flex",
    justifyContent: "center",
    marginTop: "50px",
  },
  parent: {
    display: "flex",
    flexDirection: "column",
    alignItemsf: "center",
  },
};

export default withStyles(muiStyles)(App);
