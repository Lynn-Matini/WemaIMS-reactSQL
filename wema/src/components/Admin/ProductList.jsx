import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProductList() {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/products')
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
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`http://localhost:3000/admin/delete_product/${id}`)
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
      <Link to="/add_product" className="btn btn-success">
        Add Product
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Premium</th>
              <th>Benefits</th>
              <th>Allocation</th>
              <th>Providers</th>
              <th>Providers Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {product.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.productName}</td>
                <td>{p.description}</td>
                <td>{p.premium}</td>
                <td>{p.benefits}</td>
                <td>{p.allocation}</td>
                <td>{p.providers}</td>
                <td>{p.providersEmail}</td>

                <td>
                  <Link
                    to={`/edit_product/` + p.id}
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

export default ProductList;
