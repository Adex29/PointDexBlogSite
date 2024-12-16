// Function to fetch the like count and whether the user has liked the post
export const getLikeCount = async (csrfToken, postId, userId) => {

    console.log(csrfToken, postId, userId);
    try {
        const response = await fetch(`/likes?postId=${postId}&userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,  // CSRF token for security
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch like status: ${errorText}`);
        }

        const data = await response.json();
        return {
            likes: data.likes || 0,          // Ensure likes count is a number
            hasLiked: !!data.hasLiked,       // Ensure hasLiked is a boolean
        };
    } catch (error) {
        console.error('Error fetching like status:', error.message || error);
        return { likes: 0, hasLiked: false };  // Provide fallback values
    }
};


// Function to like or unlike a post
export const likePost = async (csrfToken, postId, userId, isLike) => {
    try {
        const response = await fetch(`/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
                userId,
                postId,
                isLike,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to like/unlike the post');
        }

        const data = await response.json();
        return data;  // Return the updated like count or any other data from the server
    } catch (error) {
        console.error('Error liking/unliking post:', error);
    }
};
