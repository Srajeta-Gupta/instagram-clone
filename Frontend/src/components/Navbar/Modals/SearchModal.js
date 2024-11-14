import React, { useState } from 'react'
import { Modal, useMantineTheme } from "@mantine/core";
import { TextField, Button } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input'
import { useAlert } from 'react-alert'
import { getPostsBySearch } from '../../../api/PostsRequests';
// import Post from '../../Post/Post';
import PostImage from '../../Post/PostImage';
import '../Navbar.css'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const SearchModal = ({ searchModalOpened, setSearchModalOpened }) => {

  const query = useQuery();
  const alert = useAlert();
  const theme = useMantineTheme();
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [post, setPost] = useState([]);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  // eslint-disable-next-line
  const searchQuery = query.get('searchQuery');

  const handleAdd = (tag) => {
    setTags([...tags, tag])
  }
  const handleDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete))
  }

  const fetchPosts = async () => {
    try {
      const { data } = await getPostsBySearch({ search, tags: tags.join(',' || ', ') });
      // console.log(data);
      setPost(data);
      if (!data.length > 0) {
        alert.info("No post matches required criteria")
      }
    } catch (error) {
      alert.info("No post matches required criteria")
    }
  };

  const searchPost = () => {

    if (search.trim() || tags) {

      fetchPosts();
    }
  }


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchPost()
    }
  }

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
      opened={searchModalOpened}
      onClose={() => setSearchModalOpened(false)}
    >
      <>
        <div className="searchModal_container">

          <div className="searchFields">
            <div className="searchField_input">
              <TextField
                name="search"
                className="search_textfield"
                variant="outlined"
                label="Search memories"
                fullWidth value={search}
                onChange={(e) => { setSearch(e.target.value) }}
                onKeyDown={handleKeyDown}
              />

              <ChipInput
                style={{ margin: "10px 0", width: "20rem" }}
                className="search_tags"
                value={tags}
                onAdd={handleAdd}
                onDelete={handleDelete}
                label="Search Tags"
                variant="outlined"
              />
            </div>
            <Button onClick={searchPost} id="search_button" color="primary" variant="contained">Search</Button>

            {!post.length > 0 && <><img className="search_noPosts" src={serverPublic + "Camera.png"} alt="" />
              <h2 style={{ margin: "auto", marginTop: "-1rem" }}>No Posts Found</h2></>}
          </div>

          <div className="searchModal_posts">
            {post?.map((post) => {
              return post && <PostImage data={post} postComments={post.comments} key={post._id} />
            })}
          </div>

        </div>
      </>
    </Modal>
  )
}


export default SearchModal