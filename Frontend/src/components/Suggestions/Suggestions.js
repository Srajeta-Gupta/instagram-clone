import React, { useState, useEffect } from 'react'
import './Suggestions.css'
import User from './User/User'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";
import { getAllUser } from "../../api/UserRequests";
import ProfileModal from '../Profile/ProfileModal/ProfileModal';
import FollowersModal from './Modal/FollowersModal';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const Suggestions = () => {

  const { user } = useSelector((state) => state.authReducer.authData);
  let { loading } = useSelector((state) => state.postReducer);
  const [persons, setPersons] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [followersModalOpened, setFollowersModalOpened] = useState(false);

  useEffect(() => {
    const fetchPersons = async () => {
      const { data } = await getAllUser();
      setPersons(data);
    };
    fetchPersons();
  }, []);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  const id = user._id

  return (
    <>
      {loading ?
        <div id="suggestions_loader">
          <Stack spacing={1} key={id}>
            <Stack direction="row" spacing={2}>
              <Skeleton variant="circular" width={60} height={60} />
              <Stack>
                <Skeleton id="username__Loader" variant="text" width={100} height={20} />
                <Skeleton id="timestamp__Loader" variant="text" width={50} height={12.5} />
              </Stack>
            </Stack>
            <Skeleton id="post__Loader" variant="text" width={200} />
            <Skeleton id="post__Loader" variant="rectangular" width={250} height={200} />
          </Stack>
        </div>
        :
        <div className="suggestions_main_container">
          <div className="user_info">
            <Link to={`/profile/${id}`} style={{ display: "flex", gap: "1rem" }}>
              <div className="user_info">
                <img src={
                  user.profilePicture
                    ? serverPublic + user.profilePicture
                    : serverPublic + "defaultProfile.png"
                } alt={user.fullname} />
              </div>
              <div className="user_details">
                <p className="user_id">{user.username}</p>
                <p className="username">{user.fullname}</p>
              </div>
            </Link>
            <div className="edit_profileBtn">
              <button className="edit_profile" onClick={() => setModalOpened(true)}>Edit Profile</button>
              <ProfileModal
                modalOpened={modalOpened}
                setModalOpened={setModalOpened}
                data={user}
              />
            </div>
          </div>

          <div className="suggestions">
            <div className="suggestions_header">
              <span>Suggestions for You</span>
              <span onClick={() => setFollowersModalOpened(true)} style={{ cursor: "pointer" }}>See All</span>
            </div>
            <FollowersModal
              followersModalOpened={followersModalOpened}
              setFollowersModalOpened={setFollowersModalOpened}
              persons={persons}
            />
          </div>
          {persons.length === 1 && <h4 style={{ margin: "auto" }}>No other User Found</h4>}
          <div className="other_users">
            {persons.map((person, id) => (
              person._id !== user._id && <User person={person} key={id} />
            ))}
          </div>
          <div className="showMore">
          </div>
          <div className="suggestions_footer">
            <ul className="suggestion_footer_list">
              <li><span>About</span></li>
              <li><span>Help</span></li>
              <li><span>Press</span></li>
              <li><span>API</span></li>
              <li><span>Jobs</span></li>
              <li><span>Privacy</span></li>
              <li><span>Terms</span></li>
              <li><span>Locations</span></li>
              <li><span>Language</span></li>
            </ul>
            <div className="footer">
              <span>
                © 2022 INSTAGRAM FROM META
              </span>
            </div>
          </div>
        </div>
      }

    </>
  )
}

export default Suggestions