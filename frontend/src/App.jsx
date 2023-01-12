import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Main from './components/Main';
import Register from './components/Register';
import RouteGuard from './components/auth/RouterGuard';
import Logout from './components/Logout';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/login' component={Login} />
                <RouteGuard exact path='/home' component={Home} />
                <RouteGuard exact path='/main' component={Main} />
                <Route exact path='/register' component={Register} />
                <Route exact path='/logout' component={Logout} />
                <Redirect to="/home" />
            </Switch>
        </BrowserRouter>
    );
}

export default App;