import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UserEditClaim() {
  const { id } = useParams();
  const [claim, setClaim] = useState({
    claimName: '',
    amount: '',
    notes: '',
    providerName: '',
    status: '',
    userId: '',
  });
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/user/users')
      .then((result) => {
        if (result.data.Status) {
          setUser(result.data.Result);
          console.log(id);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get('http://localhost:3000/user/userclaims/' + id)
      .then((result) => {
        setClaim({
          ...claim,
          claimName: result.data.Result[0].claimName,
          amount: result.data.Result[0].amount,
          notes: result.data.Result[0].notes,
          providerName: result.data.Result[0].providerName,
          status: result.data.Result[0].status,
          userId: result.data.Result[0].userId,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put('http://localhost:3000/user/useredit_claim/' + id, claim)
      .then((result) => {
        if (result.data.Status) {
          navigate('/userclaims');
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Claim</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="cName" className="form-label">
              Claim Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="cName"
              value={claim.claimName}
              placeholder="Enter Claim Name"
              onChange={(e) =>
                setClaim({ ...claim, claimName: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="claimAmount" className="form-label">
              Amount
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="claimAmount"
              value={claim.amount}
              placeholder="Enter Amount"
              onChange={(e) => setClaim({ ...claim, amount: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="claimNotes" className="form-label">
              Notes
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="claimNotes"
              value={claim.notes}
              placeholder="Deep Heat"
              onChange={(e) => setClaim({ ...claim, notes: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="claimProvider" className="form-label">
              Provider Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="claimProvider"
              value={claim.providerName}
              placeholder="Enter Provider Name"
              onChange={(e) =>
                setClaim({ ...claim, providerName: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="claimStatus" className="form-label">
              Status
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="claimStatus"
              value={claim.status}
              placeholder="Enter Status"
              disabled
              onChange={(e) => setClaim({ ...claim, status: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="uId2" className="form-label">
              User ID
            </label>
            <input
              id="uId2"
              type="text"
              value={claim.userId}
              className="form-control rounded-0"
              disabled
              onChange={(e) => setUser({ ...user, userId: e.target.value })}
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserEditClaim;
