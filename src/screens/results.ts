import { getState } from '../state';
import { playCompletionSound, playStampSound, playTone } from '../components/audio';

export function renderResults(
  container: HTMLElement,
  navigate: (screen: 'home' | 'select' | 'game' | 'results', modeIndex?: 0 | 1 | 2 | 3 | 4) => void
) {
  const state = getState();
  const lastResult = state.lastResult;

  if (!lastResult) {
    navigate('home');
    return;
  }

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
  content.className = 'glass-panel';
  Object.assign(content.style, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.75rem',
    maxWidth: '520px',
    margin: '3rem auto 0 auto',
    animation: 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    textAlign: 'center',
    position: 'relative',
    zIndex: '5'
  });

  const modeNames = [
    'Verb Flip',
    'Culture Clash',
    'Feeling vs. Thing',
    'Travel Tiles',
    'Time Detective'
  ];

  // Did the user unlock a stamp just now? (stamp earned in the last 10 seconds)
  const lastStamp = state.passport.find(s => s.mode === lastResult.mode);
  const earnedNewStamp = lastStamp && (Date.now() - lastStamp.dateEarned < 10000);

  // Layout structure
  content.innerHTML = `
    <div>
      <div style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; font-family: var(--font-display);">
        Game Completed • ${modeNames[lastResult.mode]}
      </div>
      <h1 class="gradient-text" style="font-size: 2.75rem; font-weight: 800; line-height: 1.1; margin-top: 0.25rem; font-family: var(--font-display);">
        ${lastResult.stars > 0 ? 'Excellent Work!' : 'Game Over'}
      </h1>
    </div>

    <!-- Stars Animation Area -->
    <div style="display: flex; gap: 1rem; font-size: 3.5rem; justify-content: center; height: 70px; align-items: center; user-select: none;">
      <span id="star-1" style="color: var(--color-border); opacity: 0.3; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">⭐</span>
      <span id="star-2" style="color: var(--color-border); opacity: 0.3; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">⭐</span>
      <span id="star-3" style="color: var(--color-border); opacity: 0.3; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">⭐</span>
    </div>

    <!-- Score metrics board -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; width: 100%;">
      <div style="background: rgba(255, 255, 255, 0.04); padding: 0.85rem; border-radius: var(--radius-md); border: var(--glass-border);">
        <div style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Score</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-primary); font-family: var(--font-display);">${lastResult.score}</div>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.04); padding: 0.85rem; border-radius: var(--radius-md); border: var(--glass-border);">
        <div style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Time</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-text); font-family: var(--font-display);">${lastResult.timeTaken}s</div>
      </div>
    </div>

    <!-- Earned stamp container -->
    ${earnedNewStamp ? `
      <div id="stamp-alert-container" style="background: rgba(245, 158, 11, 0.08); border: 1.5px solid rgba(245, 158, 11, 0.25); border-radius: var(--radius-md); padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem; text-align: left; width: 100%; animation: fade-in-up 0.5s ease 0.6s forwards; opacity: 0;">
        <div id="results-stamp-seal" style="width: 54px; height: 54px; flex-shrink: 0; position: relative;"></div>
        <div>
          <h4 style="color: var(--color-amber); font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; margin: 0 0 0.15rem 0;">Passport Stamp Unlocked!</h4>
          <p style="font-size: 0.8rem; color: var(--color-text-muted); margin: 0; line-height: 1.35;">You earned a new travel stamp in your Unit 1 achievement passport.</p>
        </div>
      </div>
    ` : ''}

    <!-- Action Buttons -->
    <div style="display: flex; flex-direction: column; gap: 0.85rem; width: 100%; max-width: 320px;">
      <button id="btn-replay" class="btn-premium btn-primary">
        <span>🔄</span> Play Again
      </button>
      <button id="btn-select" class="btn-premium btn-secondary">
        <span>🎮</span> Choose Another Mode
      </button>
      <button id="btn-home" class="btn-premium btn-secondary" style="background: transparent;">
        <span>🏠</span> Back to Home
      </button>
    </div>
  `;

  container.appendChild(content);

  // Animate stars sequentially with sound
  setTimeout(() => {
    const star1 = content.querySelector('#star-1') as HTMLElement;
    if (star1 && lastResult.stars >= 1) {
      star1.style.color = 'var(--color-amber)';
      star1.style.opacity = '1';
      star1.style.transform = 'scale(1.2)';
      playTone(329.63, 'sine', 0.1, 0.25); // E4
    }
  }, 400);

  setTimeout(() => {
    const star2 = content.querySelector('#star-2') as HTMLElement;
    if (star2 && lastResult.stars >= 2) {
      star2.style.color = 'var(--color-amber)';
      star2.style.opacity = '1';
      star2.style.transform = 'scale(1.2)';
      playTone(392.00, 'sine', 0.1, 0.25); // G4
    }
  }, 800);

  setTimeout(() => {
    const star3 = content.querySelector('#star-3') as HTMLElement;
    if (star3 && lastResult.stars >= 3) {
      star3.style.color = 'var(--color-amber)';
      star3.style.opacity = '1';
      star3.style.transform = 'scale(1.2)';
      playTone(523.25, 'sine', 0.12, 0.25); // C5
    }
  }, 1200);

  // Play final completion musical cue
  setTimeout(() => {
    if (lastResult.stars > 0) {
      playCompletionSound();
    }
  }, 1600);

  // Animate stamp alert and draw the stamp seal
  if (earnedNewStamp && lastStamp) {
    const sealContainer = content.querySelector('#results-stamp-seal') as HTMLElement;
    
    // Draw seal
    const colors = [
      'linear-gradient(135deg, #e11d48, #9f1239)',
      'linear-gradient(135deg, #059669, #065f46)',
      'linear-gradient(135deg, #d97706, #92400e)',
      'linear-gradient(135deg, #2563eb, #1e40af)',
      'linear-gradient(135deg, #7c3aed, #5b21b6)'
    ];
    const color = colors[lastStamp.mode % colors.length];
    
    const seal = document.createElement('div');
    Object.assign(seal.style, {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: color,
      border: '2px double #f59e0b',
      color: '#fef3c7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '0.45rem',
      textAlign: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      transform: 'scale(0) rotate(-45deg)',
      opacity: '0'
    });
    
    const icons: Record<string, string> = {
      'star': '⭐',
      'check': '✅',
      'plane': '✈️',
      'trophy': '🏆'
    };
    const icon = icons[lastStamp.iconName] || '🌟';
    
    seal.innerHTML = `
      <div style="font-size: 1rem; margin-bottom: 1px;">${icon}</div>
      <div style="font-family: var(--font-display); font-weight: 700; transform: scale(0.85);">MODULE ${lastStamp.mode + 1}</div>
    `;
    
    sealContainer.appendChild(seal);

    // Stamp animation landing trigger
    setTimeout(() => {
      seal.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      seal.style.transform = 'scale(1) rotate(-10deg)';
      seal.style.opacity = '1';
      playStampSound();
    }, 1100);
  }

  // Bind Buttons
  const btnReplay = content.querySelector('#btn-replay');
  btnReplay?.addEventListener('click', () => {
    navigate('game', lastResult.mode as 0 | 1 | 2 | 3 | 4);
  });

  const btnSelect = content.querySelector('#btn-select');
  btnSelect?.addEventListener('click', () => {
    navigate('select');
  });

  const btnHome = content.querySelector('#btn-home');
  btnHome?.addEventListener('click', () => {
    navigate('home');
  });
}

