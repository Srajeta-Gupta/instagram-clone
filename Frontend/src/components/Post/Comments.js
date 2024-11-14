import React from 'react'
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import moment from 'moment';

export const Comments = ({ comments, postOwner, serverPublic, commentsRef }) => {

    // console.log(commentsRef)

    return (
        <>
            <div className="posted_comments" id="comments__" >

                {comments?.map((c, i) => (
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
    )
}
