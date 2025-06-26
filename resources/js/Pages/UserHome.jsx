import React, { useState, useEffect, useRef } from 'react';
import UserNavbar from "@/Components/UserNavbar";
import UserFooter from "@/Components/UserFooter";
import UserPostBuilder from "@/Components/UserPostBuilder";
import { fetchUserPosts, handleSearch } from '@/functions/getUserPosts';
import Skeleton from '@/Components/skeleton';
import csrfToken from '@/Includes/csfrToken';

const HomePage = () => {
    // State for all posts
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- NEW: State for a better search experience ---
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimeout = useRef(null); // Used to store the timer for debouncing

    // Effect to fetch initial posts when the component mounts
    useEffect(() => {
        const getInitialPosts = async () => {
            setLoading(true);
            await fetchUserPosts(csrfToken, null, setPosts, setLoading);
        };
        getInitialPosts();
    }, []);

    // --- NEW: Debounced search logic ---
    // This effect runs whenever the `searchQuery` changes
    useEffect(() => {
        // 1. Clear the previous timer if the user is still typing
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // 2. If the search box is empty, clear results and do nothing
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        // 3. Show a "searching" indicator
        setIsSearching(true);

        // 4. Set a new timer. The search will only run after 300ms of inactivity.
        debounceTimeout.current = setTimeout(async () => {
            try {
                // We use the `searchResults` state now instead of `recentPosts`
                await handleSearch(searchQuery, setSearchResults, csrfToken);
            } catch (error) {
                console.error("Error during search:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        // Cleanup function to clear the timer if the component unmounts
        return () => clearTimeout(debounceTimeout.current);

    }, [searchQuery]); // Dependency array: this code only runs when `searchQuery` changes

    if (loading) {
        return <Skeleton />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-base-100">
            <UserNavbar />

            {/* Main content area with better padding and centered layout */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* A responsive grid for the main content and sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-8">

                    {/* Main Content: Post List (takes up 2/3 of the width on large screens) */}
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl mb-6">
                            Latest Posts
                        </h1>
                        <div className="space-y-8">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <UserPostBuilder key={post.id} post={post} />
                                ))
                            ) : (
                                // A helpful message if there are no posts
                                <div className="text-center py-12 bg-base-200 rounded-lg">
                                    <h3 className="text-xl font-semibold">No Posts Found</h3>
                                    <p className="text-base-content/70 mt-2">Check back later for new content!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Search (takes up 1/3 of the width on large screens) */}
                    <aside className="mt-8 lg:mt-0">
                        {/* This makes the sidebar "stick" to the top when scrolling on large screens */}
                        <div className="lg:sticky lg:top-8">
                            <div className="card bg-base-200 shadow-sm">
                                <div className="card-body">
                                    <h2 className="card-title">Search Posts</h2>
                                    <div className="form-control">
                                        {/* The input is now controlled by React state */}
                                        <input
                                            type="text"
                                            placeholder="Type to search..."
                                            className="input input-bordered w-full"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    {/* Improved Search Results Display */}
                                    <div className="mt-4">
                                        <ul className="menu bg-base-100 rounded-box w-full">
                                            {isSearching && (
                                                <li><span>Searching...</span></li>
                                            )}

                                            {!isSearching && searchQuery && searchResults.length > 0 && (
                                                searchResults.map((post) => (
                                                    <li key={post.id}>
                                                        {/* Using a standard <a> tag as requested */}
                                                        <a href={`/blog/${post.id}`}>{post.title}</a>
                                                    </li>
                                                ))
                                            )}

                                            {!isSearching && searchQuery && searchResults.length === 0 && (
                                                <li><span>No results found</span></li>
                                            )}

                                            {!isSearching && !searchQuery && (
                                                <li><span>Start typing to find a post.</span></li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <UserFooter />
        </div>
    );
};

export default HomePage;
