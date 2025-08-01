const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const router = Router();
const Blog = require('../models/blog');
const Comment = require('../models/comments');

// ✅ Use Cloudinary storage instead of local disk
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    });
});

router.post('/', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;

    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: req.file.path, // ✅ Cloudinary URL
    });

    return res.redirect(`/blog/${blog._id}`);
});

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    console.log("blog: ", blog);
    return res.render('blog', {
        user: req.user,
        blog,
        comments,
    });
});

router.post('/comment/:blogId', async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;