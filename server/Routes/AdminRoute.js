import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import multer from 'multer';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//LOGIN
router.post('/login', (req, res) => {
  const sql = `SELECT * FROM admin WHERE email = ? AND password = ?`;
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err)
      return res.json({ loginStatus: false, Error: 'Login error' + err });
    if (result.length > 0) {
      const email = result[0].email;
      const id = result[0].id;
      const allocationTotal = result[0].allocationTotal;
      const claimTotal = result[0].claimTotal;
      const processedProducts = result[0].processedProducts;
      const processedClaims = result[0].processedClaims;
      const token = jwt.sign(
        { role: 'admin', email: email, id: id },
        'jwt_secret_key',
        { expiresIn: '1d' }
      );
      res.cookie('token', token);
      return res.json({
        loginStatus: true,
        id: id,
        email: email,
        allocationTotal: allocationTotal,
        claimTotal: claimTotal,
        processedProducts: processedProducts,
        processedClaims: processedClaims,
      });
    } else {
      return res.json({ loginStatus: false, Error: 'Invalid credentials' });
    }
  });
});

// //ALLOCATION TOTAL
router.put('/updateAllocationTotal/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE admin SET allocationTotal = ?, claimTotal = ?, processedProducts = ?, processedClaims = ?
   WHERE id = ?`;
  const values = [
    req.body.allocationTotal,
    req.body.claimTotal,
    req.body.processedProducts,
    req.body.processedClaims,
  ];
  console.log(values + ' here ' + id);
  con.query(sql, [...values, id], (err, result) => {
    if (err)
      return res.json({ Status: false, Error: 'Allocation Total ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/allocationTotal', (req, res) => {
  const sql = `SELECT allocationTotal FROM admin`;
  con.query(sql, (err, result) => {
    if (err)
      return res.json({ Status: false, Error: 'Allocation Total ' + err });
    return res.json({ Status: true, Result: result });
  });
});

//PRODUCT BALANCES
router.put('/update_balance/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const sql = `UPDATE purchasedproducts SET balance = ? WHERE userId = ?`;
  const values = [req.body.balance];
  console.log(req.body.balance + ' here ' + userId);

  con.query(sql, [...values, userId], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: 'Update Product Balance ' + err,
      });
    return res.json({ Status: true, Result: result });
  });
});

//PRODUCT LIST
router.get('/products', (req, res) => {
  const sql = 'SELECT * FROM productcatalog';
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Getting All Products ' });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/products/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM productcatalog WHERE id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Product ID ' });
    return res.json({ Status: true, Result: result });
  });
});

router.post('/add_product', (req, res) => {
  const sql = `INSERT INTO productcatalog (productName, description, premium, benefits, allocation, providers, providersEmail) VALUES (?)`;
  const values = [
    req.body.productName,
    req.body.description,
    req.body.premium,
    req.body.benefits,
    req.body.allocation,
    req.body.providers,
    req.body.providersEmail,
  ];
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Adding Product ' + err });
    return res.json({ Status: true });
  });
});

router.put('/edit_product/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE productcatalog
        SET productName = ?, description = ?, premium = ?, benefits = ?, allocation = ?, providers = ?
        WHERE id = ?`;
  const values = [
    req.body.productName,
    req.body.description,
    req.body.premium,
    req.body.benefits,
    req.body.allocation,
    req.body.providers,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Edit Product ' + err });
    return res.json({ Status: true, Result: result });
  });
});

//BOUGHT PRODUCTS
router.get('/boughtproducts', (req, res) => {
  const sql = `SELECT * FROM purchasedproducts`;
  con.query(sql, (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: 'Getting Consumed Products ' + err,
      });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/boughtproducts/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM purchasedproducts WHERE id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Consumed Product ID ' });
    return res.json({ Status: true, Result: result });
  });
});

router.put('/approve_boughtproduct/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE purchasedproducts
        SET status = 'APPROVED', balance = ?
        WHERE id = ?`;
  const values = [req.body.balance];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Approve Claim ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.put('/deny_boughtproduct/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE purchasedproducts
        SET status = 'DENIED'
        WHERE id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Deny Claim ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.post('/add_boughtproduct', (req, res) => {
  // First, check if the product already exists for the user
  const checkSql =
    'SELECT * FROM purchasedproducts WHERE productId = ? AND userId = ?';
  const checkValues = [req.body.productId, req.body.userId];

  con.query(checkSql, checkValues, (checkErr, checkResult) => {
    if (checkErr) {
      return res.json({
        Status: false,
        Error: 'Error checking for existing product: ' + checkErr,
      });
    }

    if (checkResult.length > 0) {
      // If the product already exists for the user, return an error message
      return res.json({
        Status: false,
        Error: 'Product already added for this user.',
      });
    } else {
      const sql = `INSERT INTO purchasedproducts (productId, productName, benefits, premium, userId, allocation, providers, status) VALUES (?)`;
      const values = [
        req.body.productId,
        req.body.productName,
        req.body.benefits,
        req.body.premium,
        req.body.userId,
        req.body.allocation,
        req.body.providers,
        req.body.status,
      ];

      con.query(sql, [values], (err, result) => {
        if (err) {
          return res.json({
            Status: false,
            Error: 'Adding Product Failed: ' + err,
          });
        }

        return res.json({
          Status: true,
          Message: 'Product successfully added.',
        });
      });
    }
  });
});

router.put('/edit_boughtproduct/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE purchasedproducts
        SET productId = ?, productName = ?, benefits = ?, premium = ?,  userId = ?, allocation = ?, balance = ?, providers = ?, status = ?
        WHERE id = ?`;
  const values = [
    req.body.productId,
    req.body.productName,
    req.body.benefits,
    req.body.premium,
    req.body.userId,
    req.body.allocation,
    req.body.balance,
    req.body.providers,
    req.body.status,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err)
      return res.json({ Status: false, Error: 'Edit Consumed Product ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/delete_boughtproduct/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM purchasedproducts WHERE id = ?';
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: 'Delete Purchased Product ' + err,
      });
    return res.json({ Status: true, Result: result });
  });
});

//ADMIN
router.get('/admin', (req, res) => {
  const sql = 'SELECT * FROM admin';
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Getting All Admins ' });
    return res.json({ Status: true, Result: result });
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

//image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/Images');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
//end image upload

router.post('/add_user', upload.single('image'), (req, res) => {
  const sql = `INSERT INTO users (name, age, gender, email, password, address, image) VALUES (?)`;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: 'Hashing ' });
    const values = [
      req.body.name,
      req.body.age,
      req.body.gender,
      req.body.email,
      hash,
      req.body.address,
      req.file.filename,
    ];
    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Status: false, Error: 'Adding User ' + err });
      return res.json({ Status: true });
    });
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

router.put('/edit_user/:id', upload.single('image'), (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE users
        SET name = ?, age = ?, gender = ?, email = ?, address = ?, image = ?
        WHERE id = ?`;
  const values = [
    req.body.name,
    req.body.age,
    req.body.gender,
    req.body.email,
    req.body.address,
    req.file.filename,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Edit User ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/delete_user/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Delete User ' + err });
    return res.json({ Status: true, Result: result });
  });
});

//CLAIMS
router.get('/claims', (req, res) => {
  const sql = 'SELECT * FROM claims';
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Getting All Claims ' });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/claims/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM claims WHERE id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: 'Getting User Claims Details by Claim Id ',
      });
    return res.json({ Status: true, Result: result });
  });
});

router.put('/approve_claim/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE claims
        SET status = 'APPROVED'
        WHERE id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Approve Claim ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.put('/deny_claim/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE claims
        SET status = 'DENIED'
        WHERE id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Deny Claim ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.put('/pendingclaim/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE claims
        SET status = 'PENDING'
        WHERE id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Deny Claim ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.post('/add_claim', (req, res) => {
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

router.put('/edit_claim/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE claims
        SET claimName = ?, amount = ?, notes = ?, productId = ?, providers = ?, status = ?, userId = ?
        WHERE id = ?`;
  const values = [
    req.body.claimName,
    req.body.amount,
    req.body.notes,
    req.body.productId,
    req.body.providers,
    req.body.status,
    req.body.userId,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Edit Claim ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/delete_claim/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM claims WHERE id = ?';
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Delete Claim ' + err });
    return res.json({ Status: true, Result: result });
  });
});

//COUNTS
router.get('/admin_count', (req, res) => {
  const sql = 'SELECT COUNT(id) as admin from admin';
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Admin Count ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/claim_count', (req, res) => {
  const sql = 'SELECT COUNT(id) as claim from claims';
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Claim Count ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/user_count', (req, res) => {
  const sql = 'SELECT COUNT(id) as user from users';
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: 'User Count ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/boughtproduct_count', (req, res) => {
  const sql = 'SELECT COUNT(id) as product from purchasedproducts';
  con.query(sql, (err, result) => {
    if (err)
      return res.json({ Status: false, Error: 'Bought Products Count ' + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/product_count', (req, res) => {
  const sql = 'SELECT COUNT(id) as product from productcatalog';
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Product Count ' + err });
    return res.json({ Status: true, Result: result });
  });
});

//LOGOUT
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: true });
});

export { router as adminRouter };
