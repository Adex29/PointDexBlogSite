import React, { useState, useEffect } from 'react';
import csrfToken from '@/Includes/csfrToken';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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


  return (
    <div className="du-navbar bg-base-300 bg-stone-50">
      <div className="du-flex-1">
        <a href="/home" className="du-btn du-btn-ghost text-xl">Home</a>
        <a href="/about" className="du-btn du-btn-ghost text-xl">About</a>
        <a href="/contact" className="du-btn du-btn-ghost text-xl">Contact</a>
      </div>

      <div className="flex-none">
        <div className="du-dropdown du-dropdown-end">
          <div tabIndex="0" role="button" className="du-btn du-btn-ghost du-btn-circle du-avatar">
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
            tabIndex="0"
            className="du-menu du-menu-sm du-dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {isLoggedIn ? (
              <>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
                <li>
                  <a href="/profile">Edit Profile</a>
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
