import NavBar from "./components/NavBar";
import SearchInput from "./components/SearchInput";
import axios from "axios";
import { withStyles } from "@mui/styles";
import { useEffect, useState, useCallback } from "react";
import PagesGallery from "./components/PagesGallery";
import HighlightWindow from "./components/HighlightWindow";
import FilesSelector from "./components/FilesSelector";
import styles from './styles.module.css'

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
      "http://localhost:8000/api/fuzz/file/names"
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
        "http://localhost:8000/api/fuzz/image/by/keyword",
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

  const onSearchClick = (el) => {
    setItems([]);
    fetchMatchImages((data) => {
      data.forEach(({ file, keyword, matchedImages }) => {
        matchedImages.forEach((image) => {
          setItems((oldItems) => [
            ...oldItems,
            { img: image, title: `${file}_${keyword}` },
          ]);
        });
      });
    });
  };




  useEffect(() => {
    fetchFilesMeta();
  }, []);

  return (
    <div className={styles.appWrapper}>
      <NavBar position="static" highlighted={highlighted} />
      <HighlightWindow
        highlighted={highlighted}
        setHighlighted={setHighlighted}
        highlightedItem={highlightedItem}
      />
      <div className={styles.tools}>
        <div className={styles.fileSelector} >
          {metas ? (
            <FilesSelector
              metas={metas}
              handleItemSelection={handleItemSelection}

            />
          ) : (
            <p>Loading ...</p>
          )}
        </div>
        <div
          className={styles.galleryContainer}
        >
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
