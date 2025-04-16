import {
  createDBComment,
  getAllPublishedPosts,
  getOnePublishedPostById,
  deleteOwnCommentDB,
  updateComment
} from "./prismadb.js";

async function getPublishedPosts(req, res) {
  try {
    const posts = await getAllPublishedPosts();
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(404).json({ message: "Error fetching posts" });
  }
}

async function getOnePost(req, res) {
  const { postId } = req.params;
  try {
    const post = await getOnePublishedPostById(postId);
    return res.status(200).json( post );
  } catch (err) {
    return res.status(404).json({ message: `Error fetching post ${postId}` });
  }
}

async function createComment(req, res) {
  try {
    const { postId } = req.params;
    const { body } = req.body;
    const comment = await createDBComment(req.user.id, postId, body);
    return res.status(200).json(comment);
  } catch (err) {
    return res.status(404).json({ message: "Comment creation failed or invalid post id" });
  }
}

async function updateOwnComment(req,res) {
  try {
    const { postId, commentId } = req.params;
    const { body } = req.body;
    
    const comment = await updateComment(req.user.id, postId, commentId, body);
    
    return res.status(200).json(comment);

  } catch (err) {
    if (err.code === 'P2018') {
      return res.status(403).json({ message: "Forbidden: You don't have permission to update this comment" });
    }
    return res.status(404).json({ message: "NotFound Error: comment update failed" });
  }
}

async function deleteOwnComment(req,res) {
  try {
    const { postId, commentId } = req.params;

    const post = await deleteOwnCommentDB(req.user.id, commentId);

    return res.status(200).json({ message: "Comment deleted successfully", post });
  } catch(err) {
    // Custom error for insufficient author permissions
    if (err.code === 'P2018') {
      return res.status(403).json({ message: "Forbidden: You don't have permission to delete this comment" });
    }
    return res.status(404).json({ message: "NotFound Error: comment deletion failed" });
  }
}


export { createComment, deleteOwnComment, getOnePost, getPublishedPosts, updateOwnComment };

