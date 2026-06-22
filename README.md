# CausalFunnel User Analytics Application

A production-ready full-stack web application that tracks user interactions on webpages and displays comprehensive analytics in a modern dashboard.

## 📋 Project Overview

CausalFunnel is a complete user analytics solution that enables website owners to:
- Track user sessions and interactions in real-time
- Visualize click patterns with heatmaps
- Analyze user journey flows
- Monitor engagement metrics through interactive dashboards

## ✨ Features

### Event Tracking
- **Automatic Session Management**: Generates and persists session IDs using localStorage
- **Page View Tracking**: Captures page load events automatically
- **Click Tracking**: Records click coordinates (X, Y) for heatmap visualization
- **SPA Support**: Detects page visibility changes for single-page applications
- **Lightweight Script**: Minimal footprint, easy integration with any website

### Analytics Dashboard
- **Real-time Statistics**: Total sessions, page views, clicks, and unique pages
- **Interactive Charts**: Bar charts, doughnut charts powered by Chart.js
- **Session Management**: View all sessions with event counts and durations
- **Session Journey**: Chronological event timeline for each session
- **Click Heatmaps**: Visual representation of user click patterns
- **Search & Filter**: Find sessions by ID with pagination support

### Technical Features
- **MVC Architecture**: Clean separation of concerns in backend
- **RESTful API**: Well-documented endpoints with proper validation
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Error Handling**: Comprehensive error states and loading indicators
- **Type Safety**: Input validation with express-validator

## 🏗️ Architecture

```
causalfunnel-user-analytics/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route definitions
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Entry point
│   └── package.json
├── frontend/               # React + Vite Dashboard
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── tracker/                # Event tracking script
│   ├── tracker.js          # Main tracking script
│   └── README.md
├── demo-site/              # Demo webpage for testing
│   └── index.html
└── README.md
```

### Data Flow

```
User Website (with tracker.js)
    ↓
Backend API (Express)
    ↓
MongoDB Atlas
    ↓
Frontend Dashboard (React)
```

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Lucide React** - Icon library

### Tracking
- **Vanilla JavaScript** - No dependencies
- **localStorage** - Session persistence
- **Fetch API** - HTTP requests

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd causalfunnel-user-analytics
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Configure `.env` with your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/causalfunnel?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Configure `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Testing the Tracker

Open the demo site in your browser:

```bash
cd demo-site
# Open index.html in your browser
```

Or serve it with a local server:

```bash
npx serve demo-site
```

Interact with the demo site to generate events, then view them in the dashboard.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### POST /api/events
Create a new event.

**Request Body:**
```json
{
  "session_id": "session_1234567890_abc123",
  "event_type": "page_view",
  "page_url": "https://example.com/page",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "click": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "event_id",
    "session_id": "session_1234567890_abc123",
    "event_type": "page_view",
    "page_url": "https://example.com/page",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "click": null
  }
}
```

#### GET /api/sessions
Get all sessions with summary statistics.

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "session_id": "session_1234567890_abc123",
      "total_events": 15,
      "first_event_time": "2024-01-01T00:00:00.000Z",
      "last_event_time": "2024-01-01T00:05:00.000Z",
      "session_duration": 300,
      "page_count": 3
    }
  ]
}
```

#### GET /api/sessions/:sessionId
Get all events for a specific session.

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "event_id",
      "session_id": "session_1234567890_abc123",
      "event_type": "page_view",
      "page_url": "https://example.com/page",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "click": null
    }
  ]
}
```

#### GET /api/heatmap?page=<url>
Get click coordinates for a specific page.

**Query Parameters:**
- `page` (required): URL of the page

**Response:**
```json
{
  "success": true,
  "count": 50,
  "page_url": "https://example.com/page",
  "data": [
    {
      "x": 120,
      "y": 300,
      "timestamp": "2024-01-01T00:01:00.000Z",
      "session_id": "session_1234567890_abc123"
    }
  ]
}
```

#### GET /api/heatmap/pages
Get all pages with click data.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "page_url": "https://example.com/page",
      "click_count": 50
    }
  ]
}
```

#### GET /api/stats
Get overall statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_sessions": 100,
    "total_page_views": 500,
    "total_clicks": 1500,
    "unique_pages": 10,
    "recent_events_24h": 50
  }
}
```

## 🔧 Usage

### Integrating the Tracker

1. **Copy the tracker script:**
   ```html
   <script src="path/to/tracker.js"></script>
   ```

2. **Configure the API endpoint:**
   Edit `tracker.js` and update the `CONFIG` object:
   ```javascript
   const CONFIG = {
     API_ENDPOINT: 'http://localhost:5000/api/events',
     SESSION_STORAGE_KEY: 'causalfunnel_session_id',
     AUTO_TRACK: true
   };
   ```

3. **View Analytics:**
   - Open the dashboard at `http://localhost:3000`
   - Navigate to different sections using the sidebar
   - View real-time statistics on the Dashboard
   - Explore sessions and user journeys
   - Analyze click patterns with heatmaps

### Manual Tracking

Access the tracker API programmatically:

```javascript
// Track a page view
CausalFunnel.trackPageView();

// Track a click
CausalFunnel.trackClick({ clientX: 100, clientY: 200 });

// Get current session ID
const sessionId = CausalFunnel.getSessionId();
```

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables:
   - `VITE_API_URL`: Your backend API URL
4. Deploy

### Backend (Render/Railway)

1. Push code to GitHub
2. Import project in Render/Railway
3. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: 5000 (or your preferred port)
   - `NODE_ENV`: production
4. Deploy

### MongoDB Atlas

1. Create a free account at MongoDB Atlas
2. Create a new cluster
3. Create a database user
4. Whitelist your backend IP address (or use 0.0.0.0/0 for development)
5. Get the connection string and add it to your environment variables

## 📸 Screenshots

### Dashboard Home
[Placeholder: Dashboard showing statistics cards and charts]

### Sessions View
[Placeholder: Table showing all sessions with search and pagination]

### Session Journey
[Placeholder: Timeline showing events for a specific session]

### Heatmap View
[Placeholder: Visual heatmap showing click positions]

## 🔒 Security Considerations

- **API Authentication**: Currently public for demo purposes. Add authentication (JWT, API keys) for production
- **CORS**: Configure CORS to allow only trusted domains
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Data Privacy**: Ensure compliance with GDPR/CCPA regulations
- **HTTPS**: Use HTTPS in production for secure data transmission

## ⚠️ Assumptions

1. **Session Persistence**: Sessions are stored in browser localStorage. Clearing localStorage will create a new session
2. **Click Coordinates**: Coordinates are relative to the viewport, not the document
3. **Timestamp Format**: All timestamps use ISO 8601 format
4. **Page URL**: Full URL is captured, including query parameters
5. **SPA Support**: Visibility change detection works for most SPAs but may need customization for complex routing

## 🔄 Trade-offs

1. **LocalStorage vs Cookies**: Used localStorage for simplicity. Cookies could provide better cross-tab session management
2. **Real-time vs Polling**: Dashboard uses manual refresh. WebSocket could provide real-time updates
3. **Client-side vs Server-side Rendering**: Chose CSR for better interactivity. SSR could improve SEO
4. **MongoDB vs SQL**: MongoDB provides flexibility for event data. SQL could offer better relational queries
5. **Heatmap Resolution**: Normalized to percentage for responsiveness. Absolute pixels could provide more precision

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Verify your MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**Port Already in Use:**
- Change the PORT in `.env` file
- Kill the process using the port: `npx kill-port 5000`

### Frontend Issues

**API Connection Error:**
- Verify backend is running
- Check `VITE_API_URL` in `.env`
- Ensure CORS is configured correctly

**Build Errors:**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

### Tracker Issues

**Events Not Being Recorded:**
- Check browser console for errors
- Verify API endpoint configuration
- Ensure backend is accessible
- Check network tab in developer tools

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Chart.js for the excellent charting library
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icon set
- MongoDB Atlas for hosting the database

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using modern web technologies
#   c a u s a l f u n n e l - u s e r - a n a l y t i c s  
 #   c a u s a l f u n n e l - u s e r - a n a l y t i c s  
 