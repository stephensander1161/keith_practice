import React from 'react'

function Dashboard({ stats }) {
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.users}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{stats.posts}</h3>
          <p>Total Posts</p>
        </div>
        <div className="stat-card">
          <h3>{stats.comments}</h3>
          <p>Total Comments</p>
        </div>
      </div>

      <div className="card">
        <h2>Welcome to the Demo API Dashboard</h2>
        <p>This React frontend connects to your Node.js backend API. You can:</p>
        <ul style={{ marginTop: '1rem', marginLeft: '2rem' }}>
          <li>View and manage users</li>
          <li>Create, edit, and delete posts</li>
          <li>View and add comments</li>
          <li>Search and filter content</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          Make sure your Node.js server is running on port 3000!
        </p>
      </div>
    </div>
  )
}

export default Dashboard