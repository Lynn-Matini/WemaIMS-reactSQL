import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function User() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/users')
      .then((result) => {
        if (result.data.Status) {
          setUser(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`http://localhost:3000/admin/delete_user/${id}`)
        .then((result) => {
          if (result.data.Status) {
            window.location.reload();
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>User List</h3>
      </div>
      <Link to="/add_user" className="btn btn-success">
        Add User
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {user.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.age}</td>
                <td>{u.gender}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/` + u.image}
                    className="user_image"
                  />
                </td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>
                  <Link
                    to={`/edit_user/` + u.id}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default User;
