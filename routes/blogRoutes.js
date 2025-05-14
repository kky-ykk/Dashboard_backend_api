import express from "express";
import multer from "multer";
import Blog from "../model/blog.js";
import User from "../model/user.js";
import path from "path";
import fs from "fs";
import { jwtAuthMiddleware } from "../utils/jwt.js";

const blogRoutes = express.Router();

// Ensure the folder exists
const imageFolder = path.resolve("images");
if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder);
}

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const upload = multer({ storage });

// Get all blogs of current user
blogRoutes.get("/", jwtAuthMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).populate("blogs");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user.blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Create blog (with image)
blogRoutes.post("/", jwtAuthMiddleware, upload.single("image"), async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const { title, heading, description } = req.body;
        const image = req.file?.path;

        const blog = await Blog.create({
            image,
            title,
            heading,
            description,
        });

        user.blogs.push(blog._id);
        await user.save();

        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update blog (optional image)
blogRoutes.put("/:id", jwtAuthMiddleware, upload.single("image"), async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            heading: req.body.heading,
            description: req.body.description,
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });

        res.json(updatedBlog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete blog
blogRoutes.delete("/:id", jwtAuthMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const blogsId = user.blogs;

        if (!blogsId.includes(req.params.id)) {
            return res.status(404).json({ message: "Blog ID not found in user's blogs" });
        }

        const blog=await Blog.findById(req.params.id);
        fs.unlink(blog?.image,
            (err => {
                if (err) console.log(err);
                else {
                    console.log(`\nDeleted file: ${blog.image}`);
                }
        }));

        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        user.blogs = user.blogs.filter(id => id.toString() !== req.params.id);
        await user.save();

        res.status(200).json({ message: "Blog deleted successfully", deletedBlog });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

blogRoutes.get("/:id", jwtAuthMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const blogsId = user.blogs;

        if (!blogsId.includes(req.params.id)) {
            return res.status(404).json({ message: "Blog ID not found in user's blogs" });
        }

        

        const blog = await Blog.findById(req.params.id);
        
        res.status(200).json({ message: "blog by id", blog });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export default blogRoutes;
