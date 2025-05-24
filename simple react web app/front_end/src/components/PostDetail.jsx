import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

function PostDetail({ onUpdate }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')

  useEffect(() => {
    fetchPost()
    fetchUsers()
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/posts/${id}`)
      setPost(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch post')
      console.error('Error fetching post:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      const userData = response.data.data || []
      setUsers(userData)
      if (userData.length > 0) {
        setSelectedUserId(userData[0].id)
      }
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !selectedUserId) return

    try {
      await api.post('/comments', {
        postId: id,
        userId: selectedUserId,
        content: newComment
      })
      setNewComment('')
      fetchPost()
      onUpdate()
    } catch (err) {
      console.error('Error adding comment:', err)
      alert('Failed to add comment')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      await api.delete(`/comments/${commentId}`)
      fetchPost()
      onUpdate()
    } catch (err) {
      console.error('Error deleting comment:', err)
      alert('Failed to delete comment')
    }
  }

  const handleBack = () => {
    navigate('/posts')
  }

  if (loading) return <div className="loading">Loading post...</div>
  if (error) return <div className="error">{error}</div>
  if (!post) return <div className="error">Post not found</div>

  return (
    <div className="card">
      <button className="btn btn-secondary mb-2" onClick={handleBack}>
        ← Back to Posts
      </button>

      <h1>{post.title}</h1>
      <div className="meta mb-2">
        <span>By: {post.author?.name || 'Unknown'}</span>
        <span>Posted: {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="tags mb-2">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div style={{ whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
        {post.content}
      </div>

      <div className="comments-section">
        <h3>Comments ({post.comments?.length || 0})</h3>

        <form onSubmit={handleAddComment} style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label htmlFor="userId">Comment as:</label>
            <select
              id="userId"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{ marginBottom: '0.5rem' }}
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
            />
          </div>
          <button type="submit" className="btn">Add Comment</button>
        </form>

        {post.comments && post.comments.length === 0 ? (
          <p style={{ color: '#999' }}>No comments yet. Be the first to comment!</p>
        ) : (
          post.comments?.map(comment => (
            <div key={comment.id} className="comment">
              <div className="flex justify-between align-center">
                <div className="comment-author">
                  {comment.author?.name || 'Unknown'}
                </div>
                <button 
                  className="btn btn-danger" 
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </button>
              </div>
              <div className="comment-content">
                {comment.content}
              </div>
              <div className="comment-date">
                {new Date(comment.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PostDetail