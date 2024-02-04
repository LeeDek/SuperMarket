// NavBar.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { navbarItems } from '../../constants/NavbarItems';
import NavbarItem from '../NavBarItem/NavBarItem';
import "./navBar.scss";

const NavBar: React.FC = () => {
  return (
    <div
      role="navigation"
      aria-label="תפריט מחלקות החנות"
      className="navbar navbar-app nav-menu rl-transition is-not-accessibility col-8"
    >
      <div className="container-fluid">
        <ul id="main-menu" className="menu d-lg-flex showMenu justify-content-center d-flex ml-auto">
          {navbarItems.map((item, index) => (
            <NavbarItem key={index} item={item} />
          ))}
        </ul>
      </div>

    </div>
  );
};

export default NavBar;
