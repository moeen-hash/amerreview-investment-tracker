# AmerReview - Investment Tracking Application

A full-stack investment tracking dashboard built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- 📊 **Kanban-style board** with 4 columns: Follow Up, Executed, Closed, Archive
- 🎯 **Drag & drop** items between columns
- 📝 **Rich analysis** with multiple analysis points per investment
- 📅 **Follow-up scheduling** with date and time
- 🖼️ **Image upload** support for charts and analysis
- 💾 **Persistent storage** with MongoDB
- 🔄 **Real-time updates** with REST API

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Lucide React (icons)
- date-fns (date formatting)

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- TypeScript
- CORS enabled

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd AmerReview
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service
- Use default connection: `mongodb://localhost:27017/amerreview`

**Option B: MongoDB Atlas (Cloud)**
- Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create cluster and get connection string
- Update `server/.env` with your connection string

### 5. Configure Environment Variables

**Frontend** - Create `.env` in root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend** - Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/amerreview
NODE_ENV=development
```

## Running the Application

### Start Backend Server (Terminal 1)
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

### Start Frontend (Terminal 2)
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## Usage

1. **Create Investment**: Click "+" button to create new investment item
2. **View/Edit**: Click eye icon to view details, edit button to modify
3. **Move Status**: Drag cards between columns or use move buttons
4. **Execute Trade**: When moving to "Executed", fill in execution details
5. **Close Trade**: When moving to "Closed", fill in closing details
6. **Delete**: Click trash icon to remove item

## Project Structure

```
AmerReview/
├── src/                    # Frontend source
│   ├── components/        # React components
│   ├── services/          # API service layer
│   ├── types.ts          # TypeScript types
│   └── main.tsx          # Entry point
├── server/               # Backend source
│   ├── src/
│   │   ├── models/      # MongoDB models
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API routes
│   │   └── index.ts     # Server entry
│   └── package.json
├── public/              # Static assets
└── package.json        # Frontend dependencies
```

## API Endpoints

- `GET /api/investments` - Get all items
- `POST /api/investments` - Create item
- `PUT /api/investments/:id` - Update item
- `PATCH /api/investments/:id/status` - Update status
- `DELETE /api/investments/:id` - Delete item
- `GET /api/health` - Health check

## Building for Production

### Frontend
```bash
npm run build
npm run preview
```

### Backend
```bash
cd server
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

ISC

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
