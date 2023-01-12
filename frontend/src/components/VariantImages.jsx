import React from 'react';
import var1 from "../imgs/variant/var1.png";
import var2 from "../imgs/variant/var2.png";
import var3 from "../imgs/variant/var3.png";
import var4 from "../imgs/variant/var4.png";
import '../styles/variantimages.css';


function Images() {
    return (
        <div className="varimgs">
            <img src={var1} alt="var1" />
            <img src={var2} alt="var2" />
            <img src={var3} alt="var3" />
            <img src={var4} alt="var4" />
        </div>
    );
}

export default Images;