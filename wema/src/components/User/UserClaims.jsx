import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

function UserClaims() {
  const componentRef = useRef();
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
  }, [id]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this claim?')) {
      axios
        .delete(`http://localhost:3000/user/delete_claim/${id}`)
        .then((result) => {
          if (result.data.Status) {
            setClaim(claim.filter((c) => c.id !== id));
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Claims made',
    onAfterPrint: () => {
      alert('PDF Generated Successfully');
    },
  });

  const makeStyles = (status) => {
    if (status === 'APPROVED') {
      return {
        backgroundColor: 'green',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        width: '75%',
      };
    } else if (status === 'DENIED') {
      return {
        backgroundColor: 'maroon',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        width: '75%',
      };
    } else if (status === 'PENDING') {
      return {
        backgroundColor: 'yellow',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '5px',
        color: 'black',
        fontWeight: 'bold',
        width: '75%',
      };
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
      <button
        to="/useradd_product"
        onClick={generatePDF}
        className="btn btn-success ms-1"
      >
        Get PDF
      </button>
      <div className="mt-3">
        <div ref={componentRef} style={{ width: '100%' }}>
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
                  <td style={makeStyles(c.status)}>{c.status}</td>
                  <td>
                    {c.status === 'PENDING' ? (
                      <Link
                        to={`/useredit_claim/` + c.id}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Edit
                      </Link>
                    ) : (
                      <button className="btn btn-warning btn-sm me-2" disabled>
                        Edit
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(c.id)}
                      disabled={c.status !== 'PENDING'}
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
    </div>
  );
}

export default UserClaims;
