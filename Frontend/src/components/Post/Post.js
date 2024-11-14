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
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useAlert } from 'react-alert'

import InputEmoji from 'react-input-emoji'
import moment from 'moment';

import { useSelector, useDispatch } from "react-redux";
import { likePost, savePost } from "../../api/PostsRequests";
import { commentPost } from "../../actions/PostsAction"
import { getAllUser } from "../../api/UserRequests";

import "./Post.css"
import { Link } from 'react-router-dom';
import { Comments } from './Comments';
import PostOverview from './Modals/PostOverview';
import CommentsOverview from './Modals/CommentsOverview';
import SearchModal from '../Navbar/Modals/SearchModal';


const Post = ({ data, postComments, postLikes, postTags, postSavedBy }) => {

    const { user } = useSelector((state) => state.authReducer.authData)
    const [liked, setLiked] = useState(postLikes.includes(user._id) ? true : false)
    const [saved, setSaved] = useState(postSavedBy.includes(user._id) ? true : false)
    const [likes, setLikes] = useState(data.likes.length)

    const [comments, setComments] = useState(postComments);
    const [comment, setComment] = useState("");
    const [person, setPerson] = useState([]);

    const [galleryModalOpened, setGalleryModalOpened] = useState(false);
    const [searchModalOpened, setSearchModalOpened] = useState(false);
    const [commentOverviewModalOpened, setCommentOverviewModalOpened] = useState(false);

    const [loading, setLoading] = useState(false)

    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    const dispatch = useDispatch();
    const alert = useAlert();
    const commentsRef = useRef();

    let postOwner = []
    let LikedBy = []
    let LikedByUserAvatar = []

    for (let i = 0; i < likes; i++) {
        LikedBy.push(data.likedBy[i])
    }

    LikedBy.map((avatar) => LikedByUserAvatar.push(avatar?.split(': ')[0] ? avatar.split(': ')[0] : avatar?.split(': ')[1]))

    const handleLike = async () => {
        const finalLike = `${user?.profilePicture}: ${user?.username}`
        await likePost(data._id, user._id, finalLike);
        setLiked((prev) => !prev);
        liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1)

        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            // window.location.reload(false);
        }, 1000);
    };

    const handleDoubleClick = (e) => {
        if (e.detail === 2) {
            handleLike()
        }

        if (e.detail === 1) {
            setTimeout(() => {
                setGalleryModalOpened(true)
            }, 1000);
        }
    }

    const handleSaved = async () => {
        await savePost(data._id, user._id);
        setSaved((prev) => !prev);
        alert.info(`${!saved ? "Post Saved" : "Post removed from Saved"}`)
    }

    const handleSubmit = async () => {

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        const finalComment = `${user?.profilePicture}: ${user?.username}: ${dateTime}: ${comment}: ${user._id}`
        const newComments = await dispatch(commentPost(finalComment, data._id));
        postComments = newComments
        setComments(postComments)
        data.comments = postComments
        setComment('')

        setTimeout(() => document.getElementById("comments__").scrollBy({ top: 100000, left: 0, behavior: "smooth" }), 300)

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

    // Always scroll to last Message
    // useEffect(() => {
    //     commentsRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [comments])

    // console.log(comments);
    // console.log(LikedByUserAvatar);

    return (
        <>
            <div className="post_container">
                {/* Post Header */}
                <div className="header">
                    <div className="postHeader">
                        <Link to={`/profile/${data.userId}`} style={{ display: "flex" }}>
                            <img className="user_image" src={
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

                {/* Other Post Content */}
                <div>
                    <div className="post_content">
                        <div className="post_content_start">
                            {!liked ?
                                <FavoriteBorderIcon onClick={handleLike} style={{ cursor: "pointer" }} />
                                : <FavoriteIcon onClick={handleLike} style={{ cursor: "pointer" }} />
                            }
                            <ModeCommentOutlinedIcon style={{ cursor: "pointer" }}
                                onClick={() => setCommentOverviewModalOpened(true)} />

                            <CommentsOverview
                                commentOverviewModalOpened={commentOverviewModalOpened}
                                setCommentOverviewModalOpened={setCommentOverviewModalOpened}
                                data={data}
                                person={postOwner}
                                postComments={postComments}
                            />


                            <ShareOutlinedIcon style={{ cursor: "pointer" }} />
                        </div>
                        <div className="post_content_end">
                            {!saved ?
                                <BookmarkAddOutlinedIcon style={{ cursor: "pointer" }} onClick={handleSaved} />
                                : <BookmarkAddIcon onClick={handleSaved} style={{ cursor: "pointer" }} />
                            }
                        </div>
                    </div>
                </div>

                {/* Likes & Posted Comments */}

                <div className="likes_comments">
                    <span >
                        Liked By {LikedBy.length <= 1 ? `${LikedBy.length} User`
                            : `${LikedBy.length} Users`}
                    </span>

                    {loading ?
                        <Stack direction="row" spacing={2}>
                            <Skeleton variant="circular" width={60} height={60} />
                            <Stack>
                                <Skeleton id="username__Loader" variant="text" width={100} height={20} />
                                <Skeleton id="timestamp__Loader" variant="text" width={50} height={12.5} />
                            </Stack>
                        </Stack> :

                        <div id="likedByAvatar" className="likedByAvatar" >
                            {LikedByUserAvatar.map((person, id) => (
                                <img className="user_image" key={id} src={
                                    person !== 'undefined' ? serverPublic + (person)
                                        : serverPublic + "defaultProfile.png"
                                } />
                            ))}
                        </div>
                    }

                    <div className="post_description">
                        <p className="post_desc"> <span style={{ fontSize: "1rem", fontWeight: "600" }}>{postOwner.username}</span> {data.desc} {postTags.map((tag, id) =>
                            <span
                                key={id}
                                className="postTags"
                                onClick={() => setSearchModalOpened(true)}
                            > {`#${tag}`} </span>)}</p>

                        <SearchModal searchModalOpened={searchModalOpened}
                            setSearchModalOpened={setSearchModalOpened} />
                    </div>
                    <Typography style={{ fontSize: "1rem", fontWeight: "600", marginTop: "1rem", marginBottom: "0.5rem", position: "sticky" }}>Comments</Typography>

                    {postComments.length > 0 ?
                        <Comments postOwner={postOwner} comments={comments} serverPublic={serverPublic} commentsRef={commentsRef} />
                        : <>
                            <div className="noComment">
                                <span>No Comments Found</span>
                                <div className="noComment_img">
                                    <img src="https://t4.ftcdn.net/jpg/03/79/76/09/360_F_379760906_3Pn5AMiEU2gWkLwX4Xoan4TZrScgqQwk.jpg" alt="" style={{
                                        height: "10rem",
                                        width: "14rem"
                                    }} />
                                </div>
                            </div>
                        </>
                    }

                </div>

                {/* Comment */}
                <div>
                    <div className="post_comment">
                        <InputEmoji
                            value={comment}
                            onChange={setComment}
                            cleanOnEnter
                            onEnter={handleSubmit}
                            placeholder="Add a Comment"
                            name="Comment"
                        />
                        <AddCommentOutlinedIcon className="commentBtn" style={{ display: `${comment.length === 0 ? 'none' : 'inline'}` }} onClick={handleSubmit} />
                    </div>
                </div>
            </div>
        </>

    )
}

export default Post