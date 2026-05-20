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
  content.style.width = '100%';
  content.style.maxWidth = '800px';
  content.style.margin = '1rem auto 0 auto';
  content.style.animation = 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
  content.style.position = 'relative';
  content.style.zIndex = '5';
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.gap = '1.5rem';

  // Game UI Header
  content.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <button id="btn-back" class="btn-premium btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
        ← Volver
      </button>
      <div>
        <h1 class="gradient-text" style="font-size: 1.8rem; font-weight: 800; margin: 0; font-family: var(--font-display);">Culture Clash</h1>
        <div style="font-size: 0.8rem; color: var(--color-text-muted); text-align: center;">Gestures ↔ Culture Tips</div>
      </div>
      <div id="timer-target" style="width: 60px; height: 60px;"></div>
    </div>

    <!-- Match Status -->
    <div class="glass-panel" style="padding: 1rem; display: flex; justify-content: space-around; align-items: center; border-radius: var(--radius-md);">
      <div>
        <span style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Progreso</span>
        <div id="matches-counter" style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-display);">0 / 6</div>
      </div>
      <div style="width: 1px; height: 30px; background: var(--color-border);"></div>
      <div>
        <span style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Errores</span>
        <div id="mistakes-counter" style="font-size: 1.4rem; font-weight: 800; color: var(--color-danger); font-family: var(--font-display);">0</div>
      </div>
    </div>

    <!-- Cards Grid -->
    <div id="grid-container" style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 0.25rem;"></div>

    <!-- Tip Banner -->
    <div id="tip-banner" style="min-height: 60px; background: rgba(59, 130, 246, 0.06); border: 1px dashed var(--color-primary); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--color-text); font-weight: 500; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; text-align: center; opacity: 0; transform: translateY(10px); transition: all 0.3s ease;">
      ¡Encuentra las parejas para aprender sobre costumbres mundiales!
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
    'bow': '🙇',
    'kiss': '💋',
    'hug': '🤗',
    'fist_bump': '👊',
    'nod': '🙋‍♂️'
  };

  const gestureNames: Record<string, string> = {
    'shake_hands': 'Apretón de Manos',
    'bow': 'Inclinación',
    'kiss': 'Beso en Mejilla',
    'hug': 'Abrazo',
    'fist_bump': 'Choque de Puños',
    'nod': 'Asentir Cabeza'
  };

  GesturePairs.forEach(g => {
    const emoji = gestureEmojis[g.gesture] || '👋';
    const name = gestureNames[g.gesture] || g.gesture;

    deck.push({
      id: `${g.id}_gest`,
      matchId: g.id,
      text: `<div style="font-size: 1.5rem; margin-bottom: 2px;">${emoji}</div><div style="font-weight:700; font-size: 0.78rem;">${name}</div><div style="font-size: 0.65rem; color: var(--color-text-muted); line-height: 1.2; margin-top: 4px;">${g.description}</div>`,
      tip: g.cultureTip,
      type: 'gesture'
    });

    deck.push({
      id: `${g.id}_tip`,
      matchId: g.id,
      text: `<div style="font-weight:700; color: var(--color-primary); font-size: 0.78rem; margin-bottom: 4px;">📍 ${g.region}</div><div style="font-size: 0.68rem; line-height: 1.3;">${g.cultureTip}</div>`,
      tip: g.cultureTip,
      type: 'tip'
    });
  });

  // Shuffle
  deck.sort(() => 0.5 - Math.random());

  const gridContainer = content.querySelector('#grid-container') as HTMLElement;
  const matchesCounter = content.querySelector('#matches-counter') as HTMLElement;
  const mistakesCounter = content.querySelector('#mistakes-counter') as HTMLElement;
  const tipBanner = content.querySelector('#tip-banner') as HTMLElement;

  let firstFlipped: { card: CardComponent; item: DeckItem } | null = null;
  let secondFlipped: { card: CardComponent; item: DeckItem } | null = null;
  let matchesCount = 0;
  let mistakesCount = 0;
  let lockGrid = false;

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

      tipBanner.innerHTML = `💡 <strong>Custom Tip:</strong> "${firstFlipped.item.tip}"`;
      tipBanner.style.opacity = '1';
      tipBanner.style.transform = 'translateY(0)';

      firstFlipped = null;
      secondFlipped = null;
      lockGrid = false;

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

      firstFlipped = null;
      secondFlipped = null;
    }
  }

  function victory() {
    timer.stop();
    const remainingTime = timer.getRemainingSeconds();
    const timeTaken = 60 - remainingTime;

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
    const score = Math.max(20, matchesCount * 50 - mistakesCount * 10);
    completeGame(1, score, 0, timeTaken);
    navigate('results');
  });
}

