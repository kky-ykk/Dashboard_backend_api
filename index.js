import express from "express";
import connectDB from "./utils/db.js";
import router from "./routes/userRoute.js";
import blogRoutes from "./routes/blogRoutes.js";
import cors from "cors";
import referRoutes from "./routes/referRoutes.js";
import tierRoutes from "./routes/tierRoutes.js";

connectDB();

const app = express();
app.use(express.json());

app.use(cors());

// app.use('/images',express.static('images'));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Checked" });
});

app.use("/user", router);
app.use("/blogs", blogRoutes);

app.use("/tiers", tierRoutes);
app.use("/refer", referRoutes);


app.listen(3000, () => {
    console.log("Listening on port 3000");
});

