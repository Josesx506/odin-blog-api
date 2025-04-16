import { Router } from "express";
import {
    createComment, createPost,
    deleteComment, deletePost,
    getOnePremiumPost, getPosts,
    updateOwnComment, updateOwnPost
} from "../controller/admin.js";
import { authJWT, authRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/utils.js";


const router = Router();

// Protect all the routes in this router with JWT middleware
router.use(authJWT);


// Restrict route access with RBAC middleware
router.get('/posts',
    authRole(["view:allPosts", "view:ownPosts"]), 
    getPosts);

router.get('/posts/:postId',
    validateRequest({params: ["postId"]}),
    authRole(["view:allPosts", "view:ownPosts"]), 
    getOnePremiumPost);

// CREATE
router.post('/posts',
    validateRequest({body: ["title","body","published"]}),
    authRole(["create:posts"]), 
    createPost);

router.post('/posts/:postId/comments',
    validateRequest({params: ["postId"], body: ["body"]}),
    authRole(["create:comments"]), 
    createComment);

// UPDATE
router.patch('/posts/:postId',
    validateRequest({params: ["postId"],body: ["title","body","published"]}),
    authRole(["update:ownPost"]), 
    updateOwnPost);

router.patch(
    '/posts/:postId/comments/:commentId',
    validateRequest({params: ["postId", "commentId"],body: ["body"]}),
    authRole(["update:ownComment"]), 
    updateOwnComment);

// DELETE
router.delete(
    '/posts/:postId',
    validateRequest({params: ["postId"]}),
    authRole(["delete:posts","delete:ownPost"]), 
    deletePost);

router.delete(
    '/posts/:postId/comments/:commentId',
    validateRequest({params: ["postId", "commentId"]}),
    authRole([,"delete:comments","delete:ownComment"]), 
    deleteComment);


export { router };


