import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';

import './NavLinks.css';

export default function NavLinks() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/' exact>
          ALL USERS
        </NavLink>
      </li>
      {isLoggedIn && (
        <>
          <li>
            <NavLink to='/u1/places'>MY PLACES</NavLink>
          </li>
          <li>
            <NavLink to='/places/new'>ADD PLACE</NavLink>
          </li>
          <li>
            <button onClick={logout}>LOGOUT</button>
          </li>
        </>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink to='/auth'>AUTHENTICATE</NavLink>
        </li>
      )}
    </ul>
  );
}
