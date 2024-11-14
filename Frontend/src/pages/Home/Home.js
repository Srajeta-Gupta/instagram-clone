import React from 'react'
import Posts from '../../components/Posts/Posts'
import PostShare from '../../components/PostShare/PostShare'
import Stories from '../../components/Stories/Stories'
import Suggestions from '../../components/Suggestions/Suggestions'
import "./Home.css"

const Home = () => {

  return (
    <>
      <div className="home">
        <div className="home_content">
          <div className="left_content">
            <div style={{ marginBottom: "2rem", filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.123))", background: "white" }}>
              <Stories />
              <PostShare />
            </div>
            <Posts />
          </div>
          <div className="followerSuggestions">
            <Suggestions />
          </div>
        </div>
      </div>
      }
    </>
  )
}

export default Home