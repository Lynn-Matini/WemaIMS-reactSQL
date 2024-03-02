import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function UserProducts() {
  const [product, setProduct] = useState([]);
  const id = localStorage.getItem('userId');

  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/products/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setProduct(result.data.Result);
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this claim?')) {
      axios
        .delete(`http://localhost:3000/user/delete_product/${id}`)
        .then((result) => {
          if (result.data.Status) {
            window.location.reload();
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Product List</h3>
      </div>
      <Link to="/useradd_product" className="btn btn-success">
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {product.map((p, index) => (
              <tr key={index}>
                <td>{p.id}</td>
                <td>{p.productName}</td>
                <td>{p.benefits}</td>
                <td>{p.premium}</td>
                <td>{p.userId}</td>
                <td>
                  <Link
                    to={`/useredit_product/` + p.id}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
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
  );
}

export default UserProducts;
