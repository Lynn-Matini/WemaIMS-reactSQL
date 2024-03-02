import { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css';

function UserDashboard() {
  const id = localStorage.getItem('userId');
  const [adminTotal, setAdminTotal] = useState();
  const [productTotal, setProductTotal] = useState();
  const [allocationTotal, setAllocationTotal] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [claimTotal, setClaimTotal] = useState();

  useEffect(() => {
    adminCount();
    productCount();
    claimCount();
    AdminRecords();

    axios
      .get(`http://localhost:3000/user/products/${id}`)
      .then((result) => {
        if (result.data.Status) {
          const allocationData = result.data.Result;
          console.log(allocationData);
          let total = 0;
          allocationData.forEach((item) => {
            if (item.status === 'APPROVED') {
              total += item.allocation;
            } else if (item.status === 'DENIED') {
              total -= item.allocation;
            }
          });
          setAllocationTotal(total);
        } else {
          console.error(result.data.Error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
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

  const adminCount = () => {
    axios
      .get('http://localhost:3000/user/admin_count')
      .then((result) => {
        if (result.data.Status) {
          setAdminTotal(result.data.Result[0].admin);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
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
          <h5 className="pTitle">{adminTotal}</h5>
          <h4 className="description">Admin</h4>
        </div>
        <div className="dashboardDesc">
          {/* <h5 className="pTitle">{userTotal}</h5> */}
          <h4 className="description">Total Users</h4>
        </div>
        <div className="dashboardDesc">
          <span className="pTitle">{productTotal}</span>
          <h4 className="description">Available Products</h4>
        </div>
      </div>
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
          <h5 className="pTitle">{allocationTotal}</h5>
          <h4 className="description">Total Amount of Allocation</h4>
        </div>
      </div>
      <div className="mt-4 px-5 pt-3">
        <h3>List of Admins</h3>
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
