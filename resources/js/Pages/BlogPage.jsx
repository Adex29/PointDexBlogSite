import React, { useState, useEffect } from 'react';
import UserNavbar from '@/Components/UserNavbar';
import UserFooter from '@/Components/UserFooter';
import {fetchUserPosts} from '@/functions/getUserPosts';
import Skeleton from '@/Components/skeleton';
import Comments from '@/Components/comments';
import csrfToken from '@/Includes/csfrToken';
import { post } from 'jquery';

const BlogPage = ({ id, userid }) => {
    const [post, setpost] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserPosts(csrfToken, id, setpost, setLoading);
    }, [id]);

    console.log(userid);

    if (loading) {
        return <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <div className="flex w-52 flex-col gap-4">
                <div className="du-skeleton h-32 w-full"></div>
                <div className="du-skeleton h-4 w-28"></div>
                <div className="du-skeleton h-4 w-full"></div>
                <div className="du-skeleton h-4 w-full"></div>
            </div>
        </div>;
    }

    if (!post.title) {
        return <div>ID: {post}</div>;
    }

    return (
        <div>
            <UserNavbar />

            <div className="text-center my-10">
                <h1 className="md:text-5xl text-3xl font-bold ml-3">{post.title}</h1>

                <img
                    src={post.img ? `/storage/${post.img}` : 'default-image.jpg'}
                    className="w-1/2 block mx-auto mt-10"
                    alt={post.title}
                />

                <p className="md:text-lg mt-5 text-teal-900">{post.category}</p>

                <div className="flex justify-center mt-3">
                    <p className="px-2">
                        <i className="fa fa-user" aria-hidden="true"></i>{post.author}
                    </p>
                    <p className="px-2">
                        <i className="fa fa-calendar" aria-hidden="true"></i>
                        {post.created_at
                            ? new Date(post.created_at).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })
                            : 'Unknown Date'}
                    </p>
                </div>

                <hr className="w-2/3 mx-auto" />

                <div
                    className="prose w-3/4 mx-auto mt-5 text-left"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>
            </div>

            <div>

            </div>

            <div className='w-full mx-auto'>
                <Comments postId={id} userId={userid}/>
            </div>




            <UserFooter />
        </div>
    );
};

export default BlogPage;
