import React, { useState, useRef, useEffect } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import '../Profile.scss'
import '../../Post/Post.css'
import Gallery from "../../Gallery/Gallery";

import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import PostHeaderModal from '../../Post/Modals/PostHeaderModal';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { useSelector, useDispatch } from "react-redux";

import { commentPost } from "../../../actions/PostsAction"
import { Comments } from '../../Post/Comments'
import moment from 'moment';

import InputEmoji from 'react-input-emoji'
import CommentsOverview from "../../Post/Modals/CommentsOverview";
import { likePost } from "../../../api/PostsRequests";

const GalleryModal = ({ data, person, postId, postComments, postLikes, postLikedBy, galleryModalOpened, setGalleryModalOpened }) => {

    const theme = useMantineTheme();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.authReducer.authData);
    const [commentOverviewModalOpened, setCommentOverviewModalOpened] = useState(false);

    // eslint-disable-next-line
    let [comments, setComments] = useState(data.comments);

    const [comment, setComment] = useState("");
    const [liked, setLiked] = useState(postLikes.includes(user._id) ? true : false)
    const [likes, setLikes] = useState(postLikedBy?.length)

    const commentsRef = useRef();
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    const [saved, setSaved] = useState(false)

    useEffect(() => {
        postLikes.includes(user._id) ? setLiked(true) : setLiked(false)
        setLikes(postLikedBy?.length)
    }, [data, postLikes, postLikedBy, user._id])

    const handleLike = async () => {
        const finalLike = `${user?.profilePicture}: ${user?.username}`
        await likePost(data._id, user._id, finalLike);
        setLiked((prev) => !prev);
        liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1)
    };

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

    const handleSaved = () => {
        setSaved((state) => !state)
    }

    useEffect(() => {
        setTimeout(() => document.getElementById("comments__")?.scrollBy({ top: 100000, left: 0, behavior: "smooth" }), 300)
    }, [galleryModalOpened])

    // console.log(postComments);
    // console.log(postLikedBy);

    return (

        <Modal
            overlayColor={
                theme.colorScheme === "dark"
                    ? theme.colors.dark[9]
                    : theme.colors.gray[2]
            }
            overlayOpacity={0.55}
            overlayBlur={3}
            overflow="outside"
            size="65rem"
            // overflow="inside"
            opened={galleryModalOpened}
            onClose={() => (setGalleryModalOpened(false))}
            // eslint-disable-next-line
            // onClose={() => window.location.reload()}
            style={{ height: "100vh" }}
        >
            <>
                <div className="content_container">
                    <div className="left_section">
                        <Gallery image={[data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : null]} />
                    </div>
                    <div className="right_section">
                        {/* Post Header */}
                        <div className="header galleryHeader">
                            <div className="postHeader" style={{ paddingLeft: "0rem" }}>
                                <Avatar className="user_image"
                                    src={
                                        person.profilePicture
                                            ? serverPublic + person.profilePicture
                                            : serverPublic + "defaultProfile.png"} alt="Profile" />
                                <div className="align">
                                    <p className="person_name">{person.username}</p>
                                    <span>{moment(data.createdAt).fromNow()}</span>
                                </div>
                            </div>

                            <div className="headerModal">
                                <PostHeaderModal data={data} postDetails={data._id} />
                            </div>
                        </div>
                        <div className="previous_comments">
                            <Typography id="commentHeading" style={{ fontSize: "1rem", fontWeight: "600", marginTop: "1rem", marginBottom: "1rem", position: "sticky" }}>Comments</Typography>
                            {postComments?.length > 0 ?
                                <Comments postOwner={person} comments={data.comments} serverPublic={serverPublic} commentsRef={commentsRef} />
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
                        {/* Other Post Content */}
                        <div className="other_post_content" style={{ bottom: "-2rem" }}>
                            <div>
                                <div className="post_content">
                                    <div className="post_content_start">

                                        {!liked ?
                                            <FavoriteBorderIcon onClick={handleLike} style={{ cursor: "pointer" }} />
                                            : <FavoriteIcon onClick={handleLike} style={{ cursor: "pointer" }} />
                                        }

                                        <ModeCommentOutlinedIcon style={{ cursor: "pointer" }} onClick={() => setCommentOverviewModalOpened(true)} />

                                        <CommentsOverview
                                            commentOverviewModalOpened={commentOverviewModalOpened}
                                            setCommentOverviewModalOpened={setCommentOverviewModalOpened}
                                            data={data}
                                            person={person}
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
                                <div className="likes">
                                    Liked By {likes <= 1 ? `${likes} User` : `${likes} Users`}
                                </div>

                                <div className="post_description">
                                    <p className="post_desc"> <span style={{ fontSize: "1rem", fontWeight: "600" }}>{person.username}</span> {data.desc}</p>
                                </div>
                            </div>


                            {/* Comment */}
                            <div>
                                <div className="post_comment">
                                    {/* <input type="text" className="add_comment" placeholder="Add a comment" /> */}
                                    <InputEmoji
                                        value={comment}
                                        onChange={setComment}
                                        cleanOnEnter
                                        onEnter={handleSubmit}
                                        placeholder="Add a Comment"
                                        name="Comment"
                                    />
                                    <AddCommentOutlinedIcon className="commentBtn" onClick={handleSubmit} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </Modal >

    );
};

export default GalleryModal;