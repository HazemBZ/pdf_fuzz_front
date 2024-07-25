import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";

const FilesSelector = ({ metas, handleItemSelection }) => {
  const [checked, setChecked] = useState(Array(metas.length).fill(false));

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
      {metas.map(({ name }, c) => (
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

export default FilesSelector;
