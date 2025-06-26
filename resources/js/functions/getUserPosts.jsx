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

  const handleSearch = async (searchInput, setRecentPosts, csrfToken) => {
    const searchUrl = searchInput ? `/posts?search=${encodeURIComponent(searchInput)}` : "/posts";

    try {
        const response = await fetch(searchUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });

        if (response.ok) {
            const responseData = await response.json();
            setRecentPosts(responseData.posts);
        } else {
            console.error("Failed to search posts:", response.statusText);
        }
    } catch (error) {
        console.error("Error during search:", error);
    }
};


export { fetchUserPosts, handleSearch };

