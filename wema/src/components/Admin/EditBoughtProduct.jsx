import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditBoughtProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({
    productId: '',
    productName: '',
    benefits: '',
    premium: '',
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

    axios
      .get('http://localhost:3000/admin/boughtproducts/' + id)
      .then((result) => {
        setProduct({
          ...product,
          productId: result.data.Result[0].productId,
          productName: result.data.Result[0].productName,
          benefits: result.data.Result[0].benefits,
          premium: result.data.Result[0].premium,
          userId: result.data.Result[0].userId,
          allocation: result.data.Result[0].allocation,
          providers: result.data.Result[0].providers,
          status: result.data.Result[0].status,
        });
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
        productId: selectedProduct.id,
        productName: selectedProduct.productName,
        benefits: selectedProduct.benefits,
        premium: selectedProduct.premium,
        allocation: selectedProduct.allocation,
        providers: selectedProduct.providers,
        status: 'PENDING',
      });
    } else {
      setProduct({
        productId: '',
        productName: '',
        benefits: '',
        premium: '',
        allocation: '',
        providers: '',
        status: '',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put('http://localhost:3000/admin/edit_boughtproduct/' + id, product)
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
        <h3 className="text-center">Edit Purchased Product</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="pName" className="form-label">
              Product Name
            </label>
            <input
              disabled
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
            <label htmlFor="productBenefits" className="form-label">
              Benefits
            </label>
            <input
              disabled
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
            <label htmlFor="productPremium" className="form-label">
              Premium
            </label>
            <input
              disabled
              type="text"
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
              type="text"
              className="form-select"
              id="uId"
              value={product.userId}
              placeholder="Enter User ID"
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
              value={product.providers}
              placeholder="Enter Providers"
              disabled
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
              onChange={(e) =>
                setProduct({ ...product, status: e.target.value })
              }
            />
            {console.log(product.status)}
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

export default EditBoughtProduct;
