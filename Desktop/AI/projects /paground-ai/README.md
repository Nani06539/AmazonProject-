# 🎯 Playground - Your Personal Platform

A modern, full-stack web application for organizing your personal notes, business ideas, and building a personal library. Built with Next.js, Clerk authentication, and Firebase.

## ✨ Features

### 🔐 **Authentication & User Sync**
- Secure user authentication with Clerk
- Automatic user synchronization with Firebase
- Protected routes and user-specific data
- Modern sign-in/sign-up experience
- Webhook-based user management

### 📝 **Personal Notes**
- Create, edit, and delete personal notes
- Organize with tags and categories
- Rich text content support
- User-specific note management

### 💡 **Business Ideas**
- Document business concepts and strategies
- Track market research and target audiences
- Set priority levels and status tracking
- Revenue model planning
- Progress tracking from idea to launch

### 📚 **Personal Library**
- Build your digital knowledge base
- Upload and store files
- Organize articles, books, videos, and documents
- Link external resources
- Tag-based organization

### 🎥 **Video Browsing**
- Search YouTube videos directly from the app
- Watch videos with embedded player
- View detailed video information
- Browse search results with thumbnails
- Real-time video search and playback

### ✨ **AI-Powered Features**
- **Daily Motivational Quotes** - AI-generated inspirational quotes
- **Smart Content** - OpenAI-powered creativity and inspiration
- **Personalized Experience** - Dynamic content that adapts to users

### 📊 **Dashboard**
- Real-time statistics and overview
- Quick access to all sections
- Recent activity tracking
- User-friendly navigation

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Deployment**: Vercel-ready

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd playground
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret_here

# YouTube API
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

### 4. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Firestore Database
4. Enable Firebase Storage
5. Set up security rules (see below)

### 5. Clerk Setup
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Configure authentication methods
4. Add your domain to authorized domains
5. Set up webhooks (see Webhook Configuration below)

### 6. YouTube API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add the API key to your `.env.local` file

**Note**: The current setup uses demo videos. To see real YouTube content:
- Get a YouTube Data API v3 key from Google Cloud Console
- Replace the placeholder in `.env.local` with your actual API key
- The app will automatically use real YouTube data when a valid key is provided

### 7. OpenAI API Setup
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add the API key to your `.env.local` file

**Features**: OpenAI powers the motivational quotes and other AI features in the app

### 8. Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

## 🔗 Webhook Configuration

### Setting up Clerk Webhooks

1. **In Clerk Dashboard:**
   - Go to your application settings
   - Navigate to "Webhooks" section
   - Click "Add Endpoint"

2. **Webhook Configuration:**
   - **Endpoint URL**: `https://your-domain.com/api/webhooks/clerk`
   - **Events to send**: Select these events:
     - `user.created`
     - `user.updated` 
     - `user.deleted`

3. **Get Webhook Secret:**
   - Copy the webhook signing secret
   - Add it to your `.env.local`:
     ```env
     CLERK_WEBHOOK_SECRET=your_webhook_secret_here
     ```

4. **For Local Development:**
   - Use a service like ngrok to expose your local server
   - Set the webhook URL to your ngrok URL: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`

## 🔧 Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection}/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.clerkUserId;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

## 📁 Project Structure

```
playground/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── webhooks/      # Webhook handlers
│   │   │   └── clerk/     # Clerk webhook
│   │   ├── sync-user/     # User sync endpoint
│   │   └── quote/         # OpenAI quote generation
│   ├── ideas/             # Business ideas page
│   ├── library/           # Library page
│   ├── notes/             # Notes page
│   ├── videos/            # Video browsing page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── IdeasPage.tsx      # Business ideas page
│   ├── LandingPage.tsx    # Landing page
│   ├── LibraryPage.tsx    # Library page
│   ├── VideoBrowsingPage.tsx # Video browsing page
│   └── MotivationalQuote.tsx # AI-powered quotes
├── lib/                   # Utility functions
│   ├── firebase.ts        # Firebase configuration
│   ├── firebase-utils.ts  # Firebase utilities
│   ├── user-sync.ts       # User synchronization utilities
│   └── clerk-firebase-utils.ts # Clerk + Firebase integration
├── middleware.ts          # Clerk middleware
└── README.md             # This file
```

## 🎨 Features in Detail

### Dashboard
- **Welcome Section**: Personalized greeting with user's name
- **Statistics Cards**: Real-time counts of notes, ideas, library items, and files
- **Quick Navigation**: Easy access to all sections
- **Recent Activity**: Overview of recent actions

### Notes Management
- **CRUD Operations**: Create, read, update, delete notes
- **Rich Content**: Support for formatted text
- **Tagging System**: Organize notes with custom tags
- **User Isolation**: Each user sees only their own notes

### Business Ideas
- **Comprehensive Forms**: Capture all aspects of business ideas
- **Status Tracking**: From idea to launched
- **Priority Levels**: High, medium, low priority
- **Market Research**: Target audience and market information
- **Revenue Models**: Document monetization strategies

### Library System
- **Multiple Types**: Articles, books, videos, documents, links
- **File Upload**: Store files in Firebase Storage
- **External Links**: Link to web resources
- **Author Information**: Track content creators
- **Download Links**: Easy access to stored files

## 🔒 Security Features

- **Authentication Required**: All features require user login
- **User Data Isolation**: Users can only access their own data
- **Secure File Storage**: Files stored with user-specific paths
- **Protected API Routes**: Server-side authentication verification
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Make sure to add all environment variables in your deployment platform:
- Firebase configuration
- Clerk authentication keys
- Any additional API keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the Firebase Console for database/storage issues
2. Verify Clerk configuration in the dashboard
3. Check browser console for client-side errors
4. Review environment variable configuration

## 🔮 Future Enhancements

- [ ] Real-time collaboration
- [ ] Advanced search and filtering
- [ ] Export/import functionality
- [ ] Mobile app
- [ ] AI-powered suggestions
- [ ] Integration with external services
- [ ] Advanced analytics and insights

---

Built with ❤️ using Next.js, Clerk, and Firebase
