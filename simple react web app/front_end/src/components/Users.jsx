import React, { useState, useEffect } from 'react'
import api from '../services/api'
import UserModal from './UserModel'

function Users({ onUpdate }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users')
      setUsers(response.data.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch users')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingUser(null)
    setShowModal(true)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      await api.delete(`/users/${id}`)
      await fetchUsers()
      onUpdate()
    } catch (err) {
      console.error('Error deleting user:', err)
      alert('Failed to delete user')
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingUser(null)
    fetchUsers()
    onUpdate()
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="loading">Loading users...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="card">
      <div className="flex justify-between align-center mb-2">
        <h2>Users</h2>
        <button className="btn" onClick={handleCreate}>
          Add User
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">No users found</div>
      ) : (
        <div>
          {filteredUsers.map(user => (
            <div key={user.id} className="list-item">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <div className="meta">
                <span>Role: {user.role}</span>
                <span>ID: {user.id}</span>
              </div>
              <div className="btn-group">
                <button className="btn btn-secondary" onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <UserModal
          user={editingUser}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

export default Users