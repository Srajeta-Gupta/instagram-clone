import React, { useRef } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import '../../../components/Profile/Profile.scss'
import '../../Post/Post.css'
import Gallery from "../../../components/Gallery/Gallery";

import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import PostHeaderModal from '../../Post/Modals/PostHeaderModal';

import moment from 'moment';
import { Link } from "react-router-dom";

const PostOverview = ({ data, person, postId, postComments, postLikes, galleryModalOpened, setGalleryModalOpened }) => {

    const theme = useMantineTheme();

    const commentsRef = useRef();
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    // console.log(likedBy);
    // console.log(data);

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
                            {data.comments?.length > 0 ?
                                <>
                                    <div className="postOverview_comments" id="comments__" >

                                        {postComments?.map((c, i) => (
                                            <div className="post_comment_content" key={i}>
                                                <Link to={`/profile/${c.split(': ')[4]}`} style={{ display: "flex" }}>
                                                    <Avatar className="user_image" src={
                                                        (c.split(': ')[0])
                                                            ? serverPublic + (c.split(': ')[0])
                                                            : serverPublic + "defaultProfile.png"
                                                    } />
                                                </Link>
                                                <div className="comment_content" >

                                                    <div className="user_time">
                                                        <strong style={{ fontSize: "0.9rem" }} >{c.split(': ')[1]}</strong>
                                                        <span ><span style={{ color: "black", fontSize: "0.9rem" }}>{moment(c.split(': ')[2]).fromNow()}</span></span>
                                                    </div>

                                                    <span style={{ fontSize: "1rem", fontWeight: "400", marginLeft: "0.5rem" }} > {c.split(': ')[3]} </span>
                                                </div>
                                                <div ref={commentsRef}></div>
                                            </div>
                                        ))}
                                    </div >
                                </>
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
                        <div className="other_post_content" id="postOverview_otherContent">

                            {/* Likes & Posted Comments */}

                            <div className="likes_comments">
                                <span >
                                    Liked By {postLikes.length} Users
                                </span>

                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    {postLikes.map((person, id) => (
                                        <Avatar className="user_image" key={id} src={
                                            (person?.split(': ')[0])
                                                ? serverPublic + (person?.split(': ')[0])
                                                : serverPublic + "defaultBackground.png"
                                        } />
                                    ))}
                                </div>

                                <div className="post_description">
                                    <p className="post_desc"> <span style={{ fontSize: "1rem", fontWeight: "600" }}>{person.username}</span> {data.desc}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </>
        </Modal >

    );
};

export default PostOverview;