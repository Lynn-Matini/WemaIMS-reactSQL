import { Link, Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const Layout = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    axios.get('http://localhost:3000/admin/logout').then((result) => {
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
              <li className="w-100">
                <Link
                  to="/dashboard"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="fs-4 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/products"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-book ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Products List</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/claims"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-file-earmark-text ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Manage Claims</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/users"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-people ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Manage Users</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/boughtproducts"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-grid ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">
                    Manage Products
                  </span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/payments"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-cash ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">
                    Manage Payments
                  </span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/profile"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-person ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Profile</span>
                </Link>
              </li>
              <li className="w-100" onClick={handleLogout}>
                <Link
                  to="/login"
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
};

export default Layout;
