import React from 'react';

import './Loader.scss';

function Loader() {
    return (
        <div className="spinner-box">
            <div className="circle-border">
                <div className="circle-core"></div>
            </div>
        </div>
    );
}
export default Loader;
