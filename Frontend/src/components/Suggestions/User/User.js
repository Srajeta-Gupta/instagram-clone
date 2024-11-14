import React, { useState } from 'react'
import '../Suggestions.css'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from "react-redux";
import { followUser, unfollowUser } from "../../../actions/UserAction";
import { Link } from 'react-router-dom';

const User = ({ person }) => {
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useSelector((state) => state.authReducer.authData);
  const dispatch = useDispatch()
  const alert = useAlert();

  const [following, setFollowing] = useState(
    person.followers.includes(user._id)
  );

  const handleFollow = () => {
    following
      ? dispatch(unfollowUser(person._id, user))
      : dispatch(followUser(person._id, user));
    setFollowing((prev) => !prev);
    setTimeout(() => {
      // eslint-disable-next-line
      following ? <>{alert.success(`${person.username} Unfollowed`), alert.info("Reload Page to see Updated Posts")}</>
        // eslint-disable-next-line
        : <>{alert.success(`${person.username} Followed`), alert.info("Reload Page to see Updated Posts")}</>
    }, 100);
  };
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
              <p className="username">Sugested for You</p>
            </div>
          </div>
        </Link>
        <button className="suggestion_content_btn" onClick={handleFollow}>{following ? "Following" : "Follow"}</button>
      </div>
    </>
  )
}

export default User