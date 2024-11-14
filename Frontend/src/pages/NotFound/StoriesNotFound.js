import React from 'react';
import { Link } from 'react-router-dom';
import logo from './monkey.png'
import './styles.css'

const StoriesNotFound = () => {

    return (<>



        <div className="container">
            <img id="image" src={logo} alt="Page Not Found" />
            <p id="content">Selected User not Followed or No Post Uploaded By User Yet</p>
            <Link to='/' id="button">Go To Home</Link>
        </div>



    </>);
};

export default StoriesNotFound;
