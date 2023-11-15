import * as React from 'react';
import { AppBar, Button, Box, Container, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Link, useNavigate } from 'react-router-dom';
import Axios from "axios";
const navItems = [{name:'Seller History',path:'/sellerHistory'},{name:'Average Time in Inventory Report',path:'/averageTime'},{name:'Price Per Condition Report',path:'/priceReport'},{name:'Parts Statistics Report',path:'/partsStatistics'},{name:'Monthly Sales Report',path:'/SummaryReport'}];

const styles = {

    logoIcon: {
        fontSize: '2rem',
        marginRight: '10px',
        color: '#fff'
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#fff',
        textDecoration: 'none',
        marginRight: '2rem' // Increase this value as required

    },
    navButtonBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginRight: 'auto'
    },
    menuIconBox: {
        color: '#fff',
        marginRight: "2rem",
        fontSize: '1.3rem',
    },
    loginButton: {
        color: '#fff',
        textTransform: 'uppercase',
        border: '3px solid #fff',
        borderRadius: '4px',
        padding: '0.7rem 2rem',
        fontSize: '1rem'
    },
    reportButton: {
        color: '#fff',
        textTransform: 'uppercase',
        fontSize: '1.2rem',
    },
    link: {
        textDecoration: 'none',
        color: 'grey'
    },
    appBar: {
        padding: '0.7rem',
        backgroundColor: '#FF9130'
    }
};

//you can reuse this nav bar in all pages, anything reusable should go in the components directory
export default function NavBar() {

    function LogOut() {
        setLoggedInUser(null);
        sessionStorage.clear();
        window.location.reload();

    }
    const [loggedInUser, setLoggedInUser] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isManagerOrOwner, setIsManagerorOwner] = React.useState(false);
    const [isInventoryOrOwner, setIsInventoryOrOwner] = React.useState(false);
    const navigate = useNavigate();
    React.useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setLoggedInUser(storedUser);
            Axios.get("/api/isManagerOrOwner", { params: { 'username': storedUser } }).then((response) => {
                if (response.data == false) {
                    setIsManagerorOwner(false);
                    setIsInventoryOrOwner(false);
                }
                else {
                    setIsManagerorOwner(true);
                    setIsInventoryOrOwner(true);
                }
                ;
            }).catch((error) => {
                console.log(error);
            });
        }
    }, []);

    return (
        <Box sx={{ width: '60%', padding: 'auto', margin: '0 auto' }}>
            <AppBar style={styles.appBar} position="static" component="nav">
                <Container maxWidth="xl">
                    <Toolbar>
                        <DirectionsCarIcon style={styles.logoIcon} />
                        <Typography
                            noWrap
                            component="a"
                            style={styles.logoText}
                        >
                            BuzzCar
                        </Typography>

                        {/* Other buttons can be added similarly to this one */}
                        <Button style={styles.menuIconBox}>
                            <Link style={{ textDecoration: 'none', color: '#fff' }} to="/">HOME</Link>
                        </Button>

                        {/* Report Dropdown */}
                        {isManagerOrOwner == true &&
                            <div>
                                <Button
                                    aria-controls="report-menu"
                                    aria-haspopup="true"
                                    onClick={(event) => setAnchorEl(event.currentTarget)}
                                    style={styles.reportButton}
                                >
                                    Reports
                                </Button>
                                <Menu
                                    id="report-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)}
                                >
                                    {navItems.map((item) => (
                                        <MenuItem key={item.name} onClick={(event) => setAnchorEl(event.currentTarget)}>
                                            <Link style={styles.link} to={item.path}>
                                                {item.name}
                                            </Link>

                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        }
                        <Box style={{ flexGrow: 1 }}></Box>
                        {loggedInUser === null ?
                            <Button onClick={() => navigate('/Login')} style={styles.loginButton}>Login</Button> :
                            <Button onClick={LogOut} style={styles.loginButton}>Log Out</Button>
                        }
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}