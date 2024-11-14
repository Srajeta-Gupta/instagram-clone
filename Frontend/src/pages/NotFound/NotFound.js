import React from 'react';
import { Link } from 'react-router-dom';
import logo from './monkey.png'
import './styles.css'

const NotFound = () => {

  return <>

    <div className="container">
      <img id="image" src={logo} alt="Page Not Found" />
      <p id="content">This Page isn't available anymore</p>
      
      <Link to='/' id="button">Go To Home</Link>
    </div>

  </>;
};

export default NotFound;
