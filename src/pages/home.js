import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import FilesSelector from "components/FilesSelector";
import HighlightWindow from "components/HighlightWindow";
import NavBar from "components/NavBar";
import PagesGallery from "components/PagesGallery";
import SearchInput from "components/SearchInput";
import styles from "../styles.module.css";
import { targetServer } from "settings";
import FolderUploader from "components/FolderUploader";
import { useQuery } from "@tanstack/react-query";

function Home() {
  const [selected, setSelected] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState({});


  // TODO: GET PDF FILENAME FROM HERE then use it to read file
  
  const {
    data: metas,
    isLoding,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["get-files-meta"],
    queryFn: async () =>
      axios
        .get(`http://${targetServer}/api/fuzz/file/names`)
        .then((resp) => resp.data),
  });

  const isLoadingMeta = isLoding || isFetching;

  // const fetchFilesMeta = async () => {
  //   const response = await axios.get(
  //     `http://${targetServer}/api/fuzz/file/names`
  //   );
  //   const data = await response.data;
  //   setMetas(data);
  // };

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
    setHighlightedItem(item);
    setHighlighted(true);
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
          title: `${file}`,
        }))
      );
      setItems(newItems);
    });
  };

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
          <FolderUploader />
          {isLoadingMeta ? (
            <p>Loading ...</p>
          ) : (
            <FilesSelector
              metas={metas}
              handleItemSelection={handleItemSelection}
            />
          )}
        </div>
        <div className={styles.galleryContainer}>
          <SearchInput
            onChange={(e) => setSearchWord(e.target.value)}
            wordValue={searchWord}
            searchClick={onSearchClick}
          />
          <PagesGallery
            loading={loading}
            items={items}
            itemClick={highlightItem}
          />
        </div>
      </div>
    </div>
  );
}

export { Home };
