import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Start = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get('http://localhost:3000/verify')
      .then((result) => {
        if (result.data.Status) {
          if (result.data.Role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/userdashboard');
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage ">
      <div className="p-3 rounded w-25 border loginForm bg-dark text-white">
        <h2 className="text-center">Login As</h2>
        <div className="d-flex justify-content-between mt-5 mb-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              navigate('/userlogin');
            }}
          >
            User
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              navigate('/login');
            }}
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;
