import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({
    productName: '',
    description: '',
    premium: '',
    benefits: '',
    allocation: '',
    providers: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/products/' + id)
      .then((result) => {
        setProduct({
          ...product,
          productName: result.data.Result[0].productName,
          description: result.data.Result[0].description,
          premium: result.data.Result[0].premium,
          benefits: result.data.Result[0].benefits,
          allocation: result.data.Result[0].allocation,
          providers: result.data.Result[0].providers,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put('http://localhost:3000/admin/edit_product/' + id, product)
      .then((result) => {
        if (result.data.Status) {
          navigate('/products');
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Product</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="pName" className="form-label">
              Product Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="pName"
              value={product.productName}
              placeholder="Enter Product Name"
              onChange={(e) =>
                setProduct({ ...product, productName: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="productDesc" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="productDesc"
              value={product.description}
              placeholder="Enter Description"
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="productPremium" className="form-label">
              Premium
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="productPremium"
              value={product.premium}
              placeholder="Enter Premium"
              onChange={(e) =>
                setProduct({ ...product, premium: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="productBenefits" className="form-label">
              Benefits
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="productBenefits"
              value={product.benefits}
              placeholder="Enter Benefits"
              onChange={(e) =>
                setProduct({ ...product, benefits: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="productAllo" className="form-label">
              Allocation
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="productAllo"
              value={product.allocation}
              placeholder="Enter Allocation"
              onChange={(e) =>
                setProduct({ ...product, allocation: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="productProvider" className="form-label">
              Providers
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="productProvider"
              value={product.providers}
              placeholder="Enter Premium"
              onChange={(e) =>
                setProduct({ ...product, providers: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
