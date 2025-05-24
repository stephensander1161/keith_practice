// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In-memory database (replace with real DB in production)
let users = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', createdAt: new Date('2024-01-15') },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'user', createdAt: new Date('2024-02-20') },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'user', createdAt: new Date('2024-03-10') }
];

let posts = [
  { id: '1', userId: '1', title: 'Getting Started with Node.js', content: 'Node.js is a powerful runtime...', tags: ['nodejs', 'javascript'], createdAt: new Date('2024-03-01') },
  { id: '2', userId: '2', title: 'REST API Best Practices', content: 'When building REST APIs...', tags: ['api', 'rest', 'backend'], createdAt: new Date('2024-03-05') },
  { id: '3', userId: '1', title: 'Understanding Middleware', content: 'Middleware functions are...', tags: ['express', 'middleware'], createdAt: new Date('2024-03-08') }
];

let comments = [
  { id: '1', postId: '1', userId: '2', content: 'Great article!', createdAt: new Date('2024-03-02') },
  { id: '2', postId: '1', userId: '3', content: 'Very helpful, thanks!', createdAt: new Date('2024-03-03') }
];

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Demo API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      posts: '/api/posts',
      comments: '/api/comments',
      health: '/api/health',
      stats: '/api/stats'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    users: users.length,
    posts: posts.length,
    comments: comments.length,
    lastActivity: new Date().toISOString()
  });
});

// ============ USER ENDPOINTS ============

// Get all users with optional filtering
app.get('/api/users', (req, res) => {
  let result = [...users];
  
  // Filter by role if provided
  if (req.query.role) {
    result = result.filter(user => user.role === req.query.role);
  }
  
  // Sort by name if requested
  if (req.query.sort === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedResults = result.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedResults,
    pagination: {
      page,
      limit,
      total: result.length,
      pages: Math.ceil(result.length / limit)
    }
  });
});

// Get single user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Include user's posts
  const userPosts = posts.filter(p => p.userId === user.id);
  
  res.json({
    ...user,
    posts: userPosts
  });
});

// Create new user
app.post('/api/users', (req, res) => {
  const { name, email, role = 'user' } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  // Check if email already exists
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  const newUser = {
    id: uuidv4(),
    name,
    email,
    role,
    createdAt: new Date()
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email, role } = req.body;
  
  // Update only provided fields
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  if (role) users[userIndex].role = role;
  
  res.json(users[userIndex]);
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Remove user's posts and comments
  posts = posts.filter(p => p.userId !== req.params.id);
  comments = comments.filter(c => c.userId !== req.params.id);
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

// ============ POST ENDPOINTS ============

// Get all posts with filtering
app.get('/api/posts', (req, res) => {
  let result = [...posts];
  
  // Filter by userId
  if (req.query.userId) {
    result = result.filter(post => post.userId === req.query.userId);
  }
  
  // Filter by tag
  if (req.query.tag) {
    result = result.filter(post => post.tags.includes(req.query.tag));
  }
  
  // Search in title and content
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    result = result.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort by date
  result.sort((a, b) => b.createdAt - a.createdAt);
  
  // Include author info
  const enrichedPosts = result.map(post => {
    const author = users.find(u => u.id === post.userId);
    const postComments = comments.filter(c => c.postId === post.id);
    return {
      ...post,
      author: author ? { id: author.id, name: author.name } : null,
      commentCount: postComments.length
    };
  });
  
  res.json(enrichedPosts);
});

// Get single post
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const author = users.find(u => u.id === post.userId);
  const postComments = comments
    .filter(c => c.postId === post.id)
    .map(comment => {
      const commentAuthor = users.find(u => u.id === comment.userId);
      return {
        ...comment,
        author: commentAuthor ? { id: commentAuthor.id, name: commentAuthor.name } : null
      };
    });
  
  res.json({
    ...post,
    author: author ? { id: author.id, name: author.name } : null,
    comments: postComments
  });
});

// Create new post
app.post('/api/posts', (req, res) => {
  const { userId, title, content, tags = [] } = req.body;
  
  if (!userId || !title || !content) {
    return res.status(400).json({ error: 'userId, title, and content are required' });
  }
  
  // Verify user exists
  if (!users.find(u => u.id === userId)) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const newPost = {
    id: uuidv4(),
    userId,
    title,
    content,
    tags,
    createdAt: new Date()
  };
  
  posts.push(newPost);
  res.status(201).json(newPost);
});

// Update post
app.put('/api/posts/:id', (req, res) => {
  const postIndex = posts.findIndex(p => p.id === req.params.id);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const { title, content, tags } = req.body;
  
  if (title) posts[postIndex].title = title;
  if (content) posts[postIndex].content = content;
  if (tags) posts[postIndex].tags = tags;
  
  posts[postIndex].updatedAt = new Date();
  
  res.json(posts[postIndex]);
});

// Delete post
app.delete('/api/posts/:id', (req, res) => {
  const postIndex = posts.findIndex(p => p.id === req.params.id);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  // Remove post's comments
  comments = comments.filter(c => c.postId !== req.params.id);
  
  posts.splice(postIndex, 1);
  res.status(204).send();
});

// ============ COMMENT ENDPOINTS ============

// Get all comments
app.get('/api/comments', (req, res) => {
  let result = [...comments];
  
  // Filter by postId
  if (req.query.postId) {
    result = result.filter(comment => comment.postId === req.query.postId);
  }
  
  // Include author info
  const enrichedComments = result.map(comment => {
    const author = users.find(u => u.id === comment.userId);
    return {
      ...comment,
      author: author ? { id: author.id, name: author.name } : null
    };
  });
  
  res.json(enrichedComments);
});

// Create new comment
app.post('/api/comments', (req, res) => {
  const { postId, userId, content } = req.body;
  
  if (!postId || !userId || !content) {
    return res.status(400).json({ error: 'postId, userId, and content are required' });
  }
  
  // Verify post and user exist
  if (!posts.find(p => p.id === postId)) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  if (!users.find(u => u.id === userId)) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const newComment = {
    id: uuidv4(),
    postId,
    userId,
    content,
    createdAt: new Date()
  };
  
  comments.push(newComment);
  res.status(201).json(newComment);
});

// Delete comment
app.delete('/api/comments/:id', (req, res) => {
  const commentIndex = comments.findIndex(c => c.id === req.params.id);
  
  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  
  comments.splice(commentIndex, 1);
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});