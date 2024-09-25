import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    address: '',
    image: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/users/' + id)
      .then((result) => {
        setUser({
          ...user,
          name: result.data.Result[0].name,
          age: result.data.Result[0].age,
          gender: result.data.Result[0].gender,
          email: result.data.Result[0].email,
          address: result.data.Result[0].address,
          image: result.data.Result[0].image,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('age', user.age);
    formData.append('gender', user.gender);
    formData.append('email', user.email);
    formData.append('address', user.address);
    formData.append('image', user.image); // Append the file object

    try {
      const result = await axios.put(
        `http://localhost:3000/admin/edit_user/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (result.data.Status) {
        navigate('/users');
      } else {
        alert(result.data.Error);
        console.log(result.data.Error);
      }
    } catch (error) {
      console.error('Error occurred while editing user:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit User</h3>
        <form
          className="row g-1"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="col-12">
            <label htmlFor="userName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="userName"
              value={user.name}
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
              value={user.age}
              placeholder="Enter Age"
              autoComplete="off"
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
              value={user.gender}
              autoComplete="off"
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
            >
              <option value="">Select Gender </option>
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
              value={user.email}
              placeholder="Enter Email"
              autoComplete="off"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
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
              value={user.address}
              placeholder="1234 Main St"
              autoComplete="off"
              onChange={(e) => setUser({ ...user, address: e.target.value })}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="userImage">
              Select Image
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
              Edit User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
