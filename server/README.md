# AmerReview Backend Server

Backend API server for the AmerReview investment tracking application.

## Tech Stack

- **Node.js** with **Express**
- **MongoDB** with **Mongoose**
- **TypeScript**
- **CORS** enabled for cross-origin requests

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/amerreview
NODE_ENV=development
```

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: MongoDB runs as a service automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/amerreview?retryWrites=true&w=majority
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Investment Items

- `GET /api/investments` - Get all items grouped by status
- `GET /api/investments/:id` - Get single item
- `POST /api/investments` - Create new item
- `PUT /api/investments/:id` - Update item
- `PATCH /api/investments/:id/status` - Update item status
- `DELETE /api/investments/:id` - Delete item

### Health Check

- `GET /api/health` - Server health status

## Project Structure

```
server/
├── src/
│   ├── models/
│   │   └── InvestmentItem.ts    # MongoDB schema
│   ├── controllers/
│   │   └── investmentController.ts  # Business logic
│   ├── routes/
│   │   └── investmentRoutes.ts  # API routes
│   └── index.ts                 # Server entry point
├── uploads/                     # Image uploads directory
├── .env                        # Environment variables
├── package.json
└── tsconfig.json
```

## Notes

- Images are stored as base64 strings in the database
- CORS is enabled for all origins in development
- MongoDB connection is established before server starts
