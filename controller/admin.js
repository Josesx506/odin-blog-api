import { ROLES } from "../config/roles.js";
import {
  createDBComment, createDBPost,
  deleteCommentById, deleteOwnCommentDB,
  deleteOwnPost, deletePostById,
  getAllPosts, getOnePostById,
  getOnePostByIdAndAuthor,
  getPostsByAuthorId, updateComment,
  updatePost
} from "./prismadb.js";


async function getPosts(req,res) {
  try {
    let posts;
    
    if (ROLES[req.user.role].includes("view:allPosts")) {
        posts = await getAllPosts();
    }
    else if (ROLES[req.user.role].includes("view:ownPosts")) {
        posts = await getPostsByAuthorId(req.user.id);
    }
    return res.status(200).json(posts);

  } catch (err) {
    return res.status(404).json({ message: "Error fetching posts" });
  }
}

async function getOnePremiumPost(req,res) {
  const { postId } = req.params;

  try {
    let post;
    
    if (ROLES[req.user.role].includes("view:allPosts")) {
      post = await getOnePostById(postId);
    }
    else if (ROLES[req.user.role].includes("view:ownPosts")) {
      post= await getOnePostByIdAndAuthor(req.user.id, postId);
    }
    
    return res.status(200).json( post );

  } catch (err) {

    if (err.code === 'P2018') {
      return res.status(403).json({ message: "Forbidden: You don't have permission to view this post"});
    }

    return res.status(404).json({ message: `Error fetching post ${postId}` });
  }
}

async function createPost(req,res) {
  try {
    const { title, body, published } = req.body;
    const post = await createDBPost(req.user.id, title, body, published);
    return res.status(200).json(post);
  } catch(err) {
    return res.status(404).json({ message: "Post creation failed" });
  }
}

async function createComment(req,res) {
  try {
    const { postId } = req.params; 
    const { body } = req.body;
    const comment = await createDBComment(req.user.id, postId, body);
    return res.status(200).json(comment);
  } catch(err) {
    return res.status(404).json({ message: "Comment creation failed or invalid post id" });
  }
}


async function updateOwnPost(req,res) {
  try {
    const { postId } = req.params;
    const { title, body, published } = req.body;
    
    const post = await updatePost(req.user.id, postId, title, body, published);
    
    return res.status(200).json(post);

  } catch (err) {
    // Custom error for insufficient author permissions
    if (err.code === 'P2018') {
      return res.status(403).json({ message: "Forbidden: You don't have permission to update this post"});
    }
    return res.status(404).json({ message: "NotFound Error: post update failed" });
  }
}


async function updateOwnComment(req,res) {
  try {
    const { postId, commentId } = req.params;
    const { body } = req.body;
    
    const comment = await updateComment(req.user.id, postId, commentId, body);
    
    return res.status(200).json(comment);

  } catch (err) {
    // Custom error for insufficient author permissions
    if (err.code === 'P2018') {
      return res.status(403).json({ message: "Forbidden: You don't have permission to update this comment" });
    }
    return res.status(404).json({ message: "NotFound Error: comment update failed" });
  }
}


async function deletePost(req,res) {
  try {
    const { postId } = req.params;
  
    let post;
    if (ROLES[req.user.role].includes("delete:posts")) {
      post = await deletePostById(postId);
    }
    else if (ROLES[req.user.role].includes("delete:ownPost")) {
      post = await deleteOwnPost(req.user.id, postId);
    }

    return res.status(200).json({ message: "Post deleted successfully", post });
  } catch(err) {
      // Custom error for insufficient author permissions
      if (err.code === 'P2018') {
        return res.status(403).json({ message: "Forbidden: You don't have permission to delete this post" });
      }
    return res.status(404).json({ message: "NotFound Error: post deletion failed" });
  }
}

async function deleteComment(req,res) {
  try {
    const { postId, commentId } = req.params;
  
    let post;
    if (ROLES[req.user.role].includes("delete:comments")) {
      post = await deleteCommentById(commentId);
    }
    else if (ROLES[req.user.role].includes("delete:ownComment")) {
      post = await deleteOwnCommentDB(req.user.id, commentId);
    }

    return res.status(200).json({ message: "Comment deleted successfully", post });
  } catch(err) {
    // Custom error for insufficient author permissions
    if (err.code === 'P2018') {
      return res.status(403).json({ message: "Forbidden: You don't have permission to delete this comment" });
    }
    return res.status(404).json({ message: "NotFound Error: comment deletion failed" });
  }
}


export {
  createComment, createPost, deleteComment, deletePost,
  getOnePremiumPost, getPosts, updateOwnComment, updateOwnPost
};

