import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

//LOGIN
router.post('/userlogin', (req, res) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: 'Logging in ' });
    if (result.length > 0) {
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err)
          return res.json({ loginStatus: false, Error: 'Wrong Password' });
        if (response) {
          const email = result[0].email;
          const id = result[0].id;
          const token = jwt.sign(
            { role: 'user', email: email, id: id },
            'jwt_secret_key',
            { expiresIn: '1d' }
          );
          res.cookie('token', token);
          return res.json({ loginStatus: true, id: id, email: email });
        }
      });
    } else {
      return res.json({
        loginStatus: false,
        Error: 'Wrong email, password or user not found',
      });
    }
  });
});

//USERS
router.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Getting All Users ' });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/users/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM users WHERE id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ Status: false, Error: 'Getting User by userId ' });
    return res.json({ Status: true, Result: result });
  });
});

//CLAIMS
router.get('/claims/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM claims WHERE userId = ?`;
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: 'Getting User Claims Details by userId ',
      });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/userclaims/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM claims WHERE id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: 'Getting User Claims Details by claimId ',
      });
    return res.json({ Status: true, Result: result });
  });
});

router.post('/useradd_claim', (req, res) => {
  const sql = `INSERT INTO claims (claimName, amount, notes, productId, providers, status, userId) VALUES (?)`;
  const values = [
    req.body.claimName,
    req.body.amount,
    req.body.notes,
    req.body.productId,
    req.body.providers,
    req.body.status,
    req.body.userId,
  ];
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Adding Claim ' + err });
    return res.json({ Status: true });
  });
});

router.put('/useredit_claim/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE claims
        SET claimName = ?, amount = ?, notes = ?, providerId = ?, providerName = ?, status = ?, userId = ?
        WHERE id = ?`;
  const values = [
    req.body.claimName,
    req.body.amount,
    req.body.notes,
    req.body.providerId,
    req.body.providerName,
    req.body.status,
    req.body.userId,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Editing Claim ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/delete_claim/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM claims WHERE id = ?';
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Deleting Claim ' + err });
    return res.json({ Status: true, Result: result });
  });
});

//PRODUCTS
router.get('/products/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM purchasedproducts WHERE userId = ?`;
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: 'Getting User Products Details by userId ',
      });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/userproducts/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM purchasedproducts WHERE id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: 'Getting User Products Details by claimId ',
      });
    return res.json({ Status: true, Result: result });
  });
});

router.post('/useradd_product', (req, res) => {
  const sql = `INSERT INTO purchasedproducts (productName, benefits, premium, productId, userId, allocation, providers, status) VALUES (?)`;
  const values = [
    req.body.productName,
    req.body.benefits,
    req.body.premium,
    req.body.productId,
    req.body.userId,
    req.body.allocation,
    req.body.providers,
    req.body.status,
  ];
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Adding Product ' + err });
    return res.json({ Status: true });
  });
});

router.put('/useredit_product/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE purchasedproducts
        SET productName = ?, benefits = ?, premium = ?, userId = ?, allocation = ?, providers = ?
        WHERE id = ?`;
  const values = [
    req.body.productName,
    req.body.benefits,
    req.body.premium,
    req.body.userId,
    req.body.allocation,
    req.body.providers,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err)
      return res.json({ Status: false, Error: 'Editing Product ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/delete_product/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM purchasedproducts WHERE id = ?';
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ Status: false, Error: 'Deleting Product ' + err });
    return res.json({ Status: true, Result: result });
  });
});

//COUNTS
router.get('/admin_count', (req, res) => {
  const sql = `SELECT COUNT(id) as admin from admin`;
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Admin Count ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/product_count/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT COUNT(id) as product from purchasedproducts WHERE userId = ?`;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Product Count ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/claim_count/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT COUNT(id) as claim from claims WHERE userId = ?`;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Claim Count ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/admin_records', (req, res) => {
  const sql = 'SELECT * FROM admin';
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Admin Records ' + err });
    return res.json({ Status: true, Result: result });
  });
});

//LOGOUT
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: true });
});

export { router as userRouter };
