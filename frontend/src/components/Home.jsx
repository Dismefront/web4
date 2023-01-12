import React from 'react';
import { Fragment } from 'react';
import '../scripts/scroll';
import Parallax from './Parallax';
import Date from './CurrentDateHeader';
import Images from './VariantImages.jsx';
import Nav from './Navbar';

// const NO_BACKGROUND = 'none';

function Home() {
    // document.body.style.backgroundImage = NO_BACKGROUND;
    document.body.style.backgroundColor = "#000000";
    return (
        <Fragment>
            <Nav />
            <Parallax />
            <Date />
            <Images />
        </Fragment>
    );
}

export default Home;