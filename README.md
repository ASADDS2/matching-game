# Matching Game: English Learning App 🌍🎓

An interactive, responsive, and aesthetically premium educational matching game built with **TypeScript**, **Vite**, and **Vanilla CSS**. This application is designed to help students master English grammar, vocabulary, and cultural concepts through engaging, gamified learning modules.

## 🚀 Features

* **5 Distinct Game Modes:** Covers verbs, adjectives, tenses, vocabulary, and cultural etiquette.
* **Premium Glassmorphism UI:** Modern interface featuring fluid typography, CSS Grid/Flexbox responsive layouts, smooth micro-animations, and dynamic gradient backgrounds.
* **Achievement Passport:** Players earn stamps for completing modules, tracking their progress interactively.
* **Session Statistics:** Tracks match accuracy, time taken, mistakes, and maintains a "Review Queue" to help users learn from their errors.
* **Audio Feedback:** Musical cues and sound effects enhance the immersive experience.
* **100% Responsive Layout:** Works flawlessly across mobile phones, tablets, and desktop browsers without relying on brittle JavaScript window resizes.

## 🎮 Game Modes (Modules)

1. **Verb Flip (Base ↔ Participle):** 
   * Match base-form verbs with their irregular past participles to perfect verb tenses.
2. **Culture Clash (Gestures ↔ Culture Tips):**
   * Match greetings and gestures from different regions with their corresponding global etiquette tips.
3. **Feeling vs. Thing (-ed vs. -ing):**
   * Learn when to use `-ed` adjectives (feelings/emotions) versus `-ing` adjectives (what causes the emotion) by filling in the blanks.
4. **Travel Tiles (Phrases ↔ Definitions):**
   * A face-up matching game to pair common travel and tourism phrases with their exact meanings.
5. **Time Detective (Simple Past vs. Present Perfect):**
   * Analyze grammar clues to sort sentences into the correct tense folders (Simple Past or Present Perfect).

## 🛠️ Technology Stack

* **Frontend Framework:** Vanilla TypeScript
* **Build Tool:** Vite
* **Styling:** Vanilla CSS (utilizing CSS Variables, Fluid Typography `clamp()`, and modern responsive layout grids)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ASADDS2/matching-game.git
   cd matching-game
   ```

2. **Install dependencies:**
   This project uses `pnpm` (or `npm`/`yarn`).
   ```bash
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   pnpm run dev
   ```
   Open `http://localhost:5173` in your browser to play the game.

4. **Build for production:**
   ```bash
   pnpm run build
   ```
   The optimized production build will be output to the `dist` directory.

5. **Preview production build:**
   ```bash
   pnpm run preview
   ```

## 📂 Project Structure

```
src/
├── components/      # Reusable UI components (Card, Timer, Passport, Audio, Modal)
├── screens/         # Main application views (Home, Mode Select, Game Modes, Results)
├── styles/          # Global styles (main.css, animations.css)
├── game-data.ts     # Content and dataset for all game modes
├── main.ts          # Application entry point and router
└── state.ts         # Global state management (Scores, Session Stats, Passport)
```

## 🎨 UI & Responsive Design

The application uses a mobile-first responsive approach purely powered by **CSS**. 
* Media queries (`@media`) handle breakpoints down to 360px screens.
* Modals, grids, and headers are designed using `display: flex` and `display: grid`.
* Fluid scaling ensures fonts and spacing adapt naturally across device sizes.

## 📜 License

See the [LICENSE](LICENSE) file for more information.