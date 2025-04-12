import React from 'react';


import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Genie Slides</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
           <Link to="/about" style={styles.link}>About</Link>
        <Link to="/login" style={styles.button}>Login</Link>
        <Link to="/signup" style={styles.button}>Signup</Link>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#222',
    color: 'white',
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
  },
  button: {
    color: 'white',
    backgroundColor: '#444',
    padding: '6px 12px',
    textDecoration: 'none',
    fontSize: '14px'
  }
};

export default Navbar;
