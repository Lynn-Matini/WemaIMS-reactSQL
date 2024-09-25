import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddClaim() {
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
          console.log(approvedProducts);
        } else {
          alert(result.data.Error);
        }
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
        userId: selectedClaim.userId,
      });
    } else {
      setClaim({
        productId: '',
        providers: '',
        status: '',
        userId: '',
      });
    }
    console.log(selectedClaim);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const claimAmount = parseFloat(claim.amount);

    const selectedProduct = attach.find(
      (product) => Number(product.id) === Number(claim.productId)
    );
    console.log(selectedProduct.balance);
    const productBalance = parseFloat(selectedProduct.balance);

    if (!selectedProduct) {
      alert("Product not selected or doesn't exist.");
      return;
    }

    if (claimAmount > productBalance) {
      alert(`Insufficient balance. Your balance is Kes ${productBalance}`);
      return; // Stop the form submission
    }

    const claimdata = {
      claimName: claim.claimName,
      amount: claim.amount,
      notes: claim.notes,
      productId: claim.productId,
      providers: claim.providers,
      status: claim.status,
      userId: claim.userId,
    };

    axios
      .post('http://localhost:3000/admin/add_claim', claimdata)
      .then((result) => {
        if (result.data.Status) {
          navigate('/claims');
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
        <h3 className="text-center">Add Claim</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
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
              <option value="">Select Product ID</option>
              {attach.map((a) => {
                return (
                  <option key={a.id} value={a.id}>
                    {a.id}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="cName" className="form-label">
              Claim Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="cName"
              name="claimName"
              autoComplete="off"
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
              name="amount"
              placeholder="Enter Amount"
              autoComplete="off"
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
              name="notes"
              placeholder="Enter Notes"
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
              name="providers"
              placeholder="Enter Provider Name"
              value={claim.providers}
              disabled
            />
          </div>
          <div className="col-12">
            <label htmlFor="claimStatus" className="form-label">
              Status
            </label>
            <input
              disabled
              type="text"
              className="form-control rounded-0"
              id="claimStatus"
              name="status"
              placeholder="Enter Status"
              value={claim.status}
            />
          </div>
          <div className="col-12">
            <label htmlFor="uId2" className="form-label">
              User ID
            </label>
            <input
              disabled
              className="form-control rounded-0"
              id="uId2"
              name="userId"
              value={claim.userId}
              placeholder="Select User ID"
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClaim;
