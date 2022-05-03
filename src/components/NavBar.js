import {AppBar, Toolbar, Typography} from '@mui/material'

const NavBar = ({position,highlighted}) => {
    return (
        <AppBar position={position} style={{display: highlighted?'none':'flex', background:'rgb(40, 46, 55)'}}>
            <Toolbar>
                <Typography m={1} variant="h4" textAlign="center">
                    PDF-Fuzz
                </Typography>
            </Toolbar>
        </AppBar>
    )
}


export default NavBar