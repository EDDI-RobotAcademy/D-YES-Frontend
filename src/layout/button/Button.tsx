import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import "./css/Button.css";

const Button: React.FC = () => {
    const [isButtonVisible, setIsButtonVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsButtonVisible(true);
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className={`button-container ${isButtonVisible ? 'show' : ''}`}>
            <Link to="/productList" className="goto-home">
                TTMARKET
            </Link>
        </div>
    );
};
export default Button;