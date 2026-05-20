import { getState } from '../state';

export function renderModeSelect(
  container: HTMLElement,
  navigate: (screen: 'home' | 'select' | 'game' | 'results', modeIndex?: 0 | 1 | 2 | 3 | 4) => void
) {
  const state = getState();
  
  // Clear any existing contents
  container.innerHTML = '';

  // Create background blobs for aesthetic
  const blob1 = document.createElement('div');
  blob1.className = 'bg-blob bg-blob-1';
  container.appendChild(blob1);

  const blob2 = document.createElement('div');
  blob2.className = 'bg-blob bg-blob-2';
  container.appendChild(blob2);

  const content = document.createElement('div');
  content.style.width = '100%';
  content.style.maxWidth = '1000px';
  content.style.margin = '1rem auto 0 auto';
  content.style.animation = 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
  content.style.position = 'relative';
  content.style.zIndex = '5';

  const modes = [
    {
      index: 0,
      title: 'Verb Flip',
      emoji: '🔄',
      subtitle: 'Verbs & Participles',
      desc: 'Empareja verbos en infinitivo con su participio irregular. ¡Perfecciona tus tiempos verbales!',
      tag: 'Grammar • Verbs'
    },
    {
      index: 1,
      title: 'Culture Clash',
      emoji: '🤝',
      subtitle: 'Gestures & Etiquette',
      desc: 'Relaciona saludos y gestos con sus regiones y consejos de etiqueta en todo el mundo.',
      tag: 'Culture • Communication'
    },
    {
      index: 2,
      title: 'Feeling vs. Thing',
      emoji: '🤔',
      subtitle: 'Adjectives -ed / -ing',
      desc: 'Aprende cuándo usar adjetivos terminados en -ed (sentimiento) vs -ing (lo que causa la emoción).',
      tag: 'Adjectives • Vocabulary'
    },
    {
      index: 3,
      title: 'Travel Tiles',
      emoji: '✈️',
      subtitle: 'Tourism Vocabulary',
      desc: 'Empareja frases comunes sobre viajes y turismo con sus significados para recorrer el mundo.',
      tag: 'Travel • Idioms'
    },
    {
      index: 4,
      title: 'Time Detective',
      emoji: '🕵️‍♂️',
      subtitle: 'Past vs. Present Perfect',
      desc: 'Clasifica casos policiales de oraciones en Pasado Simple o Presente Perfecto analizando las pistas.',
      tag: 'Tenses • Syntax'
    }
  ];

  content.innerHTML = `
    <!-- Top Bar with Back Button -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
      <button id="btn-back" class="btn-premium btn-secondary" style="padding: 0.6rem 1.2rem; font-size: 0.95rem;">
        ← Volver
      </button>
      <h1 class="gradient-text" style="font-size: 2.25rem; font-weight: 800; margin: 0; font-family: var(--font-display);">Modos de Juego</h1>
      <div style="width: 100px;"></div> <!-- Spacer to center the title -->
    </div>

    <!-- Grid of game modes -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; width: 100%;">
      ${modes.map(mode => {
        const score = state.scores[mode.index] || { stars: 0, bestScore: 0 };
        const starText = '⭐'.repeat(score.stars) + '☆'.repeat(3 - score.stars);
        return `
          <div class="glass-panel mode-card" data-mode-index="${mode.index}" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; cursor: pointer; text-align: left; height: 100%;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between;">
              <div style="font-size: 2.5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));">${mode.emoji}</div>
              <div style="font-size: 0.75rem; font-weight: 700; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: var(--color-primary); padding: 0.2rem 0.6rem; border-radius: 20px; font-family: var(--font-display);">
                ${mode.tag}
              </div>
            </div>
            
            <div>
              <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 700; margin: 0 0 0.15rem 0; color: var(--color-text);">${mode.title}</h3>
              <div style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600;">${mode.subtitle}</div>
            </div>
            
            <p style="font-size: 0.88rem; color: var(--color-text-muted); margin: 0; line-height: 1.45; flex-grow: 1;">
              ${mode.desc}
            </p>
            
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--color-border); padding-top: 0.85rem; margin-top: 0.5rem;">
              <div style="font-size: 0.8rem; color: var(--color-text-muted);">
                Récord: <span style="font-weight: 700; color: var(--color-text);">${score.bestScore}</span>
              </div>
              <div style="color: var(--color-amber); font-size: 0.95rem; letter-spacing: 1px;">
                ${starText}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.appendChild(content);

  // Back action
  const btnBack = content.querySelector('#btn-back');
  btnBack?.addEventListener('click', () => navigate('home'));

  // Card click actions
  const cards = content.querySelectorAll('.mode-card');
  cards.forEach(card => {
    const el = card as HTMLElement;
    const modeIdx = parseInt(el.dataset.modeIndex || '0') as 0|1|2|3|4;
    
    // Hover animation triggers
    el.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'translateY(-6px)';
      el.style.borderColor = 'var(--color-primary)';
      el.style.boxShadow = '0 12px 24px -10px rgba(59, 130, 246, 0.3), var(--glass-shadow)';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translateY(0)';
      el.style.borderColor = 'var(--color-border)';
      el.style.boxShadow = 'var(--glass-shadow)';
    });
    
    el.addEventListener('click', () => {
      navigate('game', modeIdx);
    });
  });
}

