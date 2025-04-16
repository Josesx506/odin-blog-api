import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config';
import express from 'express';
import { corsOptions } from "./config/options.js";
import { passport } from './config/passport.js';
import { sessionMiddleware } from './config/session.js';
import { getMostRecent } from "./controller/index.js";
import { credentials } from "./middleware/credentials.js";
import { router as adminRouter } from "./routes/admin.js";
import { router as authRouter } from './routes/auth.js';
import { router as basicRouter } from './routes/basic.js';

const app = express();

// Load library middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(credentials);
app.options('/v1/*path', cors(corsOptions)); // Preflight cors
app.use(cors(corsOptions));

// Middleware for auth
app.use(sessionMiddleware);
app.use(passport.session());

// Routes
app.use('/v1/auth',authRouter);        // Authentication routes
app.use('/v1/cms',adminRouter);        // CMS author & admin routes
app.use('/v1/basic',basicRouter);      // Basic user routes
app.get('/v1/freemium',getMostRecent); // Free api route
app.get('/',(req,res)=>{
  res.send('Welcome to the blog express api')
})

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke and we could't resolve this request!");
});

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
  console.log(`Backend blog express server listening on port ${PORT}`);
})