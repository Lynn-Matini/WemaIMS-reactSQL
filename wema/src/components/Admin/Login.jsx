import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/admin/login', values).then((result) => {
      if (result.data.loginStatus) {
        localStorage.setItem('valid', true);
        localStorage.setItem('userId', result.data.id);
        localStorage.setItem('email', result.data.email);
        localStorage.setItem('allocationTotal', result.data.allocationTotal);
        localStorage.setItem(
          'processedProducts',
          result.data.processedProducts
        );
        localStorage.setItem('claimTotal', result.data.claimTotal);
        localStorage.setItem('processedClaims', result.data.processedClaims);
        navigate('/dashboard');
      } else {
        setError(result.data.Error);
        console.log(error);
      }
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <div className="text-danger">{error && error}</div>
        <h2 className="mb-4 d-flex justify-content-center">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              autoComplete="off"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-0"
            />
          </div>
          <button className="btn btn-success w-100 rounded mb-2 mt-2 loginButton">
            Log in
          </button>
        </form>
        <Link to="/userlogin" className="linkToPortal">
          Login as User
        </Link>
      </div>
    </div>
  );
};

export default Login;
