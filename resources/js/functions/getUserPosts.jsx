const fetchUserPosts = async (csrfToken, postId = null, setPosts, setLoading) => {
    const url = postId ? `/posts/${postId}` : "/posts";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setPosts(responseData.posts);
        setLoading(false);
      } else {
        console.error("Failed to fetch user posts:", response.statusText);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  export default fetchUserPosts;
