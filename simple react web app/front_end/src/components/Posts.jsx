import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Posts({ onUpdate }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/posts')
      setPosts(response.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch posts')
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPost(null)
    setShowModal(true)
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await api.delete(`/posts/${id}`)
      await fetchPosts()
      onUpdate()
    } catch (err) {
      console.error('Error deleting post:', err)
      alert('Failed to delete post')
    }
  }

  const handleView = (id) => {
    navigate(`/posts/${id}`)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingPost(null)
    fetchPosts()
    onUpdate()
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="loading">Loading posts...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="card">
      <div className="flex justify-between align-center mb-2">
        <h2>Posts</h2>
        <button className="btn" onClick={handleCreate}>
          Create Post
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPosts.length === 0 ? (
        <div className="empty-state">No posts found</div>
      ) : (
        <div>
          {filteredPosts.map(post => (
            <div key={post.id} className="list-item">
              <h3>{post.title}</h3>
              <p>{post.content.substring(0, 150)}{post.content.length > 150 && '...'}</p>
              <div className="meta">
                <span>By: {post.author?.name || 'Unknown'}</span>
                <span>{post.commentCount || 0} comments</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <div className="btn-group">
                <button className="btn" onClick={() => handleView(post.id)}>
                  View
                </button>
                <button className="btn btn-secondary" onClick={() => handleEdit(post)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(post.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <PostModal
          post={editingPost}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

export default Posts