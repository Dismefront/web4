import axios from "axios";

export const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else
        delete axios.defaults.headers.common["Authorization"];
}

export const handleLoginSubmit = (email, password) => {
    const loginPayload = {
        email, password
    };

    return axios.post("http://localhost:7040/api/auth/authenticate", loginPayload);
}

export const handleRegisterSubmit = (name, email, password) => {
    const registerPayload = {
        name, email, password
    };

    return axios.post("http://localhost:7040/api/auth/register", registerPayload);
}

export const handleGoogleAuth = (name, email, sub) => {
    const registerPayload = {
        name, email, sub: sub.toString()
    };

    return axios.post("http://localhost:7040/api/auth/google", registerPayload);
}