import React, { useState, useRef, useEffect } from "react";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert'
import { uploadImage, uploadPost } from "../../actions/UploadAction";

const PostShare = () => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const desc = useRef();
  const title = useRef();
  const tags = useRef();
  const { user } = useSelector((state) => state.authReducer.authData);
  let { loading } = useSelector((state) => state.postReducer);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  const history = useNavigate();
  // const profileId = useParams();
  const alert = useAlert();

  useEffect(() => {
    if (image === null) {
      setDisabled(true);
    }
    else {
      setDisabled(false);
    }
  }, [image])

  // handle Image Change
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
  };

  const imageRef = useRef();

  // handle post upload
  const handleUpload = async (e) => {
    e.preventDefault();

    //post data
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
      title: title.current.value,
      tags: tags.current.value.split(',')
    };

    // if there is an image with post
    if (image) {
      const data = new FormData();
      const fileName = Date.now() + image.name;
      data.append("name", fileName);
      data.append("file", image);
      newPost.image = fileName;
      // console.log(newPost);
      try {
        dispatch(uploadImage(data));
      } catch (err) {
        console.log(err);
      }
    }
    resetShare();
    history(`/`)
    dispatch(uploadPost(newPost));
    alert.success("New Post Added Successfully")
  };

  // Reset Post Share
  const resetShare = () => {
    setImage(null);
    desc.current.value = "";
    title.current.value = "";
    tags.current.value = "";
  };

  return (
    <>
      {loading ?
        <div className="PostShare">
          <Box sx={{ width: 300 }}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
          </Box>
        </div>

        :

        <div className="PostShare">
          <img
            src={
              user.profilePicture
                ? serverPublic + user.profilePicture
                : serverPublic + "defaultProfile.png"
            } alt={user.fullname}
          />
          <div>
            <input
              type="text"
              placeholder="Give your post a Title"
              required
              ref={title}
            />
            <input
              type="text"
              placeholder="Give your post Tags (Comma separated without spaces)"
              required
              ref={tags}
            />
            <input
              type="text"
              placeholder="Something about your Post"
              required
              ref={desc}
            />
            <div className="postOptions">
              <div
                className="option"
                style={{ color: "var(--photo)" }}
                onClick={() => imageRef.current.click()}
              >
                <UilScenery />
                Photo
              </div>
              <div className="option" style={{ color: "var(--shedule)" }}>
                <UilSchedule />
                Stories
              </div>
              <div className="option" style={{ color: "var(--video)" }}>
                <UilPlayCircle />
                Video
              </div>
              <div className="option" style={{ color: "var(--location)" }}>
                <UilLocationPoint />
                Location
              </div>
              <button
                // className="button ps-button"
                className={`${!disabled ? "button ps-button" : "disabled_share"}`}
                onClick={handleUpload}
                disabled={!image}
              >
                Share
              </button>

              <div style={{ display: "none" }}>
                <input type="file" ref={imageRef} onChange={onImageChange} />
              </div>
            </div>

            {image && (
              <div className="previewImage">
                <UilTimes onClick={() => setImage(null)} />
                <img src={URL.createObjectURL(image)} alt="preview" />
              </div>
            )}
          </div>
        </div>
      }
    </>
  );
};

export default PostShare;