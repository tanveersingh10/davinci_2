import express from 'express';
import * as dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';
import Post from '../mongodb/models/post.js';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const router = express.Router();

//get all posts
router.route('/').get(async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({sucess: true, data: posts});
    } catch(error) {
        res.status(500).json({success: false, message: error});
    }
})

//create a post
router.route('/').post(async (req, res) => {
    try {
        const { name, prompt, photo } = req.body; // from the front end
        console.log("received details from front end")
        const photoUrl = await cloudinary.uploader.upload(photo);
        console.log("posted to cloudinary")
        const newPost = await Post.create({
            name,
            prompt, 
            photo: photoUrl.url
        })
        console.log("added to mongodb")
        res.status(201).json({success: true, data: newPost});
    } catch(error) {
        console.log(error)
        res.status(500).json({success: false, message: error});
    }
})


export default router;
