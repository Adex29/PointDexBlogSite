import React, { useState } from "react";
import csrfToken from "@/Includes/csfrToken";

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming the user is logged in initially

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
      });

      if (response.ok) {
        setIsLoggedIn(false);
        window.location.href = '/home'; // Redirect to home after logout
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="nav-background">
      <div className="d-flex flex-column align-items-center nav-container">
        <div className="d-flex justify-content-center p-3 m-auto">
          <div className="m-auto text-white bg-tertiary p-0">
            <p className="text-center m-auto nav-title">PointDex</p>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center">
          <div className="nav-item p-3 nav-hover">
            <a href="/manageUser" className="d-flex align-items-center">
              <i className="fas fa-users p-2 text-white nav-icon"></i>
              <span className="text-white nav-text">Users</span>
            </a>
          </div>
          <div className="nav-item p-3 nav-hover">
            <a href="/managePost" className="d-flex align-items-center">
              <i className="fas fa-file-alt p-2 text-white nav-icon"></i>
              <span className="text-white nav-text">Posts</span>
            </a>
          </div>
          {/* <div className="nav-item p-3 nav-hover">
            <a href="../Admin/Comments.php" className="d-flex align-items-center">
              <i className="fas fa-comment-alt p-2 text-white nav-icon"></i>
              <span className="text-white nav-text">Comments</span>
            </a>
          </div> */}
          <div id="adminLogout" className="nav-item p-3 nav-hover">
            {isLoggedIn && (
              <a
                onClick={handleLogout}
                className="d-flex align-items-center cursor-pointer"
              >
                <i className="fas fa-sign-out-alt p-2 text-white nav-icon"></i>
                <span className="text-white nav-text">Logout</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
