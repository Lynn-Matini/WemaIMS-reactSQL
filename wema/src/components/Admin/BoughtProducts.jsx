import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function BoughtProducts() {
  const [product, setProduct] = useState([]);
  const [allocationTotal, setAllocationTotal] = useState(0);

  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/boughtproducts')
      .then((result) => {
        if (result.data.Status) {
          setProduct(result.data.Result);
          const totalAllocation = result.data.Result.reduce(
            (total, p) => total + p.allocation,
            0
          );
          setAllocationTotal(totalAllocation);
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleApproveClaim = (id, allocation) => {
    axios
      .put(`http://localhost:3000/admin/approve_boughtproduct/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setAllocationTotal(
            (prevAllocationTotal) => prevAllocationTotal - allocation
          );

          window.location.reload();
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDenyClaim = (id, allocation) => {
    axios
      .put(`http://localhost:3000/admin/deny_boughtproduct/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setAllocationTotal(
            (prevAllocationTotal) => prevAllocationTotal - allocation
          );
          window.location.reload();
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
        console.log(allocation + ' Allocation');
      })
      .catch((err) => console.log(err));
  };

  console.log(allocationTotal + ' Allocation Total');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`http://localhost:3000/admin/delete_boughtproduct/${id}`)
        .then((result) => {
          if (result.data.Status) {
            window.location.reload();
          } else {
            alert(result.data.Error);
            console.log(result.data.Error);
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
        backgroundColor: 'maroon',
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
        <h3>Consumed Products</h3>
      </div>
      <Link to="/add_boughtproduct" className="btn btn-success">
        Add Product
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Benefits</th>
              <th>Premium</th>
              <th>User ID</th>
              <th>Allocation</th>
              <th>Providers</th>
              <th>Status</th>
              <td></td>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {product.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.productName}</td>
                <td>{p.benefits}</td>
                <td>{p.premium}</td>
                <td>{p.userId}</td>
                <td>{p.allocation}</td>
                <td>{p.providers}</td>
                <td style={makeStyles(p.status)}>{p.status}</td>
                <td></td>
                <td>
                  <div className="mb-3 d-flex justify-content-between">
                    <Link
                      onClick={() => handleApproveClaim(p.id)}
                      className="btn btn-secondary btn-sm w-50 d-flex justify-content-center approve"
                    >
                      Approve
                    </Link>
                    <Link
                      onClick={() => handleDenyClaim(p.id)}
                      className="btn btn-secondary btn-sm deny"
                    >
                      &nbsp;Deny&nbsp;
                    </Link>
                  </div>
                  <div className="d-flex justify-content-between">
                    <Link
                      to={`/edit_boughtproduct/` + p.id}
                      className="btn btn-secondary btn-sm w-50 edit"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-secondary btn-sm delete"
                      onClick={() => handleDelete(p.id)}
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

export default BoughtProducts;
