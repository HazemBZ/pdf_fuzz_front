import NavBar from "./components/NavBar";
import SearchInput from "./components/SearchInput";
import axios from "axios";
import { withStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import PagesGallery from "./components/PagesGallery";
import { Box, FormGroup, FormControlLabel, Checkbox } from "@mui/material";

const App = ({ classes }) => {
  const [names, setNames] = useState([]);
  const [selected, setSelected] = useState(""); // selected files
  const [searchWord, setSearchWord] = useState("");
  const [items, setItems] = useState([]); // image items
  const [loading, setLoading] = useState(false)
  const [highlighted, setHighlighted] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState({});

  const fetchNames = async () => {
    const response = await axios.get(
      "http://localhost:8000/api/fuzz/file/names"
    );
    const data = await response.data;
    console.log(data);
    setNames(data);
  };

  const fetchMatchImages = async (cb) => {
    setLoading(true)
    const response = await axios.post(
      "http://localhost:8000/api/fuzz/image/by/keyword",
      { files: selected, keyword: searchWord }
    );
    const data = response.data;
    cb(data);
    setLoading(false)
  };

  const handleItemSelection = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((el) => el !== item));
    } else {
      setSelected((old) => [...old, item]);
    }
  };



  const FileList2 = (Names) => {
    const [checked, setChecked] = useState(Array(Names.length).fill(false));
    const handleChange = (event, name) => {
      const id = event.target.id;
      setChecked((old) => {
        let new_a = [...old];
        new_a[id] = !new_a[id];
        return new_a;
      });
      handleItemSelection(name);
    };
    return (
      <FormGroup style={{ padding: 50 }}>
        {Names.map((name, c) => (
          <FormControlLabel
            id={c}
            key={name + c}
            control={
              <Checkbox
                checked={checked[c]}
                onChange={(e) => handleChange(e, name)}
              />
            }
            label={name}
          />
        ))}
      </FormGroup>
    );
  };

  const onSearchClick = (el) => {
    console.log(`searching for ${searchWord} in ${selected}`);
    setItems([]);
    fetchMatchImages((data) => {
      console.log(data);
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

  const Highlight = () => {
    return (
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: "10",
          margin: 0,
          display: highlighted ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "grey",
        }}
        onClick={() => setHighlighted(false)}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <img src={highlightedItem.img} height="800" />
        </div>
      </div>
    );
  };

  const highlightItem = (item) => {
    setHighlighted(true);
    setHighlightedItem(item);
  };

  useEffect(() => {
    fetchNames();
  }, []);
  return (
    <div style={{ height: "100%", backgroundColor: "white" }}>
      <NavBar position="static" highlighted={highlighted} />
      <Highlight />
      <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
        {/* <div style={{ , flexDirection: "row", height:"100%" }}> */}
        <div style={{ height: "100%", margin: "50px" }}>
          {names ? FileList2(names) : "Loading ..."}
        </div>
        <div
          style={{
            width: "80%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
            marginTop: "0px",
          }}
        >
          <SearchInput
            onChange={(e) => setSearchWord(e.target.value)}
            wordValue={searchWord}
            searchClick={onSearchClick}
          />
          {items ? (
            <PagesGallery loading={loading} items={items} itemClick={highlightItem} />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
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

export default withStyles(styles)(App);
