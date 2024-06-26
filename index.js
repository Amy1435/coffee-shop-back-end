import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import userRouter from "./routes/usersRoute.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoute.js";
import orderRouter from "./routes/orderRoute.js";
//import orderItemRouter from "./routes/orderItemRoutes.js";
import passport from "passport";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const { MONGODB_URI, CALL_BACK_URL, SESSION_SECRET } = process.env;
const PORT = process.env.PORT || 3000;

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server settings
const app = express();
app.use(morgan("dev"));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://coffee-shop-steel-zeta.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "None",
      secure: false,
    },
  }),
);
// to convert the images in static
app.use("/public/uploads", express.static(path.join(__dirname, "/public/uploads")));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoute);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/orders", orderRouter);
//app.use("/orderItems", orderItemRouter);

// Connect server / database
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log("Server is running!");
      console.log(PORT);
    });
  })
  .catch((err) => console.log(err));
