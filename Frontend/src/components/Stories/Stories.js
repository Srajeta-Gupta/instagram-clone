import React, { useEffect } from 'react'
import "./Stories.scss"
import { useState, useRef } from "react";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSelector } from "react-redux";
import { getAllUser } from "../../api/UserRequests";
import { Link } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';

const Stories = () => {

    const [persons, setPersons] = useState([]);
    const { user } = useSelector((state) => state.authReducer.authData);
    let { loading } = useSelector((state) => state.postReducer);
    const rowRef = useRef(null);

    useEffect(() => {
        const fetchPersons = async () => {
            const { data } = await getAllUser();
            setPersons(data);
        };
        fetchPersons();
    }, []);
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;


    const handleClick = (direction: string) => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current

            const scrollTo =
                direction === 'left'
                    ? scrollLeft - clientWidth
                    : scrollLeft + clientWidth
            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
        }
    }


    return (
        <>
            {
                loading ? <div className="stories_loader">
                    <Skeleton id="stories_loader" variant="circular" width={75} />
                    <Skeleton id="stories_loader" variant="circular" width={75} />
                    <Skeleton id="stories_loader" variant="circular" width={75} />
                    <Skeleton id="stories_loader" variant="circular" width={75} />
                    <Skeleton id="stories_loader" variant="circular" width={75} />
                    <Skeleton id="stories_loader" className="lastStory_loader" variant="circular" width={75} />
                </div>

                    :
                    <div className="stories">
                        {persons.length > 7 &&
                            <div className="rightNavigate" onClick={() => handleClick("left")}>

                                <button className="navButton leftNav"  >

                                    <KeyboardArrowLeftIcon />
                                </button >

                            </div>
                        }

                        <div className="images">
                            {persons.length === 1 && <h3 style={{ margin: "auto", marginTop: "3rem" }}>No other User Found</h3>}
                            <ul className="stories-list" ref={rowRef}>
                                {persons.map((person, id) => {
                                    return person._id !== user._id &&
                                        <li key={id}>
                                            <span >
                                                <Link to={`/posts/${person._id}`}>
                                                    <img src={
                                                        person.profilePicture
                                                            ? serverPublic + person.profilePicture
                                                            : serverPublic + "defaultProfile.png"
                                                    } alt={person.fullname} />
                                                    <p className="storyName">{person.username}</p>
                                                </Link>
                                            </span>

                                        </li>
                                })}
                            </ul>
                        </div>
                        {persons.length > 7 &&
                            <div className="leftNavigate" onClick={() => handleClick("right")}>

                                <button className="navButton rightNav" >
                                    <ChevronRightIcon />
                                </button >

                            </div>
                        }
                    </div>
            }
        </>
    )
}

export default Stories