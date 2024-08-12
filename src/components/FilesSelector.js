import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";

const FilesSelector = ({ metas, handleItemSelection }) => {
  const [checked, setChecked] = useState(Array(metas.length).fill(true));

  const handleChange = (id, name) => {
    setChecked((old) => {
      let new_l = [...old];
      new_l[id] = !new_l[id];
      return new_l;
    });
    handleItemSelection(name);
  };

  const allChecked =
    checked.length > 0 && checked.reduce((a, b) => a && b, true);

  const handleGroupToggle = () => {
    if (allChecked) {
      setChecked(Array(metas.length).fill(false));
    } else {
      setChecked(Array(metas.length).fill(true));
    }
  };

  return (
    <FormGroup style={{ padding: 50 }}>
      <FormControlLabel
        control={
          <Button
            onClick={handleGroupToggle}
            style={{
              padding: "0 0",
              textDecoration: "underline",
              borderRadius: "15px",
            }}
            color="primary"
          >
            <Checkbox checked={allChecked} onChange={handleGroupToggle} />
            Check all
          </Button>
        }
      />
      {metas.map(({ name }, c) => (
        <FormControlLabel
          id={c}
          key={name + c}
          control={
            <Checkbox
              checked={Boolean(checked[c])}
              onChange={(e) => {
                handleChange(c, name);
              }}
            />
          }
          label={name}
        />
      ))}
    </FormGroup>
  );
};

export default FilesSelector;
