import { Router } from "express";
import {
  createComment, getOnePost, getPublishedPosts,updateOwnComment,deleteOwnComment
} from "../controller/basic.js";
import { authJWT, authRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/utils.js";


const router = Router();

// Protect all the routes in this router with JWT middleware
router.use(authJWT);

// Restrict route access with RBAC middleware
router.get('/posts', authRole(["view:posts"]), getPublishedPosts);
router.get('/posts/:postId', authRole(["view:posts"]), getOnePost);

// Create, Edit and Delete comments. No dedicated comment view page
router.post('/posts/:postId/comments',
  validateRequest({ params: ["postId"], body: ["body"] }),
  authRole(["create:comments"]),
  createComment);

router.patch(
  '/posts/:postId/comments/:commentId',
  validateRequest({params: ["postId", "commentId"],body: ["body"]}),
  authRole(["update:ownComment"]), 
  updateOwnComment);

router.delete(
  '/posts/:postId/comments/:commentId',
  validateRequest({params: ["postId", "commentId"]}),
  authRole([,"delete:comments","delete:ownComment"]), 
  deleteOwnComment);


export { router }
