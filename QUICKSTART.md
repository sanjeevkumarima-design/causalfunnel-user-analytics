# Quick Start Guide

Get CausalFunnel up and running in 5 minutes!

## Prerequisites

- Node.js (v18+) installed
- MongoDB Atlas account (free tier works)
- Git (optional)

## Step 1: MongoDB Atlas Setup (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up
2. Create a new free cluster (M0)
3. Create a database user with read/write permissions
4. Go to Network Access → Add IP Address → Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Click Connect → Connect your application → Copy the connection string

## Step 2: Backend Setup (1 minute)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and replace the MongoDB URI:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/causalfunnel?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

Backend should run on `http://localhost:5000`

## Step 3: Frontend Setup (1 minute)

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend should run on `http://localhost:3000`

## Step 4: Test the Tracker (1 minute)

Open the demo site:

```bash
cd demo-site
# Open index.html in your browser
```

Or serve it:

```bash
npx serve demo-site
# Open http://localhost:3000
```

Click around the demo site to generate events, then view them in the dashboard at `http://localhost:3000`

## Verify Everything Works

1. **Backend Health Check**: Visit `http://localhost:5000/health` - should return JSON with server status
2. **Frontend Dashboard**: Visit `http://localhost:3000` - should show the analytics dashboard
3. **Generate Events**: Interact with the demo site
4. **View Data**: Refresh the dashboard to see the collected events

## Common Issues

**MongoDB Connection Failed:**
- Double-check your connection string
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**Port Already in Use:**
```bash
# Kill process on port 5000
npx kill-port 5000
```

**Frontend Can't Connect to Backend:**
- Ensure backend is running
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS is enabled in backend

## Next Steps

1. **Integrate Tracker**: Add the tracker script to your own website
2. **Customize Dashboard**: Modify the React components to fit your needs
3. **Deploy**: Follow the deployment guide in the main README

## Need Help?

Check the main [README.md](README.md) for detailed documentation, API reference, and troubleshooting.
