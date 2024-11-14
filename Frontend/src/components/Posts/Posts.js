/* eslint-disable */

import React, { useEffect } from "react";
import { getTimelinePosts } from "../../actions/PostsAction";
import Post from "../Post/Post";
import { useSelector, useDispatch } from "react-redux";
import "./Posts.css";
import { useParams } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useAlert } from 'react-alert'
import gridImage from '../../components/Profile/images/ProfileGrid.jpg'
import '../../components/Profile/Profile.scss'

const Posts = () => {
  const params = useParams()
  const dispatch = useDispatch();
  const alert = useAlert();
  const { user } = useSelector((state) => state.authReducer.authData);
  let { posts, loading, error } = useSelector((state) => state.postReducer);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  if (error) {
    alert.error("Unauthorized Access")
    alert.info("Please Login Again")
    alert.info("Returning to Authentication Page")
    posts = []
    localStorage.clear()
    setTimeout(() => {
      window.location.reload()
    }, 4000);
  }

  useEffect(() => {
    if (error) {
      alert.error("Unauthorized Access")
      alert.info("Please Login Again")
      alert.info("Returning to Authentication Page")
      localStorage.clear()
      setTimeout(() => {
        window.location.reload()
      }, 5000);
    }
    else {
      dispatch(getTimelinePosts(user._id));
    }
  }, []);

  if (posts.length === 0) {
    return (<div className="noPosts">
      <div className="posts_grid">
        <div className="grid_left">
          <img src={gridImage} alt="" />
        </div>
        <div className="grid_right">
          <div>
            <img src={serverPublic + "Camera.png"} alt="" />
          </div>
          <span style={{ fontSize: "18px", fontWeight: "600" }}>No Posts yet </span>
          <span>Share your first photo or video.</span>
        </div>
      </div>
    </div>)
  }
  if (params.id) posts = posts.filter((post) => post.userId === params.id)

  return (
    <>
      <div className="Posts">
        {loading ? posts?.map((post) =>
          <div key={post._id} id="post_loader">
            <Stack spacing={1} >
              <Stack direction="row" spacing={2}>
                <Skeleton variant="circular" width={60} height={60} />
                <Stack>
                  <Skeleton id="username__Loader" variant="text" width={100} height={20} />
                  <Skeleton id="timestamp__Loader" variant="text" width={50} height={12.5} />
                </Stack>
              </Stack>
              <Skeleton id="post__Loader" variant="text" />
              <Skeleton id="post__Loader" variant="rectangular" height={200} />
            </Stack>
          </div>
        )
          : posts?.map((post) => {
            return post ? <Post data={post} postId={post._id} postComments={post.comments} postLikes={post.likes} postSavedBy={post.savedBy} postTags={post.tags} key={post._id} /> : <h6 style={{ color: "black" }} key={post._id}>No Posts Found Yet</h6>
          })}
      </div>
    </>
  );
};

export default Posts;