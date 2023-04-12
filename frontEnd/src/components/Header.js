import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../library-logo.png';
import AuthContext from '../context/AuthProvider';

const HeaderContainer = styled.div`
  background-color: #0066cc;
`;

const Logo = styled.img`
  height: 50px;
  margin-right: 10px;
`;

const linkStyle = {
  margin: '1rem',
  textDecoration: 'none',
  color: 'white',
};

const Header = () => {
  const { auth } = useContext(AuthContext); // Access the auth object from the AuthContext
  const { email, role } = auth;

  return (
    <div>
      <HeaderContainer>
        <nav className="navbar navbar-expand-md navbar-dark">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
              <Logo src={logo} alt="Library Logo" />
              My Library
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link to="/" className="nav-link" style={linkStyle}>
                    Home
                  </Link>
                </li>
                {role === 'ADMIN' && ( 
                  <>
                  <li className="nav-item">
                    <Link
                      to="/addbook"
                      className="nav-link"
                      style={linkStyle}
                    >
                      Add Book
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/addUser"
                      className="nav-link"
                      style={linkStyle}
                    >
                       add User
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/addCategory"
                      className="nav-link"
                      style={linkStyle}
                    >
                      Add Category
                    </Link>
                  </li>
                  
                  </>
                )}
                {auth.isAuthenticated ? (
                  <>
                    <li className="nav-item">
                      <span className="nav-link" style={linkStyle}>
                        {email} ({role})
                      </span>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/logout"
                        className="nav-link"
                        style={linkStyle}
                      >
                        Logout
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link
                        to="/signup"
                        className="nav-link"
                        style={linkStyle}
                      >
                        Sign Up
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/login"
                        className="nav-link"
                        style={linkStyle}
                      >
                        Log In
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </HeaderContainer>
    </div>
  );
};

export default Header;
