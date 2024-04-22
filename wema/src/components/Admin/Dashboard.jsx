import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [userTotal, setUserTotal] = useState();
  const [boughtProductTotal, setBoughtProductTotal] = useState();
  const [productTotal, setProductTotal] = useState();
  const [appliedClaimTotal, setAppliedClaimTotal] = useState();
  const allocationTotal = localStorage.getItem('allocationTotal');
  const claimTotal = localStorage.getItem('claimTotal');

  useEffect(() => {
    appliedClaimCount();
    userCount();
    productCount();
    boughtProductCount();
  }, []);

  const userCount = () => {
    axios.get('http://localhost:3000/admin/user_count').then((result) => {
      if (result.data.Status) {
        setUserTotal(result.data.Result[0].user);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const productCount = () => {
    axios.get('http://localhost:3000/admin/product_count').then((result) => {
      if (result.data.Status) {
        setProductTotal(result.data.Result[0].product);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const boughtProductCount = () => {
    axios
      .get('http://localhost:3000/admin/boughtproduct_count')
      .then((result) => {
        if (result.data.Status) {
          setBoughtProductTotal(result.data.Result[0].product);
        } else {
          alert(result.data.Error);
        }
      });
  };

  const appliedClaimCount = () => {
    axios.get('http://localhost:3000/admin/claim_count').then((result) => {
      if (result.data.Status) {
        setAppliedClaimTotal(result.data.Result[0].claim);
      } else {
        alert(result.data.Error);
      }
    });
  };

  return (
    <div>
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="dashboardDesc">
          <h5 className="pTitle">{userTotal}</h5>
          <h4 className="description">Total Users</h4>
        </div>
        <div className="dashboardDesc">
          <span className="pTitle">{productTotal}</span>
          <h4 className="description">Available Products</h4>
        </div>
        <div className="dashboardDesc">
          <span className="pTitle">{boughtProductTotal}</span>
          <h4 className="description">Applied Products</h4>
        </div>
      </div>
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="dashboardDesc">
          <h5 className="pTitle">{appliedClaimTotal}</h5>
          <h4 className="description">Applied Claims</h4>
        </div>
        <div className="dashboardDesc">
          <h5 className="pTitle">{allocationTotal}</h5>
          <h4 className="description">Total Amount of Allocation</h4>
        </div>
        <div className="dashboardDesc">
          <h5 className="pTitle">{claimTotal}</h5>
          <h4 className="description">Total Amount on Approved Claims</h4>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
