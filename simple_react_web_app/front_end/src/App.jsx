import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Users from './components/Users'
import Posts from './components/Posts'
import PostDetail from './components/PostDetail'
import api from './services/api'

function App() {
  const [stats, setStats] = useState({ users: 0, posts: 0, comments: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <h1>Demo API Dashboard</h1>
            <nav className="nav">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Dashboard
              </NavLink>
              <NavLink to="/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Users
              </NavLink>
              <NavLink to="/posts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Posts
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard stats={stats} />} />
            <Route path="/users" element={<Users onUpdate={fetchStats} />} />
            <Route path="/posts" element={<Posts onUpdate={fetchStats} />} />
            <Route path="/posts/:id" element={<PostDetail onUpdate={fetchStats} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App