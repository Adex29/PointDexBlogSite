import React, { useState, useEffect } from 'react';
import UserNavbar from "@/Components/UserNavbar";
import UserFooter from "@/Components/UserFooter";
import UserPostBuilder from "@/Components/UserPostBuilder";
import fetchUserPosts from '@/functions/getUserPosts';
import Skeleton from '@/Components/skeleton';
import csrfToken from '@/Includes/csfrToken';

const HomePage = () => {


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPosts(csrfToken, null, setPosts, setLoading);
  }, []);


  if (loading) {
    return <Skeleton />
  }

  console.log("Posts:", posts);

  return (
    <div>
      <UserNavbar />

      <div className="wrapper">
        <div className="md:flex md:items-start">
          <div className="md:w-4/5">
            <div id="postsContainer">
              {posts.map((post) => (
                <UserPostBuilder post={post}/>
              ))}
            </div>
          </div>

          <div className="bg-gray-200 mt-3 md:w-1/5 md:ml-3 md:mt-0">
            <h1 className="text-3xl font-bold ml-3">Recent Posts</h1>
            <div>
              <div className="md:px-3 md:py-1">
                <div className="flex">
                  <input id="searchPost" className="du-input" type="text" placeholder="Search posts..." />
                  <button id="searchPostBtn" className="du-btn">Search</button>
                </div>
                <div id="recentPosts">
                  {/* Recent posts will be appended here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Comments Modal */}
      <dialog id="CommentsModal" className='du-modal'>
        <div className="du-modal-box">
          <form method="dialog">
            <button
              className="du-btn du-btn-sm du-btn-circle du-btn-ghost absolute right-2 top-2"

            >
              ✕
            </button>
          </form>
          <h3 className="text-lg font-bold mb-3">Comments</h3>
          <div className="flex flex-col w-3/4" id="commentsContainer">
            {/* {comments.map((comment, index) => (
              <div key={index} className="outline outline-1 outline-gray-300 inline-block rounded-full px-5 py-3 my-2">
                <p className="block"><strong>{comment.author}</strong></p>
                <p className="block">{comment.content}</p>
              </div>
            ))} */}
          </div>
          <div className="w-full mt-5">
            <hr className="mb-3" />
            <form id="commentForm">
              <div className="flex">
                <input
                  className="du-input du-input-bordered w-full"
                  type="text"
                  placeholder="Write a comment"
                  name="commentOnPost"
                  id="commentOnPost"
                />
                <button type="submit" className="du-btn pl-5">Post</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <UserFooter />
    </div>
  );
};

export default HomePage;
