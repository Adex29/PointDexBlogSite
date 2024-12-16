export const AddComment = async (userId, postId, content, csrfToken) => {
    if (!userId || !postId || !content || !csrfToken) {
      console.error('Missing required parameters for AddComment.');
      return;
    }

    try {
      const response = await fetch('/comments', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, post_id: postId, content }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        console.log('Comment added successfully:', data.message);
      } else {
        console.error('Failed to add comment:', data.message);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  export const getComments = async (postId) => {
    try {
      const response = await fetch(`/comments/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      return data.comments || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };
