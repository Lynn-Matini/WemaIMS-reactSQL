import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function UserClaims() {
  const [claim, setClaim] = useState([]);
  const id = localStorage.getItem('userId');

  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/claims/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setClaim(result.data.Result);
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this claim?')) {
      axios
        .delete(`http://localhost:3000/user/delete_claim/${id}`)
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
        <h3>Claim List</h3>
      </div>
      <Link to="/useradd_claim" className="btn btn-success">
        Add Claim
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Claim Id</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Notes</th>
              <th>Provider Name</th>
              <th>User ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {claim.map((c, index) => (
              <tr key={index}>
                <td>{c.id}</td>
                <td>{c.claimName}</td>
                <td>{c.amount}</td>
                <td>{c.notes}</td>
                <td>{c.providers}</td>
                <td>{c.userId}</td>
                <td>{c.status}</td>
                <td>
                  <Link
                    to={`/useredit_claim/` + c.id}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(c.id)}
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

export default UserClaims;
