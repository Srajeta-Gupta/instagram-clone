import React, { useRef } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import '../../Profile/Profile.scss'
import '../../Post/Post.css'


import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import moment from 'moment';

import { Link } from "react-router-dom";

const CommentsOverview = ({ data, person, postComments, commentOverviewModalOpened, setCommentOverviewModalOpened }) => {

    const theme = useMantineTheme();

    // const [comments, setComments] = useState(postComments);

    const commentsRef = useRef();
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    // console.log(data);
    // console.log(postComments);

    return (

        <Modal
            overlayColor={
                theme.colorScheme === "dark"
                    ? theme.colors.dark[9]
                    : theme.colors.gray[2]
            }
            overlayOpacity={0.55}
            overlayBlur={3}
            overflow="inside"
            size="20rem"
            // overflow="inside"
            opened={commentOverviewModalOpened}
            onClose={() => (setCommentOverviewModalOpened(false))}
            style={{ height: "100vh" }}
        >
            <>
                <div className="content_container">



                    {/* Comment */}

                    <div style={{
                        position: "absolute",
                        top: "0",
                        width: "80%",
                        marginTop: "0.5rem",
                        height: "3.5rem",
                        background: "white",
                        zIndex: "4"
                    }}>
                        <Typography id="commentHeading" style={{

                            fontSize: "1rem",
                            fontWeight: "600",
                            marginTop: "1rem",
                        }}>Comments
                        </Typography>
                    </div>

                    <div className="previous_comments" style={{ height: "35rem" }}>
                        {postComments?.length !== 0 ?
                            <>
                                {postComments?.map((c, i) => (
                                    <div className="post_comment_content" key={i} style={{
                                        margin: "2rem 0px"
                                    }}>

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
                            </>
                            : <>
                                <div className="noComment" style={{ marginTop: "1rem" }}>
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

                </div>
            </>
        </Modal >

    );
};

export default CommentsOverview;