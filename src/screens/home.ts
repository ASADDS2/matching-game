import { PassportComponent } from '../components/passport';
import { getState } from '../state';
import { StatsModalComponent } from '../components/stats-modal';

export function renderHome(container: HTMLElement, navigate: (screen: 'home' | 'select' | 'game' | 'results') => void) {
  const state = getState();
  
  // Clear any existing contents
  container.innerHTML = '';
  
  // Create background blobs for premium aesthetic
  const blob1 = document.createElement('div');
  blob1.className = 'bg-blob bg-blob-1';
  container.appendChild(blob1);

  const blob2 = document.createElement('div');
  blob2.className = 'bg-blob bg-blob-2';
  container.appendChild(blob2);

  const isMobile = window.innerWidth <= 480;

  // Home Screen Content Wrapper
  const content = document.createElement('div');
  content.className = 'glass-panel home-content';
  Object.assign(content.style, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '1rem' : '2rem',
    maxWidth: '560px',
    width: '100%',
    margin: isMobile ? '0.75rem auto 0 auto' : '3rem auto 0 auto',
    animation: 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    textAlign: 'center',
    position: 'relative',
    zIndex: '5'
  });

  content.innerHTML = `
    <!-- Top badge -->
    <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: var(--color-primary); padding: 0.3rem 0.8rem; border-radius: 50px; font-size: ${isMobile ? '0.7rem' : '0.8rem'}; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: -0.25rem; font-family: var(--font-display);">
      Unit 1
    </div>
    
    <div>
      <h1 class="gradient-text" style="font-size: clamp(1.75rem, 8vw, 3.25rem); font-weight: 800; line-height: 1.1; margin-bottom: 0.4rem; letter-spacing: -0.5px;">Top Notch 2</h1>
      <h2 style="color: var(--color-text-muted); font-size: clamp(0.9rem, 4vw, 1.25rem); font-weight: 500; font-family: var(--font-body);">Getting Acquainted</h2>
    </div>
    
    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.4rem; width: 100%;">
      <div style="font-size: ${isMobile ? '0.7rem' : '0.8rem'}; color: var(--color-text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-family: var(--font-display);">
        Your Achievement Passport
      </div>
      <div id="passport-preview-container" style="animation: float 6s ease-in-out infinite;"></div>
    </div>
    
    <div class="home-buttons" style="display: flex; flex-direction: column; gap: 0.7rem; width: 100%; max-width: ${isMobile ? '100%' : '320px'};">
      <button id="btn-play" class="btn-premium btn-primary">
        <span>🎮</span> Play
      </button>
      
      ${state.reviewQueue.length > 0 ? `
        <button id="btn-review" class="btn-premium btn-accent">
          <span>🔄</span> Review Mistakes
        </button>
      ` : ''}
      
      <button id="btn-stats" class="btn-premium btn-secondary">
        <span>📊</span> Statistics
      </button>
    </div>
  `;

  container.appendChild(content);

  // Initialize Achievement Passport
  const passportContainer = content.querySelector('#passport-preview-container') as HTMLElement;
  new PassportComponent(passportContainer, state.passport);

  // Event handlers
  const btnPlay = content.querySelector('#btn-play');
  btnPlay?.addEventListener('click', () => {
    navigate('select');
  });

  const btnReview = content.querySelector('#btn-review');
  btnReview?.addEventListener('click', () => {
    // Navigate to default game mode if review queue is populated
    navigate('game');
  });

  const btnStats = content.querySelector('#btn-stats');
  btnStats?.addEventListener('click', () => {
    const modal = new StatsModalComponent(container, () => {
      // On reset callback: refresh the home screen
      renderHome(container, navigate);
    });
    modal.open();
  });
}

