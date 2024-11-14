import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAlert } from 'react-alert'
import Modal from '@mui/material/Modal';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { deletePost } from "../../../api/PostsRequests";
import { useSelector } from "react-redux";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const PostHeaderModal = ({ data, postDetails }) => {

    const { user } = useSelector((state) => state.authReducer.authData);
    const alert = useAlert();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDelete = () => {
        deletePost(postDetails, user._id);
        setOpen(false)
        alert.success("Post Deleted Succesfully");
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    // console.log("id: " + data + " " + user._id);

    return (
        <div>
            <Button id="MoreHorizontal" onClick={handleOpen}><MoreHorizIcon /></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Button id="modal-modal-title" variant="outlined" color="error">
                        Report
                    </Button>
                    <Button id="modal-modal-title" variant="outlined" color="error">
                        Unfollow
                    </Button>
                    <Button id="modal-modal-title" variant="h6">
                        Go to Post
                    </Button>
                    <Button id="modal-modal-title" variant="h6">
                        Share To ...
                    </Button>
                    <Button id="modal-modal-title" variant="h6">
                        Copy Link
                    </Button>
                    <Button id="modal-modal-title" variant="h6">
                        Embed
                    </Button>
                    <Button id="modal-modal-title" variant="outlined" color="error" onClick={handleDelete} className={`${data._id === user._id || data.userId === user._id ? 'visible' : 'hidden'}`}>
                        Delete Post
                    </Button>
                    <Button id="modal-modal-title" color="secondary" onClick={handleClose}>
                        Cancel
                    </Button>

                </Box>
            </Modal>
        </div>
    );
}

export default PostHeaderModal
