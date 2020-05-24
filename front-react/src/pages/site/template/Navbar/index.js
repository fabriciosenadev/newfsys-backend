import React from 'react';
import { Link } from'react-router-dom';

// import './styles.css';

export default function Navbar()
{
    return(
        <div>
            <Link to="/"> Home</Link> &nbsp;
            <Link to="/about"> About</Link>
        </div>
    );
}