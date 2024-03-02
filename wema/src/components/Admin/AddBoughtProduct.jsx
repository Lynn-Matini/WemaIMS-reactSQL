import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddBoughtProduct() {
  const [product, setProduct] = useState({
    productName: '',
    benefits: '',
    premium: '',
    productId: '',
    userId: '',
    allocation: '',
    providers: '',
    status: '',
  });
  const [user, setUser] = useState([]);
  const [attach, setAttach] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/products')
      .then((result) => {
        if (result.data.Status) {
          setAttach(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get('http://localhost:3000/admin/users')
      .then((result) => {
        if (result.data.Status) {
          setUser(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleProductChange = (e) => {
    const productId = e.target.value;
    // Find the selected product in the attach array
    const selectedProduct = attach.find(
      (a) => Number(a.id) === Number(productId)
    );
    setProduct({ ...product, productId: productId });
    if (selectedProduct) {
      setProduct({
        productName: selectedProduct.productName,
        benefits: selectedProduct.benefits,
        premium: selectedProduct.premium,
        productId: selectedProduct.id,
        allocation: selectedProduct.allocation,
        providers: selectedProduct.providers,
        status: 'PENDING',
      });
    } else {
      setProduct({
        productName: '',
        benefits: '',
        premium: '',
        productId: '',
        allocation: '',
        providers: '',
        status: '',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productdata = {
      productName: product.productName,
      benefits: product.benefits,
      premium: product.premium,
      productId: product.productId,
      userId: product.userId,
      allocation: product.allocation,
      providers: product.providers,
      status: product.status,
    };

    axios
      .post('http://localhost:3000/admin/add_boughtproduct', productdata)
      .then((result) => {
        if (result.data.Status) {
          navigate('/boughtproducts');
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
        <h3 className="text-center">Buy a Product</h3>
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
              value={product.productName}
              disabled
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
              value={product.benefits}
              disabled
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
              value={product.premium}
              disabled
            />
          </div>
          <div className="col-12">
            <label htmlFor="pId" className="form-label">
              Product ID
            </label>
            <select
              className="form-select"
              id="pId"
              name="productId"
              value={product.productId}
              onChange={handleProductChange}
            >
              <option value="">Select Product ID</option>
              {attach.map((a) => {
                return (
                  <option key={a.id} value={a.id}>
                    {a.id}
                  </option>
                );
              })}
              {console.log(attach)}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="uId" className="form-label">
              User ID
            </label>
            <select
              className="form-select"
              id="uId"
              name="userId"
              value={product.userId}
              onChange={(e) =>
                setProduct({ ...product, userId: e.target.value })
              }
            >
              <option value="">Select User ID</option>

              {user.map((u) => {
                return (
                  <option key={u.id} value={u.id}>
                    {u.id}
                  </option>
                );
              })}
              {console.log(product.userId)}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="productAllo" className="form-label">
              Allocation
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="productAllo"
              name="allocation"
              placeholder="Enter Allocation"
              value={product.allocation}
              disabled
            />
          </div>
          <div className="col-12">
            <label htmlFor="productProvider" className="form-label">
              Providers
            </label>
            <input
              disabled
              type="text"
              className="form-control rounded-0"
              id="productProvider"
              name="providers"
              value={product.providers}
              placeholder="Enter Providers"
              onChange={(e) =>
                setProduct({ ...product, providers: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="productStatus" className="form-label">
              Status
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="productStatus"
              name="status"
              placeholder="Select Status"
              value={product.status}
              disabled
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

export default AddBoughtProduct;
