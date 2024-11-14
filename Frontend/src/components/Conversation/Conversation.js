import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../api/UserRequests";
import '../Suggestions/Suggestions.css'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const Conversation = ({ data, currentUser, online, everyChat }) => {

    const [userData, setUserData] = useState(null)
    const dispatch = useDispatch()
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
    let { loading } = useSelector((state) => state.postReducer);

    useEffect(() => {

        const userId = data.members.find((id) => id !== currentUser)
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId)
                setUserData(data)
                dispatch({ type: "SAVE_USER", data: data })
            }
            catch (error) {
                console.log(error)
            }
        }

        getUserData();

        // eslint-disable-next-line
    }, [])

    // console.log(userData);

    return (
        <>
            {loading ? everyChat.map((chat) =>

                <div key={chat._id} id="post_loader">
                    <Stack spacing={2} >
                        <Stack direction="row" spacing={2}>
                            <Skeleton variant="circular" width={60} height={60} />
                            <Stack>
                                <Skeleton id="username__Loader" variant="text" width={100} height={20} />
                                <Skeleton id="timestamp__Loader" variant="text" width={50} height={12.5} />
                            </Stack>
                        </Stack>
                    </Stack>
                </div>

            )
                :

                <>
                    <div className="follower conversation">

                        <div className="suggested_users">
                            {online && <div className="online-dot"></div>}
                            {/* {<div className="online-dot"></div>} */}
                            <img className="suggested_users_image" src={
                                userData?.profilePicture
                                    ? serverPublic + userData.profilePicture
                                    : serverPublic + "defaultProfile.png"
                            } alt={userData?.fullname} />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span className="user_id">{userData?.fullname} <br /> {userData?.username} </span>
                                <span style={{ color: online ? "#51e200" : "", fontSize: "small" }}>{online ? "Online" : "Offline"}</span>
                                {/* <span>Online</span> */}
                            </div>
                        </div>

                    </div>
                    <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
                </>

            }

        </>
    );
};

export default Conversation;
