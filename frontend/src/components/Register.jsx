import React from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import '../styles/login.css';
import { Link, Redirect } from 'react-router-dom';
import { useState } from 'react';
import { handleRegisterSubmit } from './auth/handleSubmit';
import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom';
import { setAuthToken } from './auth/handleSubmit';

export default function Register() {

    const [inputName, setInputName] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [inputRepeatPassword, setInputRepeatPassword] = useState("");
    const [errorMatchingPasswords, setErrorMatching] = useState("");
    const [registrationErrorMsg, setRegistrationErrorMsg] = useState("");
    const [emptyError, setEmptyErrors] = useState([false, false, false]);

    const history = useHistory();

    const tryRegister = () => {
        let empties = [!inputName, !inputEmail, !inputPassword];
        setEmptyErrors(empties);
        if (empties.some(x => x))
            return;
        if (inputPassword !== inputRepeatPassword) {
            setErrorMatching("The passwords do not match");
            return;
        }
        else {
            setErrorMatching("");
        }
        handleRegisterSubmit(inputName, inputEmail, inputPassword).then(
            response => {
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

                setRegistrationErrorMsg("");
            }
        ).catch(err => {
            if (err.response.status === 400)
                setRegistrationErrorMsg("You entered incorrect data");
            else if (err.response.status === 409)
                setRegistrationErrorMsg("User with this email already exists")
        });
    }

    if (localStorage.getItem("token")) {
        return <Redirect to='/home' />
    }

    return (
        <div className="lg-wrapper">
            <div className="container">

                <h2 id='welcome-new'>Register</h2>
                <label htmlFor="inputNamereg">your name</label>
                <Input value={inputName} onInput={e => setInputName(e.target.value)}
                    id="inputNamereg" type="email" name="loginEmail" />
                {
                    emptyError[0] && (<p style={{ color: "red" }}>Fill this field</p>)
                }

                <label htmlFor="inputEmailreg">e-mail</label>
                <Input value={inputEmail} onInput={e => setInputEmail(e.target.value)}
                    id="inputEmailreg" type="email" name="loginEmail" />
                {
                    emptyError[1] && (<p style={{ color: "red" }}>Fill this field</p>)
                }

                <label htmlFor="inputPasswordreg">password</label>
                <Input value={inputPassword} onInput={e => setInputPassword(e.target.value)}
                    id="inputPasswordreg" type="password" name="loginPassword" />
                {
                    emptyError[2] && (<p style={{ color: "red" }}>Fill this field</p>)
                }

                <label htmlFor="repeatPasswordreg">repeat password</label>
                <Input value={inputRepeatPassword} onInput={e => setInputRepeatPassword(e.target.value)}
                    id="inputPasswordreg2" type="password" name="loginPassword" />
                {
                    errorMatchingPasswords && (<p style={{ color: "red", marginBottom: "10px" }}>{errorMatchingPasswords}</p>)
                }

                <Button label='Sign up' name="register" onClick={tryRegister} />
                {
                    registrationErrorMsg && (<p style={{ color: "red" }}>{registrationErrorMsg} </p>)
                }

                <p id="have-account">Already have an account?</p>
                <Link to='/login' className='signinglink'>Sign in</Link>

            </div>
        </div>
    );
}