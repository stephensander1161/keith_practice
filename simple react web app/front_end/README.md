# Demo API Frontend - React App

A modern React application that connects to the Node.js REST API backend.

## Features

- 📊 Dashboard with live statistics
- 👥 User management (CRUD operations)
- 📝 Post management with tags
- 💬 Comment system
- 🔍 Search functionality
- 🎨 Modern, responsive UI
- 🚀 Fast development with Vite

## Prerequisites

- Node.js 14+ installed
- The backend API server running on port 3000

## Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd demo-api-frontend

# Install dependencies
npm install
```

## Development

```bash
# Start the development server
npm run dev
```

The app will run on `http://localhost:5173` and proxy API requests to `http://localhost:3000`.

## Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
demo-api-frontend/
├── src/
│   ├── components/      # React components
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── UserModal.jsx
│   │   ├── Posts.jsx
│   │   ├── PostModal.jsx
│   │   └── PostDetail.jsx
│   ├── services/        # API service
│   │   └── api.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Available Routes

- `/` - Dashboard
- `/users` - User management
- `/posts` - Post listing
- `/posts/:id` - Post detail with comments

## Tech Stack

- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **CSS** - Styling (no frameworks, custom styles)

## Features in Detail

### User Management
- View all users with search
- Create new users
- Edit existing users
- Delete users (cascades to their posts/comments)
- Role assignment (user/admin)

### Post Management
- Create posts with multiple tags
- Edit post content and tags
- Delete posts
- Search posts by title or content
- View detailed post with comments

### Comment System
- Add comments to posts
- Select which user is commenting
- Delete comments
- Real-time comment count updates

## API Integration

The app uses Axios to communicate with the backend API. All API calls go through the `/api` proxy configured in Vite, which forwards them to `http://localhost:3000/api`.

## Styling

The app uses custom CSS with:
- Modern gradient header
- Card-based layout
- Responsive design
- Hover effects and transitions
- Modal dialogs for forms
- Tag pills for post categories

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request