import React from "react";

const Navigation = () => {
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
                        <a href="/" className="d-flex align-items-center">
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
                    <div className="nav-item p-3 nav-hover">
                        <a href="../Admin/Comments.php" className="d-flex align-items-center">
                            <i className="fas fa-comment-alt p-2 text-white nav-icon"></i>
                            <span className="text-white nav-text">Comments</span>
                        </a>
                    </div>
                    <div id="adminLogout" className="nav-item p-3 nav-hover">
                        <a href="../Components/logout.php" className="d-flex align-items-center">
                            <i className="fas fa-images p-2 text-white nav-icon"></i>
                            <span className="text-white nav-text">Logout</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
