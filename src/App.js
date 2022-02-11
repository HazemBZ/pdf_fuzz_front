import NavBar from "./components/NavBar";
// import {} from '@material-ui/core'
import {
  Button,
  ButtonGroup,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { ViewList, ViewModule, ViewModuleIcon } from "@mui/icons-material";
import { useState } from "react";
import ListGallery from "./components/ListGallery";
const App = ({ classes }) => {
  const [viewOption, setViewOption] = useState("list");
  return (
    <div>
      <NavBar />
      <div className={classes.parent}>
        <div className={classes.buttonGroupLayout}>
          <ToggleButtonGroup
            size="large"
            variant="outlined"
            value={viewOption}
            onChange={(event, newOption) => {
              setViewOption(newOption);
            }}
            exclusive
          >
            <ToggleButton value="list">
              <ViewList />
            </ToggleButton>
            <ToggleButton value="grid">
              <ViewModule />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <ListGallery />
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
