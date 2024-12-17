import React, { useState, useEffect } from 'react';
import UserNavbar from "@/Components/UserNavbar";
import UserFooter from "@/Components/UserFooter";
import UserPostBuilder from "@/Components/UserPostBuilder";
import { fetchUserPosts, handleSearch } from '@/functions/getUserPosts';
import Skeleton from '@/Components/skeleton';
import csrfToken from '@/Includes/csfrToken';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [recentPosts, setRecentPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserPosts(csrfToken, null, setPosts, setLoading);
    }, []);

    const searchPosts = async (e) => {
        const searchInput = e.target.value;
        setLoading(true);

        try {
            if (searchInput.trim() === "") {
                setRecentPosts([]);
                // setLoading(false);
                return;
            }

            await handleSearch(searchInput, setRecentPosts, setLoading, csrfToken);
        } catch (error) {
            console.error("Error during search:", error);
            // setLoading(false);
        }
    };

    if (loading) {
        return <Skeleton />;
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
                                <UserPostBuilder key={post.id} post={post} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-200 mt-3 md:w-1/5 md:ml-3 md:mt-0 p-4 rounded-md">
                        <h1 className="text-2xl font-bold mb-4">Recent Posts</h1>
                        <div>
                            <div className="flex mb-4">
                                <input
                                    id="searchPost"
                                    className="du-input w-full"
                                    type="text"
                                    placeholder="Search posts..."
                                    onKeyUp={searchPosts} // Trigger search on keyup
                                />
                            </div>
                            <div id="recentPosts" className="mt-3">
                                <ul className="du-menu du-menu-md bg-base-200 rounded-box w-56">
                                    {recentPosts.length > 0 ? (
                                        recentPosts.map((post) => (
                                            <li key={post.id}>
                                                <a href={`#post-${post.id}`}>{post.title}</a>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No recent posts found</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UserFooter />
        </div>
    );
};

export default HomePage;
