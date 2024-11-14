import React from 'react'
import '../../components/Suggestions/Suggestions.css'
import { Link } from 'react-router-dom';

const User = ({ person }) => {
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    // console.log(person);

    return (
        <>
            <div className="suggestion_content">
                <Link to={`/profile/${person._id}`}>
                    <div className="suggested_users">
                        <img className="suggested_users_image" src={
                            person.profilePicture
                                ? serverPublic + person.profilePicture
                                : serverPublic + "defaultProfile.png"
                        } alt={person.fullname} />
                        <div className="user_details">
                            <span className="user_id">{person.username} <br /> {person.fullname} </span>
                            <p className="username">Search Result</p>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default User