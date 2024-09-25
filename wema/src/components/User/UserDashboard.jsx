import { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css';

function UserDashboard() {
  const id = localStorage.getItem('userId');
  const [approvedProductTotal, setApprovedProductTotal] = useState();
  const [approvedClaimTotal, setApprovedClaimTotal] = useState();
  const [pendingProductTotal, setPendingProductTotal] = useState();
  const [pendingClaimTotal, setPendingClaimTotal] = useState();
  const [productTotal, setProductTotal] = useState();
  const [admins, setAdmins] = useState([]);
  const [claimTotal, setClaimTotal] = useState();

  useEffect(() => {
    approvedProductCount();
    approvedClaimCount();
    pendingProductCount();
    pendingClaimCount();
    productCount();
    claimCount();
    AdminRecords();
  }, []);

  const AdminRecords = () => {
    axios.get('http://localhost:3000/user/admin_records').then((result) => {
      if (result.data.Status) {
        setAdmins(result.data.Result);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const approvedProductCount = () => {
    axios
      .get(`http://localhost:3000/user/approvedProduct_count/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setApprovedProductTotal(result.data.Result[0].product);
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const approvedClaimCount = () => {
    axios
      .get(`http://localhost:3000/user/approvedClaim_count/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setApprovedClaimTotal(result.data.Result[0].claim);
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const pendingProductCount = () => {
    axios
      .get(`http://localhost:3000/user/pendingProduct_count/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setPendingProductTotal(result.data.Result[0].product);
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      });
  };

  const pendingClaimCount = () => {
    axios
      .get(`http://localhost:3000/user/pendingClaim_count/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setPendingClaimTotal(result.data.Result[0].claim);
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      });
  };

  const productCount = () => {
    axios
      .get(`http://localhost:3000/user/product_count/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setProductTotal(result.data.Result[0].product);
        } else {
          alert(result.data.Error);
        }
      });
  };

  const claimCount = () => {
    axios.get(`http://localhost:3000/user/claim_count/${id}`).then((result) => {
      if (result.data.Status) {
        setClaimTotal(result.data.Result[0].claim);
      } else {
        alert(result.data.Error);
      }
    });
  };

  return (
    <div>
      <div className="statbox p-3 d-flex justify-content-around">
        <div className="dashboardDesc">
          <span className="pTitle">{productTotal}</span>
          <h4 className="description">Applied Products</h4>
        </div>
        <div className="dashboardDesc">
          <h5 className="pTitle">{claimTotal}</h5>
          <h4 className="description">Applied Claims</h4>
        </div>
        <div className="dashboardDesc">
          <h5 className="pTitle">{pendingProductTotal}</h5>
          <h4 className="description">Pending Products</h4>
        </div>
      </div>
      <div className="statbox p-3 d-flex justify-content-around">
        <div className="dashboardDesc">
          <h5 className="pTitle">{pendingClaimTotal}</h5>
          <h4 className="description">Pending Claims</h4>
        </div>
        <div className="dashboardDesc">
          <span className="pTitle">{approvedProductTotal}</span>
          <h4 className="description">Approved Products</h4>
        </div>

        <div className="dashboardDesc">
          <h5 className="pTitle">{approvedClaimTotal}</h5>
          <h4 className="description">Approved Claims</h4>
        </div>
      </div>
      <div className="mt-4 px-5 pt-3">
        <h3>Available Admins</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDashboard;
