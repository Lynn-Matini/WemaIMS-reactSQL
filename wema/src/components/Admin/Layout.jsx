import { Link, Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import '../style.css';
import { useState } from 'react';

const Layout = () => {
  const navigate = useNavigate();
  const [activeNavLink, setActiveNavLink] = useState(null);
  axios.defaults.withCredentials = true;

  const email = localStorage.getItem('email');
  const id = localStorage.getItem('userId');
  const allocationTotal = localStorage.getItem('allocationTotal');
  const processedProducts = localStorage.getItem('processedProducts');
  const claimTotal = localStorage.getItem('claimTotal');
  const processedClaims = localStorage.getItem('processedClaims');

  const handleNavLinkClick = (index) => {
    setActiveNavLink(index);
  };

  const updateAllocationTotal = () => {
    axios
      .put(`http://localhost:3000/admin/updateAllocationTotal/${id}`, {
        allocationTotal: parseInt(allocationTotal, 10),
        processedProducts: processedProducts,
        claimTotal: parseInt(claimTotal, 10),
        processedClaims: processedClaims,
      })
      .then((response) => {
        console.log(
          'Allocation total successfully updated in database:',
          response.data
        );
      })
      .catch((error) => {
        console.error('Failed to update allocation total in database:', error);
      });
  };

  const handleLogout = () => {
    updateAllocationTotal();
    axios.get('http://localhost:3000/admin/logout').then((result) => {
      console.log(allocationTotal);
      if (result.data.Status) {
        localStorage.removeItem('valid');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        localStorage.removeItem('allocationTotal');
        localStorage.removeItem('processedProducts');
        localStorage.removeItem('claimTotal');
        localStorage.removeItem('processedClaims');
        navigate('/');
      } else {
        alert(result.data.Error);
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 sidenav">
            <Link
              to="/dashboard"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                Wema IMS Admin
              </span>
            </Link>
            <span>{email}</span>
            <hr></hr>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              {navLinks.map((navLink, index) => (
                <li className="w-100" key={index}>
                  <Link
                    to={navLink.to}
                    className="nav-link px-0 align-middle text-white"
                  >
                    <div
                      className={`navlinks ${
                        activeNavLink === index ? 'active' : ''
                      }`}
                      onClick={() => handleNavLinkClick(index)}
                    >
                      <i className={`fs-4 bi-${navLink.icon} ms-2`}></i>
                      <span className="ms-2 d-none d-sm-inline">
                        {navLink.label}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}

              {/* Logout */}
              <li className="w-100" onClick={handleLogout}>
                <Link
                  to="/login"
                  className="nav-link px-0 align-middle text-white"
                >
                  <div className="navlinks">
                    <i className="fs-4 bi-power ms-2"></i>
                    <span className="ms-2 d-none d-sm-inline">Log Out</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Wema Insurance Management System</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const navLinks = [
  { to: '/dashboard', icon: 'speedometer2', label: 'Dashboard' },
  { to: '/products', icon: 'book', label: 'Products List' },
  { to: '/claims', icon: 'file-earmark-text', label: 'Manage Claims' },
  { to: '/users', icon: 'people', label: 'Manage Users' },
  { to: '/boughtproducts', icon: 'grid', label: 'Manage Products' },
  { to: '/profile', icon: 'person', label: 'Profile' },
];

export default Layout;
