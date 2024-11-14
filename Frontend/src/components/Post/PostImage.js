/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import PostHeaderModal from './Modals/PostHeaderModal';

import InputEmoji from 'react-input-emoji'
import moment from 'moment';

import { useSelector, useDispatch } from "react-redux";
import { likePost } from "../../api/PostsRequests";
import { commentPost } from "../../actions/PostsAction"
import { getAllUser } from "../../api/UserRequests";

import "./Post.css"
import { Link } from 'react-router-dom';

import PostOverview from './Modals/PostOverview';
import CommentsOverview from './Modals/CommentsOverview';


const PostImage = ({ data, postComments }) => {

    const { user } = useSelector((state) => state.authReducer.authData);
    const [liked, setLiked] = useState(data.likes.includes(user._id));
    const [likes, setLikes] = useState(data.likes.length)
    const [saved, setSaved] = useState(false)

    const [comments, setComments] = useState(postComments);
    const [comment, setComment] = useState("");
    const [person, setPerson] = useState([]);

    const [galleryModalOpened, setGalleryModalOpened] = useState(false);
    const [commentOverviewModalOpened, setCommentOverviewModalOpened] = useState(false);

    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    const dispatch = useDispatch();
    const commentsRef = useRef();

    let postOwner = []

    const handleDoubleClick = (e) => {
        if (e.detail === 2) {
            const finalLike = `${user?.profilePicture}: ${user?.username}`
            likePost(data._id, user._id, finalLike);
            setLiked((prev) => !prev);
            liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1)
        }

        if (e.detail === 1) {
            setTimeout(() => {
                setGalleryModalOpened(true)
            }, 1000);
        }
    }

    let LikedBy = []
    for (let i = 0; i < likes; i++) {
        LikedBy.push(data.likedBy[i])

    }

    useEffect(() => {
        const fetchPersons = async () => {
            const { data } = await getAllUser();
            setPerson(data);
        };
        fetchPersons();
    }, []);

    // filtering user that owns post out of all users 
    person.map((person, id) => (
        person._id === data.userId && postOwner.push(person)
    ))

    postOwner.forEach(obj => {
        if (obj._id === data.userId) {
            postOwner = obj;
        }

    });

    // console.log(comments);
    // console.log(data);

    return (
        <>
            <div className="post_container">
                {/* Post Header */}
                <div className="header">
                    <div className="postHeader">
                        <Link to={`/profile/${data.userId}`} style={{ display: "flex" }}>
                            <Avatar className="user_image" src={
                                postOwner.profilePicture
                                    ? serverPublic + postOwner.profilePicture
                                    : serverPublic + "defaultProfile.png"
                            } alt={postOwner.fullname} />
                            <div className="align">
                                <p className="user_name">{postOwner.username}</p>
                                <span style={{ marginLeft: "0.5rem", color: "black" }}>{moment(data.createdAt).fromNow()}</span>
                            </div>
                        </Link>
                    </div>
                    <div className="headerModal">
                        <PostHeaderModal data={postOwner} postDetails={data._id} />
                    </div>
                </div>

                {/* Post Image */}
                <div className="postImage" style={{ cursor: "pointer" }}>
                    <img
                        src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""}
                        alt=""
                        onClick={handleDoubleClick}
                    />
                    <div className="post_description" style={{ padding: "1rem" }}>
                        <p className="post_desc"> <span style={{ fontSize: "1rem", fontWeight: "600" }}>{postOwner.username}</span> {data.desc} {data.tags.map((tag, id) =>
                            <span
                                key={id}
                                className="postTags"
                            > {`#${tag}`} </span>)}</p>
                    </div>
                </div>
                <PostOverview
                    galleryModalOpened={galleryModalOpened}
                    setGalleryModalOpened={setGalleryModalOpened}
                    data={data}
                    person={postOwner}
                    postId={data._id}
                    postComments={postComments}
                    postLikes={LikedBy}
                />
            </div>
        </>

    )
}

export default PostImage