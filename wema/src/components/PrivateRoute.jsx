import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function PrivateRoute({ children }) {
  return localStorage.getItem('valid') ? children : <Navigate to="/" />;
}

export default PrivateRoute;
