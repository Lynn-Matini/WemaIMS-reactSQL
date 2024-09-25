import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

function BoughtProducts() {
  const componentRef = useRef();
  const [product, setProduct] = useState([]);
  const [allocationTotal, setAllocationTotal] = useState(0);
  const [balanceTotal, setBalanceTotal] = useState(0);
  const [processedProducts, setProcessedProducts] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/boughtproducts')
      .then((result) => {
        if (result.data.Status) {
          setProduct(result.data.Result);
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    const savedAllocationTotal = localStorage.getItem('allocationTotal');
    if (savedAllocationTotal) {
      setAllocationTotal(Number(savedAllocationTotal));
    }
    const savedProcessedProducts = localStorage.getItem('processedProducts');
    if (savedProcessedProducts) {
      try {
        const processedProducts = JSON.parse(savedProcessedProducts);
        setProcessedProducts(processedProducts);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('allocationTotal', allocationTotal.toString());
    localStorage.setItem(
      'processedProducts',
      JSON.stringify(processedProducts)
    );
  }, [allocationTotal, processedProducts]);

  const handleApproveProduct = (id, allocation) => {
    if (processedProducts[id]) return; // Prevent multiple approvals/denials

    axios
      .put(`http://localhost:3000/admin/approve_boughtproduct/${id}`, {
        balance: balanceTotal + allocation,
      })
      .then((result) => {
        if (result.data.Status) {
          setProduct((prevProduct) => {
            return prevProduct.map((product) => {
              if (product.id === id) {
                return { ...product, balance: product.balance + allocation };
              }
              return product;
            });
          });
          console.log(product);

          setAllocationTotal((prevAllocationTotal) => {
            const newTotal = prevAllocationTotal + allocation;
            localStorage.setItem('allocationTotal', newTotal.toString());
            return newTotal;
          });

          setProcessedProducts((product) => {
            const updatedProcessedProducts = { ...product, [id]: 'APPROVED' };
            localStorage.setItem(
              'processedProducts',
              JSON.stringify(updatedProcessedProducts)
            );
            return updatedProcessedProducts;
          });
          alert('Product approved successfully');
          window.location.reload();
          setBalanceTotal(0);
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDenyProduct = (id) => {
    if (processedProducts[id]) return; // Prevent multiple approvals/denials

    axios
      .put(`http://localhost:3000/admin/deny_boughtproduct/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setProcessedProducts((prev) => {
            const updatedProcessedProducts = { ...prev, [id]: 'DENIED' };
            localStorage.setItem(
              'processedProducts',
              JSON.stringify(updatedProcessedProducts)
            );
            return updatedProcessedProducts;
          });
          alert('Product unfortunately denied.');
          window.location.reload();
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  console.log(allocationTotal + ' Allocation Total');
  console.log(processedProducts);

  const handleDelete = (id, allocation) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`http://localhost:3000/admin/delete_boughtproduct/${id}`)
        .then((result) => {
          if (result.data.Status) {
            if (
              processedProducts[id] && {
                ...processedProducts,
                [id]: 'APPROVED',
              }
            ) {
              setAllocationTotal((prevAllocationTotal) => {
                const newTotal = prevAllocationTotal - allocation;
                localStorage.setItem('allocationTotal', newTotal.toString());
                return newTotal;
              });
            }

            setProcessedProducts((prevProcessedProducts) => {
              const updatedProcessedProducts = { ...prevProcessedProducts };
              delete updatedProcessedProducts[id];
              localStorage.setItem(
                'processedProducts',
                JSON.stringify(updatedProcessedProducts)
              );
              return updatedProcessedProducts;
            });

            alert('Product deleted successfully');
            window.location.reload();
          } else {
            alert(result.data.Error);
            console.log(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

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
        <h3>Consumed Products</h3>
      </div>
      <div className="mt-3">
        <Link to="/add_boughtproduct" className="btn btn-success">
          Buy Product
        </Link>
        <button
          to="/useradd_product"
          onClick={generatePDF}
          className="btn btn-success ms-1"
        >
          Get PDF
        </button>
      </div>
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
                <th>Status</th>
                <th></th>
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
                  <td>{p.balance}</td>
                  <td>{p.providers}</td>
                  <td style={makeStyles(p.status)}>{p.status}</td>
                  <td></td>
                  {p.status === 'PENDING' && (
                    <td>
                      <div className="mb-3 d-flex justify-content-between">
                        <Link
                          onClick={() =>
                            handleApproveProduct(p.id, p.allocation)
                          }
                          className="btn btn-secondary btn-sm w-50 d-flex justify-content-center approve"
                        >
                          Approve
                        </Link>
                        <Link
                          onClick={() => handleDenyProduct(p.id, p.allocation)}
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
                          onClick={() => handleDelete(p.id, p.allocation)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BoughtProducts;
