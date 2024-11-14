import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/AuthAction';
import { Link } from 'react-router-dom';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import Logout from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';



const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { user } = useSelector((state) => state.authReducer.authData);
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
    const dispatch = useDispatch()

    const handleClick = (event) => {
        setIsOpen(state => !state);
    };
    const handleLogOut = () => {
        dispatch(logout())
    }

    return (
        <>
            <div className="navbarRoute">
                <img className="avatarImage" src={
                    user.profilePicture
                        ? serverPublic + user.profilePicture
                        : serverPublic + "defaultProfile.png"
                } alt={user.fullname} sx={{ width: 32, height: 32 }} onClick={handleClick} />



                {isOpen &&

                    <div className="navigateToProfile" onClick={() => setIsOpen(false)}>
                        <div className="items" style={{ marginTop: "1rem" }}>
                            <Link to={`/profile/${user._id}`}>
                                <div className="item linkToProfile">
                                    <img className="avatarImage" src={
                                        user.profilePicture
                                            ? serverPublic + user.profilePicture
                                            : serverPublic + "defaultProfile.png"
                                    } alt={user.fullname} />
                                    <span style={{ color: "black" }}>{user.fullname}</span>
                                </div>
                            </Link>

                            <div className="divider" style={{ margin: "0.5rem" }}>
                                <Divider />
                            </div>
                            <div className="item">
                                <PersonAdd fontSize="small" />
                                <p>  Add another account</p>
                            </div>

                            <div className="item">
                                <BookmarkAddedIcon fontSize="small" />
                                <p>Saved</p>
                            </div>

                            <div className="item">
                                <Settings fontSize="small" />
                                <p>Settings</p>
                            </div>

                            <div className="item" onClick={handleLogOut} >
                                <Logout fontSize="small" />
                                <p>Logout</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default Menu