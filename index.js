import express from "express";
import connectDB from "./utils/db.js";
import router from "./routes/userRoute.js";
import blogRoutes from "./routes/blogRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import blogRoutes from "./routes/blogRoutes.js";

// import tierRoutes from "./routes/tierRoutes.js";
// import referRoutes from "./routes/referRoutes.js";

connectDB();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Checked" });
});

app.use("/user", router);
app.use("/blogs", blogRoutes);

// app.use("/tiers", tierRoutes);
// app.use("/refer", referRoutes);


app.listen(3000, () => {
    console.log("Listening on port 3000");
});
