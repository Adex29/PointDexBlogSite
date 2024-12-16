import React from 'react';

const UserPostBuilder = ({ post }) => {
    return (
        <>
            <div className="md:flex hover:opacity-90">
                <div className="w-full md:w-64 h-64 flex-shrink-0">
                    <img src={post.img ? `/storage/${post.img}` : 'default-image.jpg'} alt="" className="w-full h-full object-cover" />
                </div>

                <div>
                    <div className="md:px-3">
                        <div className="du-badge du-badge-info du-p-3">{post.category}</div>
                    </div>
                    <div className="md:px-3 md:py-1">
                        <h1 className="text-3xl font-bold">{post.title}</h1>
                    </div>
                    <div className="flex md:px-3">
                        <h1 className="text-sm">{post.author}</h1>
                        <h1 className="text-sm font-bold px-3">.</h1>
                        <h1 className="text-sm">{post.created_at.slice(0, 10)}</h1>
                    </div>
                    <div className="md:px-3 md:py-1">
                        <p className="text-lg">{post.summary}</p>
                    </div>
                    <div className="md:px-3 md:py-5">
                        <a href={`/blog/${post.id}`}>
                            <button className="du-btn mr-5">
                                Read More
                                <i className="fa fa-arrow-right" aria-hidden="true"></i>
                            </button>
                        </a>
                        <button className="du-btn">
                            Share
                            <i className="fa fa-share" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
            <hr className="my-3" />
        </>
    );
};
export default UserPostBuilder;
