import React, { useState, useEffect } from 'react'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './Profile.scss'
import gridImage from './images/ProfileGrid.jpg'
import ProfileModal from './ProfileModal/ProfileModal';
import EditProfileModal from './ProfileModal/EditProfileModal';
import GalleryModal from './ProfileModal/GalleryModal';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { getUser } from "../../api/UserRequests";
import { getUsersPost } from "../../api/PostsRequests";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useAlert } from 'react-alert'
import Stories from '../Stories/Stories';

const Profile = () => {

  const { user } = useSelector((state) => state.authReducer.authData);
  let { loading } = useSelector((state) => state.postReducer);

  const [postSelected, setPostSelected] = useState(true)
  const [savedSelected, setSavedSelected] = useState(false)
  const [likedSelected, setLikedSelected] = useState(false)
  const [modalOpened, setModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [galleryModalOpened, setGalleryModalOpened] = useState(false);

  const [person, setPerson] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [likedBy, setLikedBy] = useState([]);
  const [postId, setPostId] = useState([]);
  const [specificPost, setSpecificPost] = useState([]);

  const profileId = useParams()
  const alert = useAlert();
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchPerson = async () => {
      const { data } = await getUser(profileId.id);
      setPerson(data);
    };
    fetchPerson();

    const fetchUserPosts = async () => {
      const { data } = await getUsersPost(profileId.id);
      setPosts(data);
    };
    fetchUserPosts();
    // eslint-disable-next-line
  }, []);

  const finalPosts = []
  for (let i = 0; i < posts.length; i++) {
    if (posts[i] !== null) {
      finalPosts.push(posts[i])
    }
  }

  const handlePostSelect = () => {
    setPostSelected(true)
    setSavedSelected(false)
    setLikedSelected(false)

  }
  const handleSavedSelect = () => {
    setSavedSelected(true)
    setPostSelected(false)
    setLikedSelected(false)
  }
  const handleLikedSelect = () => {
    setLikedSelected(true)
    setPostSelected(false)
    setSavedSelected(false)
  }

  // console.log(finalPosts);

  return (
    <div className="contWrapper">
      <div className="profile_container">
        {loading ?

          <div id="post_loader" style={{ display: 'flex', justifyContent: 'center' }}>
            <Stack direction="row" spacing={10} >
              <Stack spacing={2}>
                <Skeleton variant="circular" style={{ width: '10rem', height: '10rem', margin: "auto" }} />
              </Stack>
              <Stack spacing={1}>
                <Skeleton id="post__Loader" width={100} variant="text" style={{ marginTop: "1rem" }} />
                <Skeleton id="post__Loader" width={200} variant="text" />
                <Skeleton id="post__Loader" width={300} variant="text" />
                <Skeleton id="post__Loader" variant="rectangular" height={125} style={{ marginBottom: "2.5rem" }} />
              </Stack>
            </Stack>
          </div>

          :

          <div className="profile_header">
            <div className="profile_image">
              <img src={
                user?.profilePicture
                  ? serverPublic + person.profilePicture
                  : serverPublic + "defaultProfile.png"} alt="Profile" onClick={() => user._id === person._id ? setEditModalOpened(true) : alert.info("You can only edit your own profile")} />

              <EditProfileModal
                editModalOpened={editModalOpened}
                setEditModalOpened={setEditModalOpened}
                data={person}
              />

            </div>

            <div className="profile_info">
              <div className="about_user">
                <span style={{
                  fontSize: "1.5rem",
                  fontWeight: "400"
                }}>{person.username}</span>
                <button disabled={user._id !== person._id} className="edit_profile" onClick={() => setModalOpened(true)}>Edit Profile</button>
                <ProfileModal
                  modalOpened={modalOpened}
                  setModalOpened={setModalOpened}
                  data={person}
                />
                <span style={{ margin: "auto" }}><SettingsOutlinedIcon /></span>

              </div>

              <div className="follow_info">
                <span><strong>{finalPosts.length}</strong> posts</span>
                <span><strong>{person.following?.length}</strong> following</span>
                <span><strong>{person.followers?.length}</strong> followers</span>
              </div>
              <div className="bio">
                <span><strong>{person.fullname}</strong></span>
                <span>{person.about}</span>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <span><strong>Lives In </strong>{person.livesin}</span>
                <span><strong>Works At </strong>{person.worksAt}</span>
                <span><strong>Country </strong>{person.country}</span>
              </div>
            </div>

          </div>
        }

        <div style={{ marginBottom: '10px' }}>
          <Stories />
        </div>

        <div className="navigation" >
          <div className="posts_nav" onClick={handlePostSelect} style={{ borderTop: `${postSelected ? "1px solid black" : "0px"}` }}>
            <div className="posts_tab"><GridOnOutlinedIcon /> <span style={{
              margin: "auto"
            }}>POSTS</span></div>
          </div>
          <div className="saved_nav" onClick={handleSavedSelect} style={{ borderTop: `${savedSelected ? "1px solid black" : "0px"}` }}>
            <div className="saved_tab"><BookmarkAddedOutlinedIcon /> <span style={{
              margin: "auto"
            }}>SAVED</span></div>
          </div>
          <div className="tagged_nav" onClick={handleLikedSelect} style={{ borderTop: `${likedSelected ? "1px solid black" : "0px"}` }}>
            <div className="tagged_tab"><FavoriteBorderIcon /> <span style={{
              margin: "auto"
            }}>LIKED</span></div>
          </div>
        </div>

        {loading ?
          finalPosts?.map((post) =>
            <div key={post._id} id="post_loader" className="image-gallery">
              <Stack spacing={1} >
                <Skeleton id="post__Loader" variant="text" />
                <Skeleton id="post__Loader" variant="rectangular" style={{ width: "20rem", height: "16.5rem" }} />
              </Stack>
            </div>
          )
          :
          <>
            {
              finalPosts.length !== 0 ?
                <div className="posted_post">
                  <ul className="image-gallery">

                    {
                      postSelected && finalPosts.map((item, id) => {
                        return (
                          <li key={id} >
                            <div className="gallery_image" >
                              <img
                                src={item.image ? process.env.REACT_APP_PUBLIC_FOLDER + item.image : null}
                                alt=""
                                onClick={() => {
                                  setGalleryModalOpened(true)
                                  setPostId(item._id)
                                  setComments(item.comments)
                                  setSpecificPost(item)
                                  setLikes(item.likes)
                                  setLikedBy(item.likedBy)
                                }}
                              />
                            </ div>
                          </li>
                        )
                      })}

                    {likedSelected && finalPosts.map((item, id) => {
                      return (
                        item.likes.includes(user._id) &&
                        <li key={id} >
                          <div className="gallery_image" >
                            <img
                              src={item.image ? process.env.REACT_APP_PUBLIC_FOLDER + item.image : null}
                              alt=""
                              onClick={() => {
                                setGalleryModalOpened(true)
                                setPostId(item._id)
                                setComments(item.comments)
                                setSpecificPost(item)
                                setLikes(item.likes)
                                setLikedBy(item.likedBy)
                              }}
                            />
                          </ div>
                        </li>
                      )
                    })
                    }

                    {savedSelected && finalPosts.map((item, id) => {
                      return (
                        item.savedBy.includes(user._id) &&
                        <li key={id} >
                          <div className="gallery_image" >
                            <img
                              src={item.image ? process.env.REACT_APP_PUBLIC_FOLDER + item.image : null}
                              alt=""
                              onClick={() => {
                                setGalleryModalOpened(true)
                                setPostId(item._id)
                                setComments(item.comments)
                                setSpecificPost(item)
                                setLikes(item.likes)
                                setLikedBy(item.likedBy)
                              }}
                            />
                          </ div>
                        </li>
                      )
                    })
                    }

                    <GalleryModal
                      galleryModalOpened={galleryModalOpened}
                      setGalleryModalOpened={setGalleryModalOpened}
                      data={specificPost}
                      person={person}
                      postId={postId}
                      postComments={comments}
                      postLikes={likes}
                      postLikedBy={likedBy}
                    />
                  </ul>
                </div> :

                <div className="noPosts">
                  <div className="posts_grid">
                    <div className="grid_left">
                      <img src={gridImage} alt="" />
                    </div>
                    <div className="grid_right">
                      <div>
                        <img src={serverPublic + "Camera.png"} alt="" />
                      </div>
                      <span style={{ fontSize: "18px", fontWeight: "600" }}>No Post yet </span>
                      <span>Save your photos or videos.</span>
                    </div>
                  </div>
                </div>
            }
          </>
        }
      </div>
    </div>
  )
}

export default Profile