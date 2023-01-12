import React from 'react';
import { Redirect } from 'react-router-dom';
import { setAuthToken } from './auth/handleSubmit';

function Logout() {
    localStorage.clear();
    setAuthToken(null);
    return <Redirect to='/login' />
}

export default Logout;