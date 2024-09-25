import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditClaim() {
  const { id } = useParams();
  const [claim, setClaim] = useState({
    claimName: '',
    amount: '',
    notes: '',
    productId: '',
    providers: '',
    status: '',
    userId: '',
  });
  const [attach, setAttach] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/boughtproducts')
      .then((result) => {
        if (result.data.Status) {
          const approvedProducts = result.data.Result.filter(
            (product) => product.status === 'APPROVED'
          );
          setAttach(approvedProducts);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get('http://localhost:3000/admin/claims/' + id)
      .then((result) => {
        setClaim({
          ...claim,
          claimName: result.data.Result[0].claimName,
          amount: result.data.Result[0].amount,
          notes: result.data.Result[0].notes,
          productId: result.data.Result[0].productId,
          providers: result.data.Result[0].providers,
          status: result.data.Result[0].status,
          userId: result.data.Result[0].userId,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleClaimChange = (e) => {
    const productId = e.target.value;
    // Find the selected product in the attach array
    const selectedClaim = attach.find(
      (a) => Number(a.id) === Number(productId)
    );
    setClaim({ ...claim, productId: productId });
    if (selectedClaim) {
      setClaim({
        productId: selectedClaim.id,
        providers: selectedClaim.providers,
        status: 'PENDING',
      });
    } else {
      setClaim({
        productId: '',
        providers: '',
        status: '',
      });
    }
    console.log(selectedClaim);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put('http://localhost:3000/admin/edit_claim/' + id, claim)
      .then((result) => {
        if (result.data.Status) {
          navigate('/claims');
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
            <label htmlFor="pId2" className="form-label">
              Purchased Product ID
            </label>
            <select
              className="form-select"
              id="pId2"
              name="productId"
              value={claim.productId}
              onChange={handleClaimChange}
            >
              <option value="">Select Purchased Product ID</option>
              {attach.map((a) => {
                return (
                  <option key={a.id} value={a.id}>
                    {a.id}
                  </option>
                );
              })}
              {console.log(attach)}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="claimProvider" className="form-label">
              Provider Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="claimProvider"
              value={claim.providers}
              placeholder="Enter Provider Name"
              onChange={(e) =>
                setClaim({ ...claim, providers: e.target.value })
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
            <select
              id="uId2"
              value={claim.userId}
              className="form-select"
              onChange={(e) => setClaim({ ...claim, userId: e.target.value })}
            >
              <option value="">Select User ID</option>
              {attach.map((a) => {
                return (
                  <option key={a.userId} value={a.userId}>
                    {a.userId}
                  </option>
                );
              })}
            </select>
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

export default EditClaim;
