import React, { useState, useEffect } from 'react'
import api from '../services/api'

function PostModal({ post, onClose }) {
  const [formData, setFormData] = useState({
    userId: post?.userId || '',
    title: post?.title || '',
    content: post?.content || '',
    tags: post?.tags?.join(', ') || ''
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response.data.data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }

      if (post) {
        await api.put(`/posts/${post.id}`, data)
      } else {
        await api.post('/posts', data)
      }
      onClose()
    } catch (err) {
      console.error('Error saving post:', err)
      alert(err.response?.data?.error || 'Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{post ? 'Edit Post' : 'Create Post'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">Author</label>
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">Select an author</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="javascript, nodejs, react"
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Saving...' : (post ? 'Update' : 'Create')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostModal