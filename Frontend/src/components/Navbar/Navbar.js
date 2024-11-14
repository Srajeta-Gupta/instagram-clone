import React, { useState, useEffect } from 'react'
import "./Navbar.css"

import HomeIcon from '@mui/icons-material/Home';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom'

import SearchBar from './SearchBar';
import AccountMenu from './Menu';
import ShareModal from '../PostShare/ShareModal/ShareModal';
import SearchModal from './Modals/SearchModal';
import logo from './images/logo.png';
import FollowersModal from '../Suggestions/Modal/FollowersModal';
import { getAllUser } from '../../api/UserRequests';

const Navbar = () => {

    const [modalOpened, setModalOpened] = useState(false);
    const [searchModalOpened, setSearchModalOpened] = useState(false);
    const [followersModalOpened, setFollowersModalOpened] = useState(false);
    const [persons, setPersons] = useState([]);

    useEffect(() => {
        const fetchPersons = async () => {
            const { data } = await getAllUser();
            setPersons(data);
        };
        fetchPersons();
    }, []);

    return (
        <>
            <div className="navbar_container">

                <div className="navbar_main">
                    <Link to={`/home`} >
                        <div className="logo_img">
                            <img src={logo} alt="" />
                        </div>
                    </Link>
                    <div className="search" >
                        <SearchBar />
                    </div>
                    <div className="functions">
                        <ul className="functions_list">

                            <li><Link to="/home"><HomeIcon /></Link></li>
                            <li><Link to="/chat"><ForumOutlinedIcon /></Link></li>

                            <li onClick={() => setModalOpened(true)}>
                                <AddPhotoAlternateIcon />
                            </li>

                            <ShareModal modalOpened={modalOpened}
                                setModalOpened={setModalOpened} />

                            <li onClick={() => setFollowersModalOpened(true)}><ExploreOutlinedIcon /></li>
                            <FollowersModal
                                followersModalOpened={followersModalOpened}
                                setFollowersModalOpened={setFollowersModalOpened}
                                persons={persons}
                            />
                            <li><FavoriteBorderIcon /></li>
                            <li onClick={() => setSearchModalOpened(true)}><SearchIcon /></li>
                            <SearchModal searchModalOpened={searchModalOpened}
                                setSearchModalOpened={setSearchModalOpened} />
                            <AccountMenu />
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar