import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { postController } from "./post.controller";
// import { multerUpload } from "../../config/multer.config";
import {  upload } from './../../config/multer.config';



const route = Router()

// create post
route.post('/create-post', upload.single('file'), checkAuth(...Object.values(Role)), postController.createPost)


//  get all post for admin and user
route.get('/get-post', checkAuth(...Object.values(Role)), postController.getpost)

// my post
route.get('/get-my-post' , checkAuth(...Object.values(Role)) , postController.getMyPost)

// update post
route.patch('/update-post/:id', upload.single('file'), checkAuth(...Object.values(Role)), postController.updatepost)









export const PostRoute = route