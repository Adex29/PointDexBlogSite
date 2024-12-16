import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // You can replace this with logic to check if the user is logged in
    const sessionStatus = sessionStorage.getItem('isLoggedIn');
    setIsLoggedIn(sessionStatus === 'true');
  }, []);

  return (
    <div className="du-navbar du-bg-base-300">
      <div className="du-flex-1">
        <a href="HomePage.php" className="du-btn du-btn-ghost du-text-xl">Home</a>
        <a href="AboutUs.php" className="du-btn du-btn-ghost du-text-xl">About</a>
        <a href="Contact.php" className="du-btn du-btn-ghost du-text-xl">Contact</a>
      </div>

      <div className="du-flex-none">
        <div className="du-dropdown du-dropdown-end">
          <div tabIndex="0" role="button" className="du-btn du-btn-ghost du-btn-circle du-avatar">
            <div className="du-w-10 du-rounded-full">
              <img alt="User Avatar" src="../images/noaim.jpg" />
            </div>
          </div>
          <ul tabIndex="0" className="du-menu du-menu-sm du-dropdown-content du-bg-base-100 du-rounded-box z-[1] du-mt-3 du-w-52 du-p-2 du-shadow">
            {isLoggedIn ? (
              <li><a href="../Components/logout.php">Logout</a></li>
            ) : (
              <li><a href="Login.php">Login</a></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
