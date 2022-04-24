import {AppBar, Toolbar, Typography} from '@mui/material'

const NavBar = ({position,highlighted}) => {
    return (
        <AppBar position={position} style={{display: highlighted?'none':'flex'}}>
            <Toolbar>
                <Typography variant="subtitle1">
                    Header
                </Typography>
            </Toolbar>
        </AppBar>
    )
}


export default NavBar