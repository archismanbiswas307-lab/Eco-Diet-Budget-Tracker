<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# EcoDiet Budget Tracker - Run and Deploy Your AI Studio App

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ab0c9cba-e0b3-4eae-a57f-15bffde86c57

## Setup Instructions

### Prerequisites
- Node.js 16+ installed on your system

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root (copy from `.env.example`):

```bash
# Get your Gemini API key from: https://ai.google.dev
GEMINI_API_KEY="your-api-key-here"

# The URL where this app is hosted (optional for local development)
APP_URL="http://localhost:3000"
```

⚠️ **Important**: Do not commit `.env` to version control. It's already in `.gitignore`.

### 3. Run the App

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production build**:
```bash
npm run build
npm start
```

**Preview production build**:
```bash
npm run build
npm run preview
```

## Project Structure

- `src/` - React application source code
- `components/ui/` - Reusable UI components
- `src/lib/` - Utility functions and API integration
- `server.ts` - Express backend server
- `vite.config.ts` - Vite bundler configuration

## Features

✅ Diet plan optimization using Google Gemini AI  
✅ Budget tracking with transaction management  
✅ Health metrics calculation (BMI, BMR, TDEE)  
✅ Responsive React UI with Tailwind CSS  
✅ Real-time spending analysis  

## Troubleshooting

### Error: "GEMINI_API_KEY is not configured"
- Ensure you have created a `.env` file in the project root
- Verify that your API key is correctly set
- Restart the development server after adding the `.env` file

### Build optimization
The project uses Vite with manual chunk splitting to optimize bundle size. Chunks are split into:
- `vendor` - React and React DOM
- `ui` - Recharts and Lucide icons
- `motion` - Motion animation library

