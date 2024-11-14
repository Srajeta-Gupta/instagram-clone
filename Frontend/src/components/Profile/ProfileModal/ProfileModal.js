import React, { useState, useRef } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import { UilTimes } from "@iconscout/react-unicons";
import { uploadImage } from "../../../actions/UploadAction";
import { updateUser } from "../../../actions/UserAction";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from 'react-alert'
import ArtTrackOutlinedIcon from '@mui/icons-material/ArtTrackOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import '../Profile.scss'

const ProfileModal = ({ modalOpened, setModalOpened, data }) => {

    const { user } = useSelector((state) => state.authReducer.authData);
    const theme = useMantineTheme();
    const alert = useAlert();
    const { password, ...other } = data;
    const [formData, setFormData] = useState(other);

    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const profileImageRef = useRef()
    const coverImageRef = useRef()

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            event.target.name === "profileImage"
                ? setProfileImage(img)
                : setCoverImage(img);
        }
    };

    // form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        let UserData = formData;
        if (profileImage) {
            const data = new FormData();
            const fileName = Date.now() + profileImage.name;
            data.append("name", fileName);
            data.append("file", profileImage);
            UserData.profilePicture = fileName;
            try {
                dispatch(uploadImage(data));
            } catch (err) {
                console.log(err);
            }
        }
        if (coverImage) {
            const data = new FormData();
            const fileName = Date.now() + coverImage.name;
            data.append("name", fileName);
            data.append("file", coverImage);
            UserData.coverPicture = fileName;
            try {
                dispatch(uploadImage(data));
            } catch (err) {
                console.log(err);
            }
        }
        dispatch(updateUser(data._id, UserData));

        setModalOpened(false)

        profileImage || user.profilePicture ?
            <>
                {alert.success("Profile Updated")}
                {alert.info("Reloading to Save Changes")}
                {setTimeout(() => {
                    window.location.reload();
                }, 2500)}
            </> : alert.info("Fill the form to continue")
    };

    // console.log(formData.password);

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
            size="30rem"
            opened={modalOpened}
            onClose={() => user.profilePicture ? setModalOpened(false) : alert.info("Fill the form to continue")}
        >
            <form className="infoForm" onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: "0px" }}>Your Info</h3>
                <div className="form_input_content">
                    <input
                        autoComplete="off"
                        value={formData.fullname}
                        onChange={handleChange}
                        type="text"
                        placeholder="Full Name"
                        name="fullname"
                        className="infoInput"
                    />
                    <input
                        autoComplete="off"
                        value={formData.password}
                        onChange={handleChange}
                        type="text"
                        placeholder="Password"
                        name="password"
                        className="infoInput"
                    />
                </div>

                <div className="form_input_content">
                    <input
                        value={formData.worksAt}
                        onChange={handleChange}
                        type="text"
                        placeholder="Works at"
                        name="worksAt"
                        className="infoInput"
                    />
                    <input
                        value={formData.emailMobile}
                        onChange={handleChange}
                        type="text"
                        placeholder="Email or Mobile"
                        name="emailMobile"
                        className="infoInput"
                    />
                </div>

                <div className="form_input_content">
                    <input
                        autoComplete="off"
                        value={formData.livesin}
                        onChange={handleChange}
                        type="text"
                        placeholder="Lives in"
                        name="livesin"
                        className="infoInput"
                    />
                    <input
                        autoComplete="off"
                        value={formData.country}
                        onChange={handleChange}
                        type="text"
                        placeholder="Country"
                        name="country"
                        className="infoInput"
                    />
                </div>

                <div className="form_input_content">
                    <input
                        autoComplete="off"
                        value={formData.about}
                        onChange={handleChange}
                        type="text"
                        className="infoInput"
                        placeholder="Biography"
                        name="about"
                    />
                </div>

                <h3 style={{ marginBottom: "0px" }}>Select & Preview Images</h3>

                <div className="input_files_container">
                    <div className="profile_image_container">
                        <span style={{ cursor: "pointer" }} onClick={() => profileImageRef.current.click()}><AddPhotoAlternateOutlinedIcon /> Profile image</span>
                        <input
                            autoComplete="off" ref={profileImageRef} type="file" name="profileImage" className="profileImage" onChange={onImageChange} style={{ display: "none" }} />
                        {profileImage && (
                            <div className="previewImage">
                                <UilTimes onClick={() => setProfileImage(null)} />
                                <img src={URL.createObjectURL(profileImage)} alt="preview" />
                            </div>
                        )}
                    </div>
                    <div className="cover_image_container">
                        <span style={{ cursor: "pointer" }} onClick={() => coverImageRef.current.click()}><ArtTrackOutlinedIcon />  Cover image </span>
                        <input
                            autoComplete="off" ref={coverImageRef} type="file" name="coverImage" className="coverImage" onChange={onImageChange} style={{ display: "none" }} />
                        {coverImage && (
                            <div className="previewImage">
                                <UilTimes onClick={() => setCoverImage(null)} />
                                <img src={URL.createObjectURL(coverImage)} alt="preview" />
                            </div>
                        )}
                    </div>
                </div>

                <button style={{ width: "15rem", padding: "0.7rem" }} className="button ps-button" type="submit">
                    Update
                </button>
            </form >
        </Modal >
    );
};

export default ProfileModal;