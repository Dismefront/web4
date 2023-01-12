import React from 'react';
import layer2 from '../imgs/parallax/layer2.png';
import layer1 from '../imgs/parallax/layer1.png';
import vignette from '../imgs/parallax/vignette.png';
import '../styles/parallax.css';

function Parallax() {
    return (<div className="parallax">
        <div className="layers">
            <div className="header">
                <div className="initials">Erik Romaikin</div>
                <div className="variant">23456</div>
            </div>
            <div className="layer layer_2">
                <img src={layer2} alt='layer2' />
            </div>
            <div className="layer layer_1">
                <img src={layer1} alt="layer1" />
            </div>
            <div className="layer vignette">
                <img src={vignette} alt="vignette" />
            </div>
        </div>
    </div>);
}

export default Parallax;