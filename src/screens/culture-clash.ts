import { CardComponent } from '../components/card';
import { TimerComponent } from '../components/timer';
import { GesturePairs } from '../game-data';
import { playCorrectSound, playWrongSound } from '../components/audio';
import { getState, setState, completeGame } from '../state';

export function renderCultureClash(
  container: HTMLElement,
  navigate: (screen: 'home' | 'select' | 'game' | 'results', modeIndex?: 0 | 1 | 2 | 3 | 4) => void
) {
  // Clear container
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
        ← Back
      </button>
      <div class="game-header__title-block">
        <h1 class="gradient-text game-header__title">Culture Clash</h1>
        <div class="game-header__subtitle">Gestures ↔ Culture Tips</div>
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

    <!-- Tip Banner -->
    <div id="tip-banner" class="info-banner">
      Find the pairs to discover world customs!
    </div>
  `;

  container.appendChild(content);

  // Initialize and start timer
  const timerTarget = content.querySelector('#timer-target') as HTMLElement;
  const timer = new TimerComponent(timerTarget, 60);
  timer.start();

  interface DeckItem {
    id: string;
    matchId: string;
    text: string;
    tip: string;
    type: 'gesture' | 'tip';
  }

  const deck: DeckItem[] = [];

  const gestureEmojis: Record<string, string> = {
    'shake_hands': '🤝',
    'bow':         '🙇',
    'kiss':        '💋',
    'hug':         '🤗',
    'fist_bump':   '👊',
    'nod':         '🙋‍♂️'
  };

  const gestureNames: Record<string, string> = {
    'shake_hands': 'Handshake',
    'bow':         'Bow',
    'kiss':        'Cheek Kiss',
    'hug':         'Hug',
    'fist_bump':   'Fist Bump',
    'nod':         'Head Nod'
  };

  GesturePairs.forEach(g => {
    const emoji = gestureEmojis[g.gesture] || '👋';
    const name  = gestureNames[g.gesture]  || g.gesture;

    const cardContent = `<div style="font-size: 2rem; margin-bottom: 4px;">${emoji}</div><div style="font-weight:800; font-size: 0.85rem; color: var(--color-text); line-height: 1.2;">${name}</div>`;

    deck.push({
      id: `${g.id}_gest_1`,
      matchId: g.id,
      text: cardContent,
      tip: g.cultureTip,
      type: 'gesture'
    });

    deck.push({
      id: `${g.id}_gest_2`,
      matchId: g.id,
      text: cardContent,
      tip: g.cultureTip,
      type: 'gesture'
    });
  });

  // Shuffle
  deck.sort(() => 0.5 - Math.random());

  const gridContainer    = content.querySelector('#grid-container')    as HTMLElement;
  const matchesCounter   = content.querySelector('#matches-counter')   as HTMLElement;
  const mistakesCounter  = content.querySelector('#mistakes-counter')  as HTMLElement;
  const tipBanner        = content.querySelector('#tip-banner')        as HTMLElement;

  let firstFlipped:  { card: CardComponent; item: DeckItem } | null = null;
  let secondFlipped: { card: CardComponent; item: DeckItem } | null = null;
  let matchesCount  = 0;
  let mistakesCount = 0;
  let lockGrid      = false;

  deck.forEach(item => {
    const cardComp = new CardComponent(item.id, item.matchId, '🌍', item.text);
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
      firstFlipped.card.setState('matched');
      secondFlipped.card.setState('matched');
      matchesCount++;
      matchesCounter.textContent = `${matchesCount} / 6`;
      playCorrectSound();

      tipBanner.innerHTML = `💡 <strong>Culture Tip:</strong> "${firstFlipped.item.tip}"`;
      tipBanner.style.opacity    = '1';
      tipBanner.style.transform  = 'translateY(0)';

      firstFlipped  = null;
      secondFlipped = null;
      lockGrid      = false;

      const session = { ...getState().sessionStats };
      session.correct++;
      setState({ sessionStats: session });

      if (matchesCount === 6) {
        victory();
      }
    } else {
      mistakesCount++;
      mistakesCounter.textContent = mistakesCount.toString();
      playWrongSound();

      firstFlipped.card.shake();
      secondFlipped.card.shake();

      const currentQueue = [...getState().reviewQueue];
      if (!currentQueue.includes(firstFlipped.item.matchId)) {
        currentQueue.push(firstFlipped.item.matchId);
        setState({ reviewQueue: currentQueue });
      }

      const session = { ...getState().sessionStats };
      session.wrong++;
      setState({ sessionStats: session });

      const fTemp = firstFlipped;
      const sTemp = secondFlipped;
      setTimeout(() => {
        fTemp.card.setState('hidden');
        sTemp.card.setState('hidden');
        lockGrid = false;
      }, 1200);

      firstFlipped  = null;
      secondFlipped = null;
    }
  }

  function victory() {
    timer.stop();
    const remainingTime = timer.getRemainingSeconds();
    const timeTaken     = 60 - remainingTime;

    let stars: 0 | 1 | 2 | 3 = 1;
    if (mistakesCount <= 1 && remainingTime >= 25) {
      stars = 3;
    } else if (mistakesCount <= 3 && remainingTime >= 10) {
      stars = 2;
    }

    const score = Math.max(50, 600 + (remainingTime * 10) - (mistakesCount * 25));

    completeGame(1, score, stars, timeTaken);

    setTimeout(() => {
      navigate('results');
    }, 1000);
  }

  const btnBack = content.querySelector('#btn-back');
  btnBack?.addEventListener('click', () => {
    timer.stop();
    navigate('select');
  });

  container.addEventListener('timer:expired', () => {
    const timeTaken = 60;
    const score     = Math.max(20, matchesCount * 50 - mistakesCount * 10);
    completeGame(1, score, 0, timeTaken);
    navigate('results');
  });
}