# CausalFunnel Event Tracker

A lightweight JavaScript tracking script that captures user interactions on any webpage.

## Features

- Automatic session management using localStorage
- Page view tracking
- Click event tracking with coordinates
- Easy integration with any website
- SPA support with visibility change detection

## Installation

### Option 1: Direct Script Tag

```html
<script src="path/to/tracker.js"></script>
```

### Option 2: Inline Script

Copy the contents of `tracker.js` and paste it directly into your HTML.

## Configuration

Edit the `CONFIG` object in `tracker.js`:

```javascript
const CONFIG = {
  API_ENDPOINT: 'http://localhost:5000/api/events', // Your backend API endpoint
  SESSION_STORAGE_KEY: 'causalfunnel_session_id',    // localStorage key
  AUTO_TRACK: true                                   // Enable/disable automatic tracking
};
```

## Usage

### Automatic Tracking

By default, the tracker automatically:
- Tracks page views on load
- Tracks all click events
- Tracks page visibility changes (for SPAs)

### Manual Tracking

Access the tracker API via `window.CausalFunnel`:

```javascript
// Track a page view manually
CausalFunnel.trackPageView();

// Track a click manually
CausalFunnel.trackClick({ clientX: 100, clientY: 200 });

// Get current session ID
const sessionId = CausalFunnel.getSessionId();
```

## Event Data Format

Each event sent to the backend follows this structure:

```javascript
{
  session_id: string,      // Unique session identifier
  event_type: "page_view" | "click",
  page_url: string,        // Current page URL
  timestamp: string,       // ISO 8601 date string
  click: {
    x: number,             // X coordinate (null for page views)
    y: number              // Y coordinate (null for page views)
  }
}
```

## Example Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
  <script src="tracker.js"></script>
</head>
<body>
  <h1>Welcome to My Website</h1>
  <p>This page is being tracked by CausalFunnel.</p>
</body>
</html>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Privacy Considerations

- No personal data is collected
- Session IDs are stored locally in the browser
- All data is sent to your configured backend
- Ensure your backend complies with GDPR/CCPA regulations
