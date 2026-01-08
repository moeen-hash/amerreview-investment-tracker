# MongoDB Setup Guide

MongoDB is not currently installed on your system. You have two options:

## Option 1: MongoDB Atlas (Cloud - Recommended for Quick Start) ⭐

### Steps:
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account (no credit card required)
3. Create a new cluster (select FREE tier - M0)
4. Wait for cluster to be created (2-3 minutes)
5. Click "Connect" button
6. Click "Add a connection IP address" → "Allow access from anywhere" (or add your IP)
7. Create a database user with username and password
8. Click "Choose a connection method" → "Connect your application"
9. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
10. Update `server/.env` file:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/amerreview?retryWrites=true&w=majority
```
11. Replace `your-username`, `your-password`, and cluster URL with your values

---

## Option 2: Install MongoDB Locally

### Windows:
1. Download MongoDB Community Server from:
   https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" installation)
3. Select "Install MongoDB as a Service" (recommended)
4. MongoDB will start automatically
5. Default connection: `mongodb://localhost:27017/amerreview`

### Mac:
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### Linux (Ubuntu/Debian):
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## After Setup:

Once you have MongoDB configured (Atlas or local), update `server/.env`:

```env
# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/amerreview?retryWrites=true&w=majority

# OR for Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/amerreview

PORT=5000
NODE_ENV=development
```

Then start the server:
```bash
cd server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```
