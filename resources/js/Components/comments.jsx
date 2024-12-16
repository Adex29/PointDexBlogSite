import React, { useState, useEffect } from 'react';
import CommentBuilder from './CommentBuilder';
import csrfToken from '@/Includes/csfrToken';
import { AddComment, getComments } from '@/functions/comments';
import { likePost, getLikeCount } from '@/functions/getLikes';

const Comments = ({ postId, userId }) => {
    const [comment, setComment] = useState({ content: '' });
    const [userComments, setUserComments] = useState([]);
    const [likeCount, setLikeCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

    // Fetch comments and like status on component mount or when postId changes
    useEffect(() => {
        fetchComments();
        fetchLikeStatus();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const comments = await getComments(postId);
            setUserComments(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const fetchLikeStatus = async () => {
        try {
            const { likes, hasLiked } = await getLikeCount(csrfToken ,postId, userId);
            setLikeCount(likes);
            setHasLiked(hasLiked);
        } catch (error) {
            console.error('Error fetching like status:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (comment.content.trim()) {
            try {
                await AddComment(userId, postId, comment.content, csrfToken);
                setComment({ content: '' });
                fetchComments();
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    const handleLikePost = async () => {
        try {
            if (hasLiked) {
                await likePost(csrfToken ,postId, userId, false);
                setLikeCount(likeCount - 1);
            } else {
                await likePost(csrfToken ,postId, userId, true);
                setLikeCount(likeCount + 1);
            }
            setHasLiked(!hasLiked);
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };

    return (
        <div>
            <div className="du-collapse bg-base-200 mb-4">
                <input type="checkbox" id="collapse-comment" />
                <label className="du-collapse-title text-xl font-medium" htmlFor="collapse-comment">
                    {userComments.length} Comments || {likeCount} Likes
                    {/* {userComments.length} Comments || 29 Likes */}
                </label>

                <div className="du-collapse-content">
                    <form onSubmit={handleCommentSubmit}>

                        <textarea
                            className="du-textarea du-textarea-bordered w-11/12 mx-auto"
                            value={comment.content}
                            onChange={(e) => setComment({ content: e.target.value })}
                            placeholder="Add a comment"
                        />
                        <div className='text-center flex justify-center'>
                            <div className="mx-2">
                                <button className="du-btn du-btn-primary my-3">Add Comment</button>
                            </div>
                            <div className="mx-2">
                                <button
                                    type="button"
                                    onClick={handleLikePost}
                                    className={`du-btn ${hasLiked ? 'du-btn-danger' : 'du-btn-primary'} my-3`}
                                >
                                    {hasLiked ? 'Unlike Post' : 'Like Post'}
                                </button>
                            </div>
                        </div>

                    </form>

                    {
                        userComments.length > 0 ? (
                            userComments.map((userComment) => (
                                <CommentBuilder
                                    key={userComment.id}
                                    author={userComment.author}
                                    createdAt={userComment.created_at}
                                    comment={userComment.comment}
                                />
                            ))
                        ) : (
                            <p className="text-center">No comments yet. Be the first to comment!</p>
                        )
                    }

                </div>
            </div>
        </div>
    );
};

export default Comments;
