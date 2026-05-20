import { CardComponent } from '../components/card';
import { TimerComponent } from '../components/timer';
import { VerbPairs } from '../game-data';
import { playCorrectSound, playWrongSound } from '../components/audio';
import { getState, setState, completeGame } from '../state';

export function renderVerbFlip(
  container: HTMLElement,
  navigate: (screen: 'home' | 'select' | 'game' | 'results', modeIndex?: 0 | 1 | 2 | 3 | 4) => void
) {
  // Clear any existing contents
  container.innerHTML = '';

  // Background blobs
  const blob1 = document.createElement('div');
  blob1.className = 'bg-blob bg-blob-1';
  container.appendChild(blob1);

  const blob2 = document.createElement('div');
  blob2.className = 'bg-blob bg-blob-2';
  container.appendChild(blob2);

  const content = document.createElement('div');
  content.className = 'screen-content';

  // Game UI Header
  content.innerHTML = `
    <div class="game-header">
      <button id="btn-back" class="btn-premium btn-secondary game-header__back">
        ← Volver
      </button>
      <div class="game-header__title-block">
        <h1 class="gradient-text game-header__title">Verb Flip</h1>
        <div class="game-header__subtitle">Base ↔ Participle</div>
      </div>
      <div id="timer-target" class="game-header__timer"></div>
    </div>

    <!-- Match Status -->
    <div class="glass-panel stats-row">
      <div>
        <span class="stats-row__label">Progress</span>
        <div id="matches-counter" class="stats-row__value">0 / 6</div>
      </div>
      <div class="stats-row__divider"></div>
      <div>
        <span class="stats-row__label">Mistakes</span>
        <div id="mistakes-counter" class="stats-row__value" style="color: var(--color-danger);">0</div>
      </div>
    </div>

    <!-- Cards Grid -->
    <div id="grid-container" class="card-grid"></div>

    <!-- Sentence Banner -->
    <div id="sentence-banner" class="info-banner">
      Match the cards to see example sentences!
    </div>
  `;

  container.appendChild(content);

  // Initialize and start timer
  const timerTarget = content.querySelector('#timer-target') as HTMLElement;
  const timer = new TimerComponent(timerTarget, 60);
  timer.start();

  // Pick 6 random verb pairs
  const selectedPairs = [...VerbPairs].sort(() => 0.5 - Math.random()).slice(0, 6);

  // Create card deck
  interface DeckItem {
    id: string;
    matchId: string;
    text: string;
    example: string;
  }
  
  const deck: DeckItem[] = [];
  selectedPairs.forEach(v => {
    deck.push({ id: `${v.id}_base`, matchId: v.id, text: v.base, example: v.exampleSentence });
    deck.push({ id: `${v.id}_part`, matchId: v.id, text: v.participle, example: v.exampleSentence });
  });

  // Shuffle deck
  deck.sort(() => 0.5 - Math.random());

  // Instantiate card components
  const gridContainer = content.querySelector('#grid-container') as HTMLElement;
  const matchesCounter = content.querySelector('#matches-counter') as HTMLElement;
  const mistakesCounter = content.querySelector('#mistakes-counter') as HTMLElement;
  const sentenceBanner = content.querySelector('#sentence-banner') as HTMLElement;

  let firstFlipped: { card: CardComponent; item: DeckItem } | null = null;
  let secondFlipped: { card: CardComponent; item: DeckItem } | null = null;
  let matchesCount = 0;
  let mistakesCount = 0;
  let lockGrid = false;

  deck.forEach(item => {
    // constructor(id, matchId, frontContent, backContent)
    const cardComp = new CardComponent(item.id, item.matchId, '❓', item.text);
    gridContainer.appendChild(cardComp.el);

    cardComp.el.addEventListener('click', () => {
      if (lockGrid) return;
      if (cardComp.getState() !== 'hidden') return;

      cardComp.setState('revealed');

      if (!firstFlipped) {
        firstFlipped = { card: cardComp, item };
      } else if (!secondFlipped) {
        secondFlipped = { card: cardComp, item };
        checkMatch();
      }
    });

    return cardComp;
  });

  function checkMatch() {
    if (!firstFlipped || !secondFlipped) return;
    lockGrid = true;

    const isMatch = firstFlipped.item.matchId === secondFlipped.item.matchId;

    if (isMatch) {
      // Success match
      firstFlipped.card.setState('matched');
      secondFlipped.card.setState('matched');
      matchesCount++;
      matchesCounter.textContent = `${matchesCount} / 6`;
      playCorrectSound();

      // Show sentence example
      sentenceBanner.innerHTML = `💡 <strong>Sentence Example:</strong> "${firstFlipped.item.example}"`;
      sentenceBanner.style.opacity = '1';
      sentenceBanner.style.transform = 'translateY(0)';

      // Clear trackers
      firstFlipped = null;
      secondFlipped = null;
      lockGrid = false;

      // Update session statistics
      const session = { ...getState().sessionStats };
      session.correct++;
      setState({ sessionStats: session });

      if (matchesCount === 6) {
        victory();
      }
    } else {
      // Mismatch
      mistakesCount++;
      mistakesCounter.textContent = mistakesCount.toString();
      playWrongSound();

      firstFlipped.card.shake();
      secondFlipped.card.shake();

      // Add to review queue if not already there
      const currentQueue = [...getState().reviewQueue];
      if (!currentQueue.includes(firstFlipped.item.matchId)) {
        currentQueue.push(firstFlipped.item.matchId);
        setState({ reviewQueue: currentQueue });
      }

      // Update session statistics
      const session = { ...getState().sessionStats };
      session.wrong++;
      setState({ sessionStats: session });

      // Flip back after delay
      const fTemp = firstFlipped;
      const sTemp = secondFlipped;
      setTimeout(() => {
        fTemp.card.setState('hidden');
        sTemp.card.setState('hidden');
        lockGrid = false;
      }, 1000);

      firstFlipped = null;
      secondFlipped = null;
    }
  }

  function victory() {
    timer.stop();
    const remainingTime = timer.getRemainingSeconds();
    const timeTaken = 60 - remainingTime;
    
    // Calculate stars
    let stars: 0 | 1 | 2 | 3 = 1;
    if (mistakesCount <= 1 && remainingTime >= 25) {
      stars = 3;
    } else if (mistakesCount <= 3 && remainingTime >= 10) {
      stars = 2;
    }

    // Calculate score
    const score = Math.max(50, 600 + (remainingTime * 10) - (mistakesCount * 25));

    completeGame(0, score, stars, timeTaken);
    
    setTimeout(() => {
      navigate('results');
    }, 1000);
  }

  // Handle back button
  const btnBack = content.querySelector('#btn-back');
  btnBack?.addEventListener('click', () => {
    timer.stop();
    navigate('select');
  });

  // Handle timer expiration
  container.addEventListener('timer:expired', () => {
    // Set 0 stars game end
    const timeTaken = 60;
    const score = Math.max(20, matchesCount * 50 - mistakesCount * 10);
    completeGame(0, score, 0, timeTaken);
    navigate('results');
  });
}

