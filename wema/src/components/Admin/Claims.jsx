import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Claims() {
  const [claim, setClaim] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/claims')
      .then((result) => {
        if (result.data.Status) {
          setClaim(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleApproveClaim = (id) => {
    axios
      .put(`http://localhost:3000/admin/approve_claim/${id}`)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDenyClaim = (id) => {
    axios
      .put(`http://localhost:3000/admin/deny_claim/${id}`)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this claim?')) {
      axios
        .delete(`http://localhost:3000/user/delete_claim/${id}`)
        .then((result) => {
          if (result.data.Status) {
            window.location.reload();
          } else {
            alert(result.data.Error);
            console(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const makeStyles = (status) => {
    if (status === 'APPROVED') {
      return {
        backgroundColor: 'green',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
      };
    } else if (status === 'DENIED') {
      return {
        backgroundColor: 'red',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
      };
    } else if (status === 'PENDING') {
      return {
        backgroundColor: 'yellow',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '5px',
        color: 'black',
        fontWeight: 'bold',
      };
    }
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Claim List</h3>
      </div>
      <Link to="/add_claim" className="btn btn-success">
        Add Claim
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Notes</th>
              <th>Provider Name</th>
              <th>User ID</th>
              <td></td>
              <th>Status</th>
              <td></td>
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
                <td></td>
                <td style={makeStyles(c.status)}>{c.status}</td>
                <td></td>
                <td>
                  <div className="mb-3 d-flex justify-content-between">
                    <Link
                      onClick={() => handleApproveClaim(c.id)}
                      className="btn btn-secondary btn-sm w-50 d-flex justify-content-center approve"
                    >
                      Approve
                    </Link>
                    <Link
                      onClick={() => handleDenyClaim(c.id)}
                      className="btn btn-secondary btn-sm deny"
                    >
                      &nbsp;Deny&nbsp;
                    </Link>
                  </div>
                  <div className="d-flex justify-content-between">
                    <Link
                      to={`/edit_claim/` + c.id}
                      className="btn btn-secondary btn-sm w-50 edit"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-secondary btn-sm delete"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Claims;
