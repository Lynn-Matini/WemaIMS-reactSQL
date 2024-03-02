import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Start from './components/Start';
import PrivateRoute from './components/PrivateRoute';

//ADMIN
import Login from './components/Admin/Login';
import Layout from './components/Admin/Layout';
import Dashboard from './components/Admin/Dashboard';
import User from './components/Admin/User';
import AddUser from './components/Admin/AddUser';
import EditUser from './components/Admin/EditUser';
import ProductList from './components/Admin/ProductList';
import BoughtProducts from './components/Admin/BoughtProducts';
import AddProduct from './components/Admin/AddProduct';
import AddBoughtProduct from './components/Admin/AddBoughtProduct';
import EditProduct from './components/Admin/EditProduct';
import EditBoughtProduct from './components/Admin/EditBoughtProduct';
import Claims from './components/Admin/Claims';
import AddClaim from './components/Admin/AddClaim';
import EditClaim from './components/Admin/EditClaim';
import Payments from './components/Admin/Payments';
import Profile from './components/Admin/Profile';

//USER
import UserLogin from './components/User/UserLogin';
import UserLayout from './components/User/UserLayout';
import UserDashboard from './components/User/UserDashboard';
import UserProducts from './components/User/UserProducts';
import UserClaims from './components/User/UserClaims';
import UserPayments from './components/User/UserPayments';
import UserProfile from './components/User/UserProfile';
import UserEditClaim from './components/User/UserEditClaim';
import UserAddClaim from './components/User/UserAddClaim';
import UserAddProduct from './components/User/UserAddProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userlogin" element={<UserLogin />} />
        {/* <Route path="/userprofile/:id" element={<UserProfile />} /> */}

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/users" element={<User />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/boughtproducts" element={<BoughtProducts />} />

          <Route path="/add_product" element={<AddProduct />} />
          <Route path="/add_boughtproduct" element={<AddBoughtProduct />} />
          <Route path="/add_user" element={<AddUser />} />
          <Route path="/add_claim" element={<AddClaim />} />
          <Route path="/edit_user/:id" element={<EditUser />} />
          <Route path="/edit_claim/:id" element={<EditClaim />} />
          <Route path="/edit_product/:id" element={<EditProduct />} />
          <Route
            path="/edit_boughtproduct/:id"
            element={<EditBoughtProduct />}
          />
          <Route path="/payments" element={<Payments />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route
          path="/"
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/userclaims" element={<UserClaims />} />
          {/* <Route path="/userclaims/:id" element={<UserClaims />} /> */}
          <Route path="/useradd_product" element={<UserAddProduct />} />
          <Route path="/useradd_claim" element={<UserAddClaim />} />
          <Route path="/useredit_claim/:id" element={<UserEditClaim />} />
          <Route path="/userproducts" element={<UserProducts />} />
          <Route path="/userpayments" element={<UserPayments />} />
          <Route path="/userprofile" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
