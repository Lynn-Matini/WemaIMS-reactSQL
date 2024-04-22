import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddUser() {
  const [user, setUser] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    address: '',
    image: '',
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const userAge = Number(user.age);

    if (userAge < 18 || userAge > 70) {
      alert('Age should be between 18 and 70');
      return; // Stop the submission if the validation fails
    }

    const formdata = new FormData();
    formdata.append('name', user.name);
    formdata.append('age', user.age);
    formdata.append('gender', user.gender);
    formdata.append('email', user.email);
    formdata.append('password', user.password);
    formdata.append('address', user.address);
    formdata.append('image', user.image);

    axios
      .post('http://localhost:3000/admin/add_user', formdata)
      .then((result) => {
        if (result.data.Status) {
          navigate('/users');
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add User</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="userName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="userName"
              name="name"
              placeholder="Enter Name"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="userAge" className="form-label">
              Age
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="userAge"
              name="age"
              placeholder="Enter Age"
              onChange={(e) => setUser({ ...user, age: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="userGender" className="form-label">
              Gender
            </label>
            <select
              type="text"
              className="form-select"
              id="userGender"
              name="gender"
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="userEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="userEmail"
              name="email"
              placeholder="Enter Email"
              autoComplete="off"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="userPassword" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="userPassword"
              name="password"
              placeholder="Enter Password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="userAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="userAddress"
              name="address"
              placeholder="1234 Main St"
              autoComplete="off"
              onChange={(e) => setUser({ ...user, address: e.target.value })}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="userImage">
              Pick Image
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="userImage"
              name="image"
              onChange={(e) => setUser({ ...user, image: e.target.files[0] })}
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
