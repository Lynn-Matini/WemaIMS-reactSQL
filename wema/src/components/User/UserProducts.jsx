import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

function UserProducts() {
  const componentRef = useRef();
  const [product, setProduct] = useState([]);
  const [premium, setPremium] = useState([]);
  const id = localStorage.getItem('userId');

  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/pendingproducts/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setPremium(result.data.Result);
          console.log(result.data.Result);
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get(`http://localhost:3000/user/userproducts/${id}`)
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

  // Function to calculate total premium
  const totalPremium = premium.reduce(
    (acc, curr) => acc + Number(curr.premium),
    0
  );

  const generatePDF = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Purchased Products',
    onAfterPrint: () => {
      alert('PDF Generated Successfully');
    },
  });

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
        <h3>Purchased Products</h3>
      </div>
      <div className="productContainer">
        <Link to="/useradd_product" className="btn btn-success addProduct">
          Add Product
        </Link>
        <button
          to="/useradd_product"
          onClick={generatePDF}
          className="btn btn-success addProduct ms-1"
        >
          Get PDF
        </button>
        <div className="paymentBox">
          <p>
            Paybill: <span className="paymentText"> 123123</span>
            <br />
            Account Number:
            <span className="paymentText"> UID{id}</span>
            <br />
            Total Premium:{' '}
            <span className="paymentText"> {totalPremium.toFixed()}</span>
          </p>
        </div>
      </div>
      <hr />
      <div className="mt-3">
        <div ref={componentRef} style={{ width: '100%' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Bought Product ID</th>
                <th>Product Name</th>
                <th>Benefits</th>
                <th>Premium</th>
                <th>User ID</th>
                <th>Allocation</th>
                <th>Balance</th>
                <th>Providers</th>
                {/* <th>Provider&apos;s Tel.</th> */}
                <th>Status</th>
                <th></th>
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
                  <td>{p.allocation}</td>
                  <td>{p.balance}</td>
                  <td>{p.providers}</td>
                  {/* <td>{p.providersTel}</td> */}
                  <td></td>
                  <td style={makeStyles(p.status)}>{p.status}</td>
                  <td></td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p.id)}
                      disabled={p.status !== 'PENDING'}
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
    </div>
  );
}

export default UserProducts;
