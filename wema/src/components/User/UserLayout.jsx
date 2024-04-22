import axios from 'axios';
import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

function UserLayout() {
  const navigate = useNavigate();
  const [activeNavLink, setActiveNavLink] = useState(null);
  axios.defaults.withCredentials = true;
  const email = localStorage.getItem('email');

  const handleNavLinkClick = (index) => {
    setActiveNavLink(index);
  };

  const handleLogout = () => {
    axios.get('http://localhost:3000/user/logout').then((result) => {
      if (result.data.Status) {
        localStorage.removeItem('valid');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
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
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link
              to="/userdashboard"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                Wema IMS
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

              <li className="w-100" onClick={handleLogout}>
                <Link
                  to="/userlogin"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Log Out</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Wema Insurance Management System</h4>
          </div>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

const navLinks = [
  { to: '/userdashboard', icon: 'speedometer2', label: 'Dashboard' },
  { to: '/userclaims', icon: 'file-earmark-text', label: 'Claims' },
  { to: '/userproducts', icon: 'grid', label: 'Products' },
  { to: '/userprofile', icon: 'person', label: 'Profile' },
  { to: '/education', icon: 'book', label: 'Education' },
];

export default UserLayout;
