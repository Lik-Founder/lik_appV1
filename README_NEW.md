# Lik - Social Food Discovery App

A gamified social food discovery platform built with React, TypeScript, and Supabase.

## Features

- **Social Food Discovery**: Share and discover amazing food spots
- **Gamification**: Earn XP, complete bounties and quests, climb leaderboards
- **Real-time Chat**: Message friends and share food experiences
- **Stories & Reviews**: Share your food journey through stories and reviews
- **Restaurant Profiles**: Detailed restaurant pages with menus and awards
- **Events**: Discover and join food events in your area
- **Trending Content**: TikTok-style vertical scrolling for food content

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd lik-app
npm install
```

### 2. Supabase Setup (Required for Backend Features)

The app uses Supabase for authentication, real-time features, and data storage.

#### Option A: Quick Development Mode
For immediate development without backend setup, the app will run in mock mode with placeholder data.

#### Option B: Full Backend Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env`
3. Update the environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the database schema from `supabase-schema.sql` in your Supabase SQL editor
5. Set up authentication providers (Google, GitHub, Discord) in Supabase dashboard

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── assets/             # Images, icons, and media
└── styles/             # CSS and styling files
```

## Key Components

- **HomeFeed**: Main feed with stories and content carousels
- **TrendingPage**: TikTok-style vertical video feed
- **LikPage**: Gamification hub with bounties and quests
- **SearchPage/Explore**: Restaurant and dish discovery
- **ProfilePage**: User profiles with stats and content
- **MessagesPage**: Real-time chat system

## Technologies Used

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Real-time, Auth, Storage)
- **UI Components**: Radix UI, Phosphor Icons
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Deployment**: Optimized for Vercel/Netlify

## Development Mode

When Supabase is not configured, the app runs in development mode with:
- Mock authentication (skip login)
- Sample data for all features
- No real-time updates
- No persistent storage

Perfect for UI development and testing!

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.