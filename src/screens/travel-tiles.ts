import { CardComponent } from '../components/card';
import { TimerComponent } from '../components/timer';
import { TravelPhrases } from '../game-data';
import { playCorrectSound, playWrongSound } from '../components/audio';
import { getState, setState, completeGame } from '../state';

export function renderTravelTiles(
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
        <h1 class="gradient-text" style="font-size: 1.8rem; font-weight: 800; margin: 0; font-family: var(--font-display);">Travel Tiles</h1>
        <div style="font-size: 0.8rem; color: var(--color-text-muted); text-align: center;">Phrases ↔ Definitions</div>
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

    <!-- Info message -->
    <div style="font-size: 0.85rem; color: var(--color-text-muted); font-weight: 500; text-align: center; margin-bottom: -0.5rem;">
      ⚡ ¡Todas las tarjetas están boca arriba! Haz clic en una frase y luego en su definición.
    </div>

    <!-- Cards Grid -->
    <div id="grid-container" style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 0.25rem;"></div>

    <!-- City Banner -->
    <div id="city-banner" style="min-height: 52px; background: rgba(59, 130, 246, 0.06); border: 1px dashed var(--color-primary); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: var(--color-text); font-weight: 500; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; text-align: center; opacity: 0; transform: translateY(10px); transition: all 0.3s ease;">
      Encuentra las parejas para explorar las ciudades.
    </div>
  `;

  container.appendChild(content);

  // Initialize and start timer
  const timerTarget = content.querySelector('#timer-target') as HTMLElement;
  const timer = new TimerComponent(timerTarget, 60);
  timer.start();

  // Pick 6 random travel phrases
  const selectedPhrases = [...TravelPhrases].sort(() => 0.5 - Math.random()).slice(0, 6);

  interface DeckItem {
    id: string;
    matchId: string;
    text: string;
    city: string;
    icon: string;
    type: 'phrase' | 'definition';
  }

  const deck: DeckItem[] = [];

  const travelIcons: Record<string, string> = {
    'camera': '📸',
    'map': '🗺️',
    'photo': '🖼️',
    'food': '🍜',
    'mountain': '⛰️',
    'tower': '🗼',
    'museum': '🏛️',
    'bike': '🚲',
    'gift': '🎁'
  };

  selectedPhrases.forEach(t => {
    const icon = travelIcons[t.iconName] || '✈️';
    deck.push({
      id: `${t.id}_phrase`,
      matchId: t.id,
      text: `<div style="font-size: 1.5rem; margin-bottom: 2px;">${icon}</div><div style="font-weight: 800; font-size: 0.85rem; color: var(--color-primary);">${t.phrase}</div>`,
      city: t.exampleCity,
      icon: icon,
      type: 'phrase'
    });
    deck.push({
      id: `${t.id}_def`,
      matchId: t.id,
      text: `<div style="font-size: 0.72rem; line-height: 1.35; padding: 0.2rem;">${t.definition}</div>`,
      city: t.exampleCity,
      icon: icon,
      type: 'definition'
    });
  });

  // Shuffle
  deck.sort(() => 0.5 - Math.random());

  const gridContainer = content.querySelector('#grid-container') as HTMLElement;
  const matchesCounter = content.querySelector('#matches-counter') as HTMLElement;
  const mistakesCounter = content.querySelector('#mistakes-counter') as HTMLElement;
  const cityBanner = content.querySelector('#city-banner') as HTMLElement;

  let selectedFlipped: { card: CardComponent; item: DeckItem } | null = null;
  let matchesCount = 0;
  let mistakesCount = 0;
  let lockGrid = false;

  deck.forEach(item => {
    const cardComp = new CardComponent(item.id, item.matchId, '✈️', item.text);
    gridContainer.appendChild(cardComp.el);
    
    // Reveal immediately for face-up speed matching
    cardComp.setState('revealed');
    cardComp.el.style.pointerEvents = 'auto';

    cardComp.el.addEventListener('click', () => {
      if (lockGrid) return;
      if (cardComp.getState() === 'matched') return;

      const inner = cardComp.el.querySelector('.card-inner') as HTMLElement;

      if (!selectedFlipped) {
        // First selection
        selectedFlipped = { card: cardComp, item };
        inner.style.border = '2.5px solid var(--color-primary)';
        inner.style.boxShadow = '0 0 12px rgba(59, 130, 246, 0.4)';
      } else {
        // Clicked the same card again to deselect
        if (selectedFlipped.card.id === cardComp.id) {
          inner.style.border = '2px solid var(--color-border)';
          inner.style.boxShadow = 'none';
          selectedFlipped = null;
          return;
        }

        // Clicked another card
        const first = selectedFlipped;
        const second = { card: cardComp, item };

        // Ensure we matched phrase to definition (no matching phrase to phrase)
        if (first.item.type === second.item.type) {
          // Deselect first, select second
          const firstInner = first.card.el.querySelector('.card-inner') as HTMLElement;
          firstInner.style.border = '2px solid var(--color-border)';
          firstInner.style.boxShadow = 'none';

          selectedFlipped = second;
          inner.style.border = '2.5px solid var(--color-primary)';
          inner.style.boxShadow = '0 0 12px rgba(59, 130, 246, 0.4)';
          return;
        }

        checkMatch(first, second);
      }
    });

    return cardComp;
  });

  function checkMatch(
    first: { card: CardComponent; item: DeckItem },
    second: { card: CardComponent; item: DeckItem }
  ) {
    lockGrid = true;
    const isMatch = first.item.matchId === second.item.matchId;

    const firstInner = first.card.el.querySelector('.card-inner') as HTMLElement;
    const secondInner = second.card.el.querySelector('.card-inner') as HTMLElement;

    if (isMatch) {
      first.card.setState('matched');
      second.card.setState('matched');
      matchesCount++;
      matchesCounter.textContent = `${matchesCount} / 6`;
      playCorrectSound();

      // Show travel facts
      const matchingPhrase = TravelPhrases.find(t => t.id === first.item.matchId);
      if (matchingPhrase) {
        cityBanner.innerHTML = `${first.item.icon} <strong>${matchingPhrase.phrase}</strong> — e.g. visit 📍 <em>${first.item.city}</em>!`;
        cityBanner.style.opacity = '1';
        cityBanner.style.transform = 'translateY(0)';
      }

      selectedFlipped = null;
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

      first.card.shake();
      second.card.shake();

      // Add to mistakes queue
      const currentQueue = [...getState().reviewQueue];
      if (!currentQueue.includes(first.item.matchId)) {
        currentQueue.push(first.item.matchId);
        setState({ reviewQueue: currentQueue });
      }

      const session = { ...getState().sessionStats };
      session.wrong++;
      setState({ sessionStats: session });

      // Reset card borders after delay
      setTimeout(() => {
        firstInner.style.border = '2px solid var(--color-border)';
        firstInner.style.boxShadow = 'none';
        secondInner.style.border = '2px solid var(--color-border)';
        secondInner.style.boxShadow = 'none';
        lockGrid = false;
      }, 1000);

      selectedFlipped = null;
    }
  }

  function victory() {
    timer.stop();
    const remainingTime = timer.getRemainingSeconds();
    const timeTaken = 60 - remainingTime;

    let stars: 0 | 1 | 2 | 3 = 1;
    if (mistakesCount <= 1 && remainingTime >= 30) {
      stars = 3;
    } else if (mistakesCount <= 3 && remainingTime >= 15) {
      stars = 2;
    }

    const score = Math.max(50, 600 + (remainingTime * 10) - (mistakesCount * 30));

    completeGame(3, score, stars, timeTaken);

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
    completeGame(3, score, 0, timeTaken);
    navigate('results');
  });
}

