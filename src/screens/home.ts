import { PassportComponent } from '../components/passport';
import { getState } from '../state';

export function renderHome(container: HTMLElement, navigate: (screen: 'home' | 'select' | 'game' | 'results') => void) {
  const state = getState();
  
  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.alignItems = 'center';
  content.style.justifyContent = 'center';
  content.style.minHeight = '80vh';
  content.style.gap = '2rem';
  content.style.animation = 'slide-in-top 0.4s ease';

  content.innerHTML = `
    <div style="text-align: center;">
      <h1 style="color: var(--color-primary); font-size: 3rem; margin-bottom: 0.5rem;">Top Notch 2</h1>
      <h2 style="color: var(--color-text-muted); font-size: 1.5rem; font-weight: normal;">Unit 1: Getting Acquainted</h2>
    </div>
    
    <div id="passport-preview-container"></div>
    
    <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 300px;">
      <button id="btn-play" style="padding: 1rem; border-radius: var(--radius-md); border: none; background: var(--color-primary); color: white; font-size: 1.2rem; font-weight: bold; cursor: pointer; transition: transform 0.2s, background 0.2s;">
        Play
      </button>
      ${state.reviewQueue.length > 0 ? `
        <button id="btn-review" style="padding: 1rem; border-radius: var(--radius-md); border: 2px solid var(--color-amber); background: transparent; color: var(--color-amber); font-size: 1rem; font-weight: bold; cursor: pointer;">
          Review Mistakes
        </button>
      ` : ''}
      <button id="btn-stats" style="padding: 1rem; border-radius: var(--radius-md); border: none; background: var(--color-surface); color: var(--color-text); font-size: 1rem; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        Stats
      </button>
    </div>
  `;

  container.appendChild(content);

  const passportContainer = content.querySelector('#passport-preview-container') as HTMLElement;
  new PassportComponent(passportContainer, state.passport);

  const btnPlay = content.querySelector('#btn-play');
  btnPlay?.addEventListener('click', () => {
    navigate('select');
  });

  const btnReview = content.querySelector('#btn-review');
  btnReview?.addEventListener('click', () => {
    // Navigate to game mode 0 with a special state flag? For now just go to mode 0.
    // Full implementation would handle review queue in Verb Flip mode
    navigate('game');
  });
  
  // Hover effects
  (btnPlay as HTMLElement).addEventListener('mouseenter', () => (btnPlay as HTMLElement).style.transform = 'scale(1.05)');
  (btnPlay as HTMLElement).addEventListener('mouseleave', () => (btnPlay as HTMLElement).style.transform = 'scale(1)');
}
