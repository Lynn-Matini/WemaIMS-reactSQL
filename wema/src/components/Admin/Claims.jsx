import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

function Claims() {
  const componentRef = useRef();
  const [claim, setClaim] = useState([]);
  const [product, setProduct] = useState([]);
  const [processedClaims, setProcessedClaims] = useState({});
  const [claimTotal, setClaimTotal] = useState(0);
  const processedProducts = localStorage.getItem('processedProducts');

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

    axios
      .get('http://localhost:3000/admin/claims')
      .then((result) => {
        if (result.data.Status) {
          setClaim(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    const savedClaimTotal = localStorage.getItem('claimTotal');
    if (savedClaimTotal) {
      setClaimTotal(Number(savedClaimTotal));
    }
    const savedProcessedClaims = localStorage.getItem('processedClaims');
    if (savedProcessedClaims) {
      try {
        const processedClaims = JSON.parse(savedProcessedClaims);
        setProcessedClaims(processedClaims);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('claimTotal', claimTotal.toString());
    localStorage.setItem('processedClaims', JSON.stringify(processedClaims));
  }, [claimTotal, processedClaims]);

  const handleApproveClaim = (id, productId, amount, userId) => {
    if (processedClaims[id]) return; // Prevent multiple approvals/denials

    const productToUpdate = product.find((prod) => prod.id === productId);
    if (!productToUpdate) {
      console.error(`Product with ID ${productId} not found.`);
      return;
    }
    // console.log(productToUpdate);

    axios
      .put(`http://localhost:3000/admin/approve_claim/${id}`)
      .then((result) => {
        if (result.data.Status) {
          if (productToUpdate.balance >= amount) {
            setClaimTotal((prevClaimTotal) => {
              const newTotal = prevClaimTotal + amount;
              localStorage.setItem('claimTotal', newTotal.toString());
              return newTotal;
            });

            // Transfer allocation balance to user
            axios
              .put(`http://localhost:3000/admin/update_balance/${userId}`, {
                balance: productToUpdate.balance - amount,
              })
              .then((result) => {
                if (result.data.Status) {
                  setProcessedClaims((claim) => {
                    const updatedProcessedClaims = {
                      ...claim,
                      [id]: 'APPROVED',
                    };
                    return updatedProcessedClaims;
                  });
                  setProduct((prevProduct) =>
                    prevProduct.map((product) =>
                      product.id === productId
                        ? { ...product, balance: product.balance - amount }
                        : product
                    )
                  );
                  console.log('Allocation balance transferred to user.');
                } else {
                  alert(result.data.Error);
                  console.log(result.data.Error);
                }
              })
              .catch((err) => console.log(err));

            setProcessedClaims((claim) => {
              const updatedProcessedClaims = { ...claim, [id]: 'APPROVED' };
              localStorage.setItem(
                'processedClaims',
                JSON.stringify(updatedProcessedClaims)
              );
              return updatedProcessedClaims;
            });
            alert('Claim approved successfully.');
            window.location.reload();
          } else {
            alert(
              'Your purchased product balance is insufficient. Sorry, we cannot approve this product'
            );
            axios
              .put(`http://localhost:3000/admin/deny_claim/${id}`)
              .then((result) => {
                if (result.data.Status) {
                  setProcessedClaims((claim) => {
                    const updatedProcessedClaims = {
                      ...claim,
                      [id]: 'DENIED',
                    };
                    localStorage.setItem(
                      'processedClaims',
                      JSON.stringify(updatedProcessedClaims)
                    );
                    return updatedProcessedClaims;
                  });
                  window.location.reload();
                } else {
                  alert(result.data.Error);
                  console(result.data.Error);
                }
              })
              .catch((err) => console.log(err));
          }
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDenyClaim = (id) => {
    if (processedClaims[id]) return; // Prevent multiple approvals/denials

    axios
      .put(`http://localhost:3000/admin/deny_claim/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setProcessedClaims((claim) => {
            const updatedProcessedClaims = { ...claim, [id]: 'DENIED' };
            localStorage.setItem(
              'processedClaims',
              JSON.stringify(updatedProcessedClaims)
            );
            return updatedProcessedClaims;
          });
          alert('Claim unfortunately denied.');
          window.location.reload();
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
        console.log(processedProducts[id]);
        // console.log(processedClaims[id]);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this claim?')) {
      axios
        .delete(`http://localhost:3000/admin/delete_claim/${id}`)
        .then((result) => {
          if (result.data.Status) {
            alert('Claim deleted successfully.');
            window.location.reload();
          } else {
            alert(result.data.Error);
            console(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Claims made',
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
        backgroundColor: 'red',
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
        <h3>Claim List</h3>
      </div>
      <div className="mt-3">
        <Link to="/add_claim" className="btn btn-success">
          Add Claim
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
                <th>Claim ID</th>
                <th>Bought Product ID</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Provider Name</th>
                <th>User ID</th>
                <th>Status</th>
                <th></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {claim.map((c, index) => (
                <tr key={index}>
                  <td>{c.id}</td>
                  <td>{c.productId}</td>
                  <td>{c.claimName}</td>
                  <td>{c.amount}</td>
                  <td>{c.notes}</td>
                  <td>{c.providers}</td>
                  <td>{c.userId}</td>
                  <td style={makeStyles(c.status)}>{c.status}</td>
                  <td></td>
                  {c.status === 'PENDING' && (
                    <td>
                      <div className="mb-3 d-flex justify-content-between">
                        <Link
                          onClick={() =>
                            handleApproveClaim(
                              c.id,
                              c.productId,
                              c.amount,
                              c.userId
                            )
                          }
                          className="btn btn-secondary btn-sm w-50 d-flex justify-content-center approve"
                        >
                          Approve
                        </Link>
                        <Link
                          onClick={() => handleDenyClaim(c.id)}
                          className="btn btn-secondary btn-sm deny"
                        >
                          &nbsp;Deny&nbsp;
                        </Link>
                      </div>
                      <div className="d-flex justify-content-between">
                        <Link
                          to={`/edit_claim/` + c.id}
                          className="btn btn-secondary btn-sm w-50 edit"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-secondary btn-sm delete"
                          onClick={() => handleDelete(c.id)}
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

export default Claims;
