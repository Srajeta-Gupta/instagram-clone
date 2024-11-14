import React, { useEffect } from 'react'
import "./Stories.scss"
import { useState, useRef } from "react";
import gsap from "gsap";
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

    useEffect(() => {
        const fetchPersons = async () => {
            const { data } = await getAllUser();
            setPersons(data);
        };
        fetchPersons();
    }, []);
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    let scrl = useRef(null);
    const [scrollX, setscrollX] = useState(0);
    const [scrolEnd, setscrolEnd] = useState(false);
    //Slide click
    const slide = (shift) => {
        scrl.current.scrollLeft += shift;
        setscrollX(scrollX + shift);

        if (
            Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
            scrl.current.offsetWidth
        ) {
            setscrolEnd(true);
        } else {
            setscrolEnd(false);
        }
    };

    //Anim
    const anim = (e) => {
        gsap.from(e.target, { scale: 1 });
        gsap.to(e.target, { scale: 1.1 });
    };
    const anim2 = (e) => {
        gsap.from(e.target, { scale: 1.1 });
        gsap.to(e.target, { scale: 1 });
    };

    const scrollCheck = () => {
        setscrollX(scrl.current.scrollLeft);
        if (
            Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
            scrl.current.offsetWidth
        ) {
            setscrolEnd(true);
        } else {
            setscrolEnd(false);
        }
    };

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
                            <div className="rightNavigate">
                                {scrollX !== 0 && (
                                    <button className="navButton leftNav"
                                        onClick={() => slide(-50)}
                                        onMouseEnter={(e) => anim(e)}
                                        onMouseLeave={(e) => anim2(e)}>

                                        <KeyboardArrowLeftIcon />
                                    </button >

                                )}
                            </div>
                        }

                        <div className="images">
                            {persons.length === 1 && <h3 style={{ margin: "auto", marginTop: "3rem" }}>No other User Found</h3>}
                            <ul className="stories-list" ref={scrl} onScroll={scrollCheck}>
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
                            <div className="leftNavigate">
                                {!scrolEnd && (
                                    <button className="navButton rightNav"
                                        onClick={() => slide(+50)}
                                        onMouseEnter={(e) => anim(e)}
                                        onMouseLeave={(e) => anim2(e)}>

                                        <ChevronRightIcon />
                                    </button >

                                )}
                            </div>
                        }
                    </div>
            }
        </>
    )
}

export default Stories