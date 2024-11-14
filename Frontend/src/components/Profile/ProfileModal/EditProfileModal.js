import React, { useState } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import '../Profile.scss'
import { Stack } from "@mui/material";
import ShareModal from "../../PostShare/ShareModal/ShareModal";
import { useSelector } from "react-redux";
// import { useSelector } from "react-redux";

const EditProfileModal = ({ data, editModalOpened, setEditModalOpened }) => {
    const { user } = useSelector((state) => state.authReducer.authData);
    const theme = useMantineTheme();
    const [modalOpened, setModalOpened] = useState(false);
    const handleClose = () => setEditModalOpened(false);
    const removeProfilePhoto = () => {
        user.profilePicture = ""
    }
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
    // const { user } = useSelector((state) => state.authReducer.authData);

    return (

        <Modal
            overlayColor={
                theme.colorScheme === "dark"
                    ? theme.colors.dark[9]
                    : theme.colors.gray[2]
            }
            overlayOpacity={0.55}
            overlayBlur={3}
            size="20rem"
            opened={editModalOpened}
            onClose={() => setEditModalOpened(false)}
        >
            <Box>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <img src={
                        data.profilePicture
                            ? serverPublic + data.profilePicture
                            : serverPublic + "defaultProfile.png"
                    } alt={data.fullname} className="editProfileModalImage" />
                    <span style={{
                        fontSize: "1.2rem",
                        fontWeight: "600"
                    }}>Synced profile photo</span>
                    <span style={{
                        fontSize: "medium",
                        fontWeight: "400", marginBottom: "1rem"
                    }}>Instagram, Facebook</span>
                    <Button id="modal-modal-title" variant="text" color="primary" onClick={() => setModalOpened(true)}>
                        Upload Photo
                    </Button>
                    <ShareModal modalOpened={modalOpened}
                        setModalOpened={setModalOpened} userId={data.userId} />
                    <Button id="modal-modal-title" variant="h6" color="error">
                        Manage Sync Settings
                    </Button>
                    <Button id="modal-modal-title" onClick={removeProfilePhoto} variant="outlined" color="error">
                        Remove Current Photo
                    </Button>
                    <Button id="modal-modal-title" variant="h6" onClick={handleClose}>
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Modal >

    );
};

export default EditProfileModal;