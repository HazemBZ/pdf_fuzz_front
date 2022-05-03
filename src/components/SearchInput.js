import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function CustomizedInputBase({onChange, wordValue, searchClick}) {
  return (
    <Paper
      component="form"
      sx={{marginTop:'50px', p: '2px 4px', display: 'flex', alignItems: 'center', width: 400,border:'4px solid black'}}
    >
      {/* <IconButton sx={{ p: '10px' }} aria-label="menu">
        <MenuIcon />
      </IconButton> */}
      <InputBase
        sx={{ ml: 1, flex: 1,}}
        placeholder="Search for keyword"
        inputProps={{ 'aria-label': 'search for keyword' }}
        onChange={(e) => onChange(e)}
        value={wordValue}
        onKeyPress={(event) => {
          console.log(event.key)
          if (event.key === 'Enter'){
            event.preventDefault()
            searchClick()
       }}}
       
      />
      <IconButton  onClick={()=>searchClick()} sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}