import cors from 'cors';
import express from 'express';
import { adminRouter } from './Routes/AdminRoute.js';
import { userRouter } from './Routes/UserRoute.js';
import Jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser';

const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173'],
    // headers: ['Content-Type', 'application/json'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Handle preflight requests
// app.options('*', cors());

app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use(express.static('Public'));

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    Jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
      if (err) return res.json({ Status: false, Error: 'Wrong Token' });
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    return res.json({ Status: false, Error: 'Not Autheticated' });
  }
};
app.get('/verify', verifyUser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });
