import { prisma } from "../config/prisma.js";
import { PrismaCustomError } from "../utils.js";


async function createGenericUser(username, email, hashedPassword) {
  const user = await prisma.blogUser.create({
    data: {
      name: username,
      email: email.toLowerCase(),
      password: hashedPassword
    },
    select: {
      id: true,
      email: true
    }
  })
  return user;
}

async function createUserWithRole(username, email, hashedPassword, role) {
  const user = await prisma.blogUser.create({
    data: {
      name: username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role.toUpperCase()
    },
    select: {
      id: true,
      email: true
    }
  })
  return user;
}

async function retrieveUserByEmail(email) {
  const user = await prisma.blogUser.findFirst({
    where: {
      email: email.toLowerCase()
    }
  })
  return user;
}

async function retrieveUserById(id) {
  const user = await prisma.blogUser.findUnique({
    where: {
      id: id
    }
  })
  return user;
}

async function retrieveUserByToken(refreshToken) {
  const user = await prisma.blogUser.findFirst({
    where: {
      token: refreshToken
    }
  })
  return user;
}

async function updateRefreshToken(id, token) {
  const user = await prisma.blogUser.update({
    where: {
      id: id
    },
    data: {
      token: token
    }
  })
  return user;
}

async function getOnePostById(postId) {
  const post = await prisma.blogPost.findUnique({
    where: { 
      id: Number(postId) 
    },
    include: {
      comments: { 
        include: {
          author: { select: { name: true }} },
          orderBy: { updatedAt: 'desc' },
        },
      author: {
        select: { name: true }
      }
    }
  });
  if (post) {
    post.author = post.author.name
    post.comments = post.comments.map(comment => ({
      ...comment, author: comment.author?.name || null
    }));
  } else {
    throw new PrismaCustomError("Post not found", "P2025");
  }
  return post;
}

async function getOnePostByIdAndAuthor(authorId, postId) {
  const post = await prisma.blogPost.findUnique({
    where: { id: Number(postId) },
    include: {
      comments: { 
        include: {
          author: { select: { name: true }} },
          orderBy: { updatedAt: 'desc' },
        },
      author: { select: { name: true } }
    }
  })

  if (!post) {
    throw new PrismaCustomError("Post not found", "P2025");
  }

  // Check if user authored the post
  if (post.authorId !== Number(authorId)) {
    throw new PrismaCustomError("Insufficient permissions", "P2018");
  }

  if (post) {
    post.author = post.author.name
    post.comments = post.comments.map(comment => ({
      ...comment, author: comment.author?.name || null
    }));
  }
  return post;
}

async function getOnePublishedPostById(postId) {
  const post = await prisma.blogPost.findUnique({
    where: { 
      id: Number(postId)
    },
    include: {
      comments: { 
        include: {
          author: { select: { name: true }} },
          orderBy: { updatedAt: 'desc' },
        },
      author: {
        select: { name: true }
      }
    }
  });
  if (post && post.published) {
    post.author = post.author.name
    post.comments = post.comments.map(comment => ({
      ...comment, author: comment.author?.name || null
    }));
    return post;
  } 
  else {
    // Prevent unpublished posts from leaking
    throw new PrismaCustomError("Post not found", "P2025");
  }
}

async function getSomePosts(num) {
  const posts = await prisma.blogPost.findMany({
    take: num,
    where: {
      published: true,
    },
    include: {
      comments: true,
      author: {
        select: { name: true }
      }
    },
    orderBy: {
      updatedAt: 'desc',
    }
  }).then(posts => {
    return posts.map(post => ({ ...post, author: post.author.name }))
  });
  let thumbnails;
  if (posts) {
    thumbnails = posts.map(post => {
      let first3Sentences = post.body;
      first3Sentences = first3Sentences.replace(/\n(?<=\s*)/g, "").trim();
      first3Sentences = first3Sentences.split(". ").slice(0, 2).join(". ") + ".";
      const maskedComments = post.comments.map(() => ({}));
      return { ...post, body: first3Sentences, comments: maskedComments };
    })
  }
  return thumbnails;
}

async function getAllPosts() {
  const posts = await prisma.blogPost.findMany({
    include: {
      comments: true,
      author: {
        select: { name: true }
      }
    },
    orderBy: {
      updatedAt: 'desc',
    }
  }).then(posts => {
    return posts.map(post => ({ ...post, author: post.author.name }))
  });
  return posts;
}

async function getAllPublishedPosts() {
  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
    },
    include: {
      comments: true,
      author: {
        select: { name: true }
      }
    },
    orderBy: {
      updatedAt: 'desc',
    }
  }).then(posts => {
    return posts.map(post => ({ ...post, author: post.author.name }))
  });
  return posts;
}

async function getPostsByAuthorId(authorId) {
  const posts = await prisma.blogPost.findMany({
    where: {
      authorId: authorId,
    },
    include: {
      comments: true,
      author: {
        select: { name: true }
      }
    },
    orderBy: {
      updatedAt: 'desc',
    }
  }).then(posts => {
    return posts.map(post => ({ ...post, author: post.author.name }))
  });
  return posts;
}

async function createDBPost(authorId, title, body, published) {
  const post = await prisma.blogPost.create({
    data: {
      title: title,
      body: body,
      published: published,
      authorId: Number(authorId),
    },
    include: {
      author: {
        select: { name: true,},
      },
    },
  })
  if (post) { 
    post.author = post.author.name 
  }
  return post
}

async function createDBComment(authorId, postId, body) {
  const validPost = await prisma.blogPost.findUnique({
    where: { id: Number(postId) }
  });

  if (!validPost) {
    throw new PrismaCustomError("Post not found", "P2025");
  }

  const comment = await prisma.blogComment.create({
    data: {
      body: body,
      postId: Number(postId),
      authorId: Number(authorId),
    },
    include: {
      author: {
        select: { name: true,},
      },
    },
  })
  if (comment) { 
    comment.author = comment.author.name 
  }
  return comment
}

async function updatePost(authorId, postId, title, body, published) {
  // Check if post exists
  const validPost = await prisma.blogPost.findUnique({
    where: { id: Number(postId) }
  })
  if (!validPost) {
    throw new PrismaCustomError("Post not found", "P2025");
  }
  // Check if user authored the post
  if (validPost.authorId !== Number(authorId)) {
    throw new PrismaCustomError("Insufficient permissions", "P2018");
  }

  // Check if user authored the post
  const post = await prisma.blogPost.update({
    where: {
      id: Number(postId),
      AND: { authorId: Number(authorId) },
    },
    data: {
      title: title,
      body: body,
      published: published,
    }
  })
  return post;
}

async function updateComment(authorId, postId, commentId, body) {
  // Check if comment exists
  const validComment = await prisma.blogComment.findUnique({
    where: { id: Number(commentId) }
  })

  if (!validComment) {
    throw new PrismaCustomError("Comment not found", "P2025");
  }

  if (validComment.authorId !== Number(authorId)) {
    throw new PrismaCustomError("Insufficient permissions", "P2018");
  }

  // Check if user authored the comment belonging to a unique post
  const comment = await prisma.blogComment.update({
    where: {
      id: Number(commentId),
      AND: {
        postId: Number(postId),
        authorId: Number(authorId),
      }
    },
    data: {
      body: body,
    }
  })
  return comment;
}

async function deletePostById(id) {
  const post = await prisma.blogPost.delete({
    where: { id: Number(id) }
  })
  return post;
}

async function deleteOwnPost(authorId, postId) {
  // Check if post exists
  const validPost = await prisma.blogPost.findUnique({
    where: { id: Number(postId) }
  })
  if (!validPost) {
    throw new PrismaCustomError("Post not found", "P2025");
  }
  // Check if user authored the post
  if (validPost.authorId !== Number(authorId)) {
    throw new PrismaCustomError("Insufficient permissions", "P2018");
  }

  const post = await prisma.blogPost.delete({
    where: { id: Number(postId) }
  })
  return post;
}

async function deleteCommentById(commentId) {
  const comment = await prisma.blogComment.delete({
    where: {
      id: Number(commentId)
    }
  });
  return comment;
}

async function deleteOwnCommentDB(authorId, commentId) {
  // Check if comment exists
  const validComment = await prisma.blogComment.findUnique({
    where: { id: Number(commentId) }
  })
  if (!validComment) {
    throw new PrismaCustomError("Comment not found", "P2025");
  }

  if (validComment.authorId !== Number(authorId)) {
    throw new PrismaCustomError("Insufficient permissions", "P2018");
  }

  // Check if user authored the comment
  const comment = await prisma.blogComment.delete({
    where: { id: Number(commentId) }
  });
  return comment;
}

export {
  createDBComment, createDBPost, createGenericUser, createUserWithRole, deleteCommentById,
  deleteOwnCommentDB, deleteOwnPost, deletePostById, getAllPosts, getAllPublishedPosts,
  getOnePostById, getOnePostByIdAndAuthor, getOnePublishedPostById, getPostsByAuthorId, 
  getSomePosts, retrieveUserByEmail, retrieveUserById, retrieveUserByToken, updateComment, 
  updatePost, updateRefreshToken
};

