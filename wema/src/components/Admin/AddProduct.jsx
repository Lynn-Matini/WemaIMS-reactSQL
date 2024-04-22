import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const [product, setProduct] = useState({
    productName: '',
    description: '',
    premium: '',
    benefits: '',
    allocation: '',
    providers: '',
    providersEmail: '', // Added providersEmail
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const productdata = {
      productName: product.productName,
      description: product.description,
      premium: product.premium,
      benefits: product.benefits,
      allocation: product.allocation,
      providers: product.providers,
      providersEmail: product.providersEmail, // Added providersEmail
    };

    axios
      .post('http://localhost:3000/admin/add_product', productdata)
      .then((result) => {
        if (result.data.Status) {
          navigate('/products');
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
        <h3 className="text-center">Add Product</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="pName" className="form-label">
              Product Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="pName"
              name="productName"
              autoComplete="off"
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
              name="description"
              placeholder="Enter Description"
              autoComplete="off"
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
              type="text"
              className="form-control rounded-0"
              id="productPremium"
              name="premium"
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
              name="benefits"
              placeholder="Enter Benefits"
              autoComplete="off"
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
              name="allocation"
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
              name="providers"
              placeholder="Enter Providers"
              onChange={(e) =>
                setProduct({ ...product, providers: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="productProviderEmail" className="form-label">
              Providers Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="productProviderEmail"
              name="providersEmail"
              placeholder="Enter Providers Email"
              onChange={(e) =>
                setProduct({ ...product, providersEmail: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
