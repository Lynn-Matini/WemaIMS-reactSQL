import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
import '../style.css';

function UserAddClaim() {
  const id = localStorage.getItem('userId');
  const [claim, setClaim] = useState({
    claimName: '',
    amount: '',
    notes: '',
    productId: '',
    providers: '',
    status: 'PENDING',
    userId: id,
  });
  const [attach, setAttach] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/admin/boughtproducts/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setAttach(result.data.Result);
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
        userId: id,
        providers: selectedClaim.providers,
        status: 'PENDING',
      });
    } else {
      // else if (!selectedClaim) {
      //   toast.warn(
      //     'Please first purchase an Insurance product from the Product tab',
      //     {
      //       position: 'top-center',
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //     }
      //   );
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
    const userclaimdata = {
      claimName: claim.claimName,
      amount: claim.amount,
      notes: claim.notes,
      productId: claim.productId,
      providers: claim.providers,
      status: claim.status,
      userId: claim.userId,
    };

    axios
      .post('http://localhost:3000/user/useradd_claim', userclaimdata)
      .then((result) => {
        if (result.data.Status) {
          navigate('/userclaims');
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      {/* <ToastContainer /> */}
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Claim</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Claim Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              name="claimName"
              placeholder="Enter Claim Name"
              onChange={(e) =>
                setClaim({ ...claim, claimName: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">
              Amount
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputEmail4"
              name="amount"
              placeholder="Enter Amount"
              autoComplete="off"
              onChange={(e) => setClaim({ ...claim, amount: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPassword4" className="form-label">
              Notes
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPassword4"
              name="notes"
              placeholder="Enter Description"
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
            <label htmlFor="inputAddress" className="form-label">
              Provider Name
            </label>
            <input
              disabled
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              name="providers"
              placeholder="Enter Hospital Name"
              value={claim.providers}
              onChange={(e) =>
                setClaim({ ...claim, providers: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputProductId" className="form-label">
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
              placeholder="Select User ID"
              value={claim.userId}
            />
            {console.log(claim.userId)}
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

export default UserAddClaim;
