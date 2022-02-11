import {AppBar, Toolbar, Typography} from '@mui/material'

const NavBar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="subtitle1">
                    Header
                </Typography>
            </Toolbar>
        </AppBar>
    )
}


export default NavBar