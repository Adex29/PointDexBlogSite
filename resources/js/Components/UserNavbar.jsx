import React, { useState, useEffect } from 'react';
import csrfToken from '@/Includes/csfrToken';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // --- This logic remains exactly the same ---
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/getAuthenticatedUser', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(!!data.user);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkAuthStatus();
  }, []);

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
        setUser(null);
        window.location.href = '/home';
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  // --- End of logic section ---


  // To avoid repeating code, we define the navigation links once
  const navLinks = (
    <>
      <li><a href="/home">Home</a></li>
      <li><a href="/contact">Contact</a></li>
    </>
  );

  // --- NEW: The responsive JSX structure ---
  return (
    // Use a standard background color and add a shadow for depth
    <div className="du-navbar bg-base-100 shadow-sm">

      {/* START: Contains brand logo and mobile hamburger menu */}
      <div className="du-navbar-start">
        {/* Mobile menu dropdown */}
        <div className="du-dropdown">
          <div tabIndex={0} role="button" className="du-btn du-btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="du-menu du-menu-sm du-dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {/* Renders the Home, About, Contact links */}
            {navLinks}
          </ul>
        </div>
        {/* Brand/Logo, always visible */}
        <a href="/home" className="du-btn du-btn-ghost text-xl">
          PointDex
        </a>
      </div>

      {/* CENTER: Contains desktop menu links. Hidden on mobile. */}
      <div className="du-navbar-center hidden lg:flex">
        <ul className="du-menu du-menu-horizontal px-1 gap-3">
          {/* Renders the Home,  Contact links */}
          {navLinks}
        </ul>
      </div>

      {/* END: Contains the user avatar and dropdown. Always visible. */}
      <div className="du-navbar-end">
        <div className="du-dropdown du-dropdown-end">
          <div tabIndex={0} role="button" className="du-btn du-btn-ghost du-btn-circle du-avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src={
                  user?.avatar ||
                  'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png'
                }
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="du-menu du-menu-sm du-dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {isLoggedIn ? (
              <>
                <li>
                  <a href="/profile">Edit Profile</a>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="/login">Login</a>
                </li>
                <li>
                  <a href="/register">Register</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
