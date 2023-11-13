import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, TextField, Button, Box, Card,
    CardContent } from '@mui/material';

import { makeStyles } from "@mui/material/styles";
import Axios from "axios";
import CarIcon from '@mui/icons-material/DirectionsCar';
// import Axios from "axios";
// import { SessionContext, setSessionCookie } from "../components/UserContext";
// import { useHistory } from "react-router";
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    menuIconBox: {
        color: '#fff',
        marginRight:"2rem",
        fontSize: '1.3rem',
    },

    link:{
        textDecoration: 'none',
        color:'grey'
    },
    appBar:{
        padding:'0.7rem',
        backgroundColor:'#FF9130'
    }
};

//you can reuse this nav bar in all pages, anything reusable should go in the components directory
function NavBarLogin() {
    const [anchorEl, setAnchorEl] = React.useState(null);

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

                        <Button style={styles.menuIconBox}>
                        <Link style={{ textDecoration: 'none',color:'#fff'}} to="/">HOME</Link>
                        </Button>

                        <Box style={{ flexGrow: 1 }}></Box>
                      
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}

function Login() {
    const [errorMessage, setErrMessage] = useState('');
    var UserisRegistered = false;
    const [isRegistered, setRegisterState] = useState(true);
    const history = useNavigate();
    const [loggedInUser, setLoggedInUser] = useState('');
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    // console.log(loginMessage);
    // const history = useHistory();
    // const { setSession } = useContext(SessionContext);
   
    // useEffect(() => {
    //     Axios.get("/api/login").then((response) => {
    //         if (response.data.loggedIn == true) {
    //             console.log(response.data.user);
    //             setLoggedInUser(response.data.user.username);
    //         };
    //     }).catch((error) => {
    //         setErrMessage("Error encountered on the server.");
    //     });
    // }, []);
    function handleClicked(event) {
        event.preventDefault();
        Axios.get("/api/login",{ params: { 'username': username } }).then((response) => {
            
            if (response.data == '') {
                // console.log(response.data.user);
                // setLoggedInUser(response.data.user.username);
                toast.error('Sorry, the user does not exist. Please log in as a different user', {
                    position: "top-center",
                    autoClose: true,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            }
            else{
                if(response.data.password==password){
                    sessionStorage.setItem('user', username);
                    navigate('/');
                }
                else{
                    toast.error('The password is not correct for the username.', {
                        position: "top-center",
                        autoClose: true,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });
                }
            }
            ;
        }).catch((error) => {
            setErrMessage("Error encountered on the server.");
        });
    }

    
    return (
        <div>
        <NavBarLogin></NavBarLogin>
        <ToastContainer />
        <Container maxWidth="md">
        <Card style={{marginTop:80,  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)'}}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h2">
            Sign in
          </Typography>
          <CarIcon style={{ fontSize: 140 }} />
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email Address"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              label="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
           
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClicked}
            >
              Sign In
            </Button>
          </Box>
          </CardContent>
      </Card>
      </Container>
             
      </div>
    );
}
export default Login;
