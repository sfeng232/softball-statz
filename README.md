# softball-statz 🥎

A beautifully designed, comprehensive multi-team softball statistics tracking application built with React, TypeScript, and Vite. **softball-statz** replaces dusty paper scorebooks, allowing you to effortlessly track granular play-by-play events, calculate advanced analytics instantly, and even generate AI-powered game recaps!

## Features

- **Multi-Team Management**: Track multiple teams independently. Each team gets its own isolated roster, schedule, and lifetime stats history.
- **Roster Building**: Add players, assign jersey numbers, and specify defensive positions (including DH and UT).
- **Live Play-By-Play Scoring**:
  - Score a game live with 16 distinct at-bat outcomes (1B, 2B, HR, BB, K, SAC, DP, etc.).
  - Easily record RBIs and Runs Scored per play.
  - Built-in **Undo History** to quickly roll back any scoring mistakes.
- **Advanced Analytics Engine**:
  - Automatically calculates 15 detailed batting metrics for every player on the roster: `GP`, `PA`, `AB`, `R`, `H`, `2B`, `3B`, `HR`, `RBI`, `BB`, `K`, `AVG`, `OBP`, `SLG`, and `OPS`.
  - Rate stats (like AVG and OPS) dynamically enforce a minimum of 4 At-Bats to officially qualify.
- **Top 3 Leaderboards**: Visual gold, silver, and bronze podium panels automatically highlight your team's stat leaders.
- **AI Game Summaries**: Fully integrated with the Anthropic API. Click "Generate Summary" to instantly draft an engaging 3-4 sentence game recap and award a game MVP by simply feeding the AI the game's chronological play-by-play action log!
- **Local Persistence**: Zero backend configuration required! Everything is seamlessly saved directly to your browser's local storage automatically.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **State Management**: Zustand (with JSON persistence)
- **Styling**: Vanilla CSS featuring a premium dark-mode, glassmorphism aesthetic with engaging micro-animations.
- **Icons**: Lucide React
- **AI Integration**: Anthropic Claude API (`claude-3-5-haiku-latest`) proxied locally for cross-origin security.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/sfeng232/softball-statz.git
   cd softball-statz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   Navigate to `http://localhost:5173` in your favorite web browser.

*Note: For the AI Game Summary feature to work, you will need to click the Settings gear icon in the app's top right header to securely save your own Anthropic API Key.*
