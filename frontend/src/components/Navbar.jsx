import React from 'react';
import '../styles/navbar.css';
import { Link } from 'react-router-dom';

function Nav() {
    let userName = localStorage.getItem("name");
    return (
        <nav id='navigation'>
            <ul>
                <li>
                    <Link to='/home'>Home</Link>
                </li>
                <li>
                    <Link to='/main'>App</Link>
                </li>
                <li>
                    <Link to='/logout'>Log out ({ userName })</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;