import React from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import '../styles/login.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { handleLoginSubmit, setAuthToken, handleGoogleAuth } from './auth/handleSubmit';

const CLIENT_ID = "890333153092-n67ljh8vcam0j71t5mr0ug25uivji4ip.apps.googleusercontent.com";

export default function Login() {

    const [lginput, setlginput] = useState("");
    const [pwinput, setpwinput] = useState("");

    let history = useHistory();
    const [errormessage, setErrormessage] = useState("");

    const tryLogIn = () => {
        handleLoginSubmit(lginput, pwinput).then(response => {
            //get token from response
            const token = response.data.token;

            //set JWT token to local
            let decoded = jwt_decode(token);
            let roles = [];
            decoded.role.forEach(x => roles.push(x));
            localStorage.setItem("roles", roles);
            localStorage.setItem("name", decoded.name);
            localStorage.setItem("email", decoded.sub);
            localStorage.setItem("token", token);

            //set token to axios common header
            setAuthToken(token);

            history.push('/home');
            setErrormessage("");
            // window.location.href = '/home';
        }
        ).catch(err => setErrormessage("Incorrect username or password"));
    }

    if (localStorage.getItem("token")) {
        return <Redirect to='/home' />
    }

    return (
        <div className="lg-wrapper">
            <div className="container">
                <h2 id='welcome-back'>Welcome back</h2>
                <label htmlFor="inputEmail">e-mail</label>
                <Input
                    onInput={e => setlginput(e.target.value)}
                    value={lginput} id="inputEmail" type="email" name="loginEmail" />
                <label htmlFor="inputPassword">password</label>
                <Input
                    onInput={e => setpwinput(e.target.value)}
                    value={pwinput} id="inputPassword" type="password" name="loginPassword" />
                <Button label='Sign in' name="logIn" onClick={tryLogIn} />
                {
                    errormessage && <p style={{ color: "red", marginBottom: "10px" }} >{errormessage}</p>
                }

                <GoogleOAuthProvider clientId={CLIENT_ID}>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            let decoded = jwt_decode(credentialResponse.credential);
                            handleGoogleAuth(decoded.name, decoded.email, decoded.sub).then(
                                response => {
                                    const token = response.data.token;

                                    //set JWT token to local
                                    let decoded2 = jwt_decode(token);
                                    let roles = [];
                                    decoded2.role.forEach(x => roles.push(x));
                                    localStorage.setItem("roles", roles);
                                    localStorage.setItem("name", decoded2.name);
                                    localStorage.setItem("email", decoded2.sub);
                                    localStorage.setItem("token", token);

                                    //set token to axios common header
                                    setAuthToken(token);
                                    
                                    history.push('/home');
                                    setErrormessage("");
                                }
                            )
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </GoogleOAuthProvider>

                <p id="no-account">Don't have an account?</p>
                <Link to='/register' className='signinglink'>Sign up</Link>

            </div>
        </div>
    );
}