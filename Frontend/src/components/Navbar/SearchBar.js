import React from 'react'
import { useState, useRef, useEffect } from 'react';
import './Navbar.css'
import SearchSvg from './SearchSvg';
import UsersOverview from './Modals/UsersOverview'
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { getAllUser } from '../../api/UserRequests';

const SearchBar = () => {

  const [query, setQuery] = useState("Search")
  const [isFocused, setIsFocused] = useState(false)
  const [persons, setPersons] = useState([]);
  const [usersOverviewModalOpened, setUsersOverviewModalOpened] = useState(false);
  const inputRef = useRef()

  useEffect(() => {
    const fetchPersons = async () => {
      const { data } = await getAllUser();
      setPersons(data);
      // console.log(data);
    };
    fetchPersons();
  }, []);

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setUsersOverviewModalOpened(true)
    }
  }

  const handleOnClick = () => {
    setIsFocused(true);
    if (query === "Search") {
      setQuery("")
      inputRef.current.focus();
    } else {
      inputRef.current.select()
    };
  }

  const handleXCircleClick = () => {
    setQuery("Search")
    setIsFocused(false)
    inputRef.current.blur()
  }

  const preventBlur = (e) => {
    e.preventDefault()
  }

  const handleOnBlur = () => {
    if (query === "") { setQuery("Search") };
    setIsFocused(false)
  }

  return (
    <>
      <input type="text" id="search-input"
        className="search-input"
        onChange={handleQueryChange}
        value={query}
        ref={inputRef}
        onBlur={handleOnBlur}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

      <UsersOverview
        usersOverviewModalOpened={usersOverviewModalOpened}
        setUsersOverviewModalOpened={setUsersOverviewModalOpened}
        data={persons}
        query={query.toLowerCase()}
      />

      {isFocused ?

        <>
          <CloseSharpIcon onMouseDown={preventBlur} onClick={handleXCircleClick} className="rightSearchIcon" />
        </> : <> <div id="icon-wrapper" className="icon-wrapper" onClick={handleOnClick}>
          <div className="icon-wrapper_inner">
            <div className="searchIcon"><SearchSvg /></div>

            <span className="searchQuery">{query}</span>
          </div>
        </div> </>

      }
    </>
  )
}

export default SearchBar