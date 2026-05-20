import { getState, setState, defaultState } from '../state';

export class StatsModalComponent {
  private container: HTMLElement;
  private overlay: HTMLDivElement | null = null;
  private onReset: () => void;

  constructor(container: HTMLElement, onReset: () => void) {
    this.container = container;
    this.onReset = onReset;
  }

  public open() {
    this.createUI();
  }

  private createUI() {
    const state = getState();

    // Create backdrop overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-backdrop';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(5, 8, 22, 0.7)',
      backdropFilter: 'blur(10px)',
      webkitBackdropFilter: 'blur(10px)',
      zIndex: '2000',
      animation: 'fade-in 0.3s ease forwards'
    });
    this.overlay = overlay;

    // Create modal content panel
    const modal = document.createElement('div');
    modal.className = 'glass-panel';
    Object.assign(modal.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '480px',
      maxHeight: '85vh',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      animation: 'modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      zIndex: '2001',
      padding: '2rem',
      borderRadius: 'var(--radius-lg)'
    });

    const modeNames = [
      'Verb Flip',
      'Culture Clash',
      'Feeling vs. Thing',
      'Travel Tiles',
      'Time Detective'
    ];

    // Compute stats
    const totalStamps = state.passport.length;
    const totalCorrect = state.sessionStats.correct;
    const totalWrong = state.sessionStats.wrong;
    const totalAnswers = totalCorrect + totalWrong;
    const accuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

    // Content HTML
    modal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem;">
        <h2 style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; margin: 0;" class="gradient-text">Stats & Options</h2>
        <button id="btn-modal-close" style="background: none; border: none; font-size: 1.75rem; cursor: pointer; color: var(--color-text-muted); line-height: 1; transition: color 0.2s;">&times;</button>
      </div>

      <!-- Quick Session Stats -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
        <div style="background: rgba(255, 255, 255, 0.04); padding: 0.85rem; border-radius: var(--radius-md); text-align: center; border: var(--glass-border);">
          <div style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Stamps Earned</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--color-amber); font-family: var(--font-display); margin-top: 0.25rem;">${totalStamps} / 9</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.04); padding: 0.85rem; border-radius: var(--radius-md); text-align: center; border: var(--glass-border);">
          <div style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Session Accuracy</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--color-primary); font-family: var(--font-display); margin-top: 0.25rem;">${accuracy}%</div>
        </div>
      </div>

      <!-- Best Scores per Mode -->
      <div>
        <h3 style="font-family: var(--font-display); font-size: 1.05rem; margin-bottom: 0.6rem; color: var(--color-text); font-weight: 600;">High Scores</h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${[0, 1, 2, 3, 4].map(idx => {
      const score = state.scores[idx] || { stars: 0, bestScore: 0 };
      const starText = '⭐'.repeat(score.stars) + '☆'.repeat(3 - score.stars);
      return `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.85rem; background: rgba(255, 255, 255, 0.02); border-radius: var(--radius-md); border: var(--glass-border);">
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem; color: var(--color-text);">${modeNames[idx]}</div>
                  <div style="font-size: 0.75rem; color: var(--color-text-muted);">Best: <span style="font-weight: 600; color: var(--color-text);">${score.bestScore}</span> pts</div>
                </div>
                <div style="color: var(--color-amber); font-size: 1rem; letter-spacing: 1px;">${starText}</div>
              </div>
            `;
    }).join('')}
        </div>
      </div>

      <!-- Audio Switcher -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.85rem; background: rgba(255, 255, 255, 0.02); border-radius: var(--radius-md); border: var(--glass-border);">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span id="audio-icon" style="font-size: 1.2rem;">${state.audioEnabled ? '🔊' : '🔇'}</span>
          <span style="font-weight: 600; font-size: 0.9rem; color: var(--color-text);">Sound Effects</span>
        </div>
        <label class="switch" style="position: relative; display: inline-block; width: 44px; height: 24px;">
          <input type="checkbox" id="chk-audio" ${state.audioEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
          <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
        </label>
      </div>

      <!-- Danger Zone / Reset -->
      <div style="margin-top: 0.5rem; display: flex; justify-content: center;">
        <button id="btn-reset-data" style="background: transparent; border: 1.5px solid var(--color-danger); color: var(--color-danger); font-size: 0.85rem; padding: 0.45rem 1rem; border-radius: var(--radius-md); cursor: pointer; font-weight: 600; transition: all 0.2s;">
          Reset Progress
        </button>
      </div>
    `;

    overlay.appendChild(modal);
    this.container.appendChild(overlay);

    // Style the custom switch sliders
    const slider = modal.querySelector('.slider') as HTMLElement;
    const checkbox = modal.querySelector('#chk-audio') as HTMLInputElement;
    const updateSliderStyle = () => {
      if (checkbox.checked) {
        slider.style.backgroundColor = 'var(--color-primary)';
        slider.style.boxShadow = '0 0 8px rgba(59, 130, 246, 0.4)';
      } else {
        slider.style.backgroundColor = '#64748b';
        slider.style.boxShadow = 'none';
      }
    };
    updateSliderStyle();

    // Custom slider thumb styling
    const thumb = document.createElement('span');
    Object.assign(thumb.style, {
      position: 'absolute',
      content: '""',
      height: '16px',
      width: '16px',
      left: '4px',
      bottom: '4px',
      backgroundColor: 'white',
      transition: '.4s',
      borderRadius: '50%',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    });
    slider.appendChild(thumb);

    const updateThumbPos = () => {
      if (checkbox.checked) {
        thumb.style.transform = 'translateX(20px)';
      } else {
        thumb.style.transform = 'translateX(0px)';
      }
    };
    updateThumbPos();

    // Event listeners
    checkbox.addEventListener('change', () => {
      setState({ audioEnabled: checkbox.checked });
      const icon = modal.querySelector('#audio-icon') as HTMLElement;
      icon.textContent = checkbox.checked ? '🔊' : '🔇';
      updateSliderStyle();
      updateThumbPos();
    });

    const btnClose = modal.querySelector('#btn-modal-close');
    btnClose?.addEventListener('click', () => this.close());

    // Close on clicking backdrop
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close();
      }
    });

    const btnReset = modal.querySelector('#btn-reset-data') as HTMLButtonElement;
    btnReset.addEventListener('click', () => {
      const confirmReset = window.confirm('Are you sure you want to reset all your progress? Your best scores and passport will be erased.');
      if (confirmReset) {
        setState(defaultState);
        this.close();
        this.onReset();
      }
    });

    // Hover effect on reset button
    btnReset.addEventListener('mouseenter', () => {
      btnReset.style.backgroundColor = 'var(--color-danger)';
      btnReset.style.color = 'white';
    });
    btnReset.addEventListener('mouseleave', () => {
      btnReset.style.backgroundColor = 'transparent';
      btnReset.style.color = 'var(--color-danger)';
    });
  }

  public close() {
    if (this.overlay) {
      this.overlay.style.animation = 'fade-in 0.2s ease reverse forwards';
      const modal = this.overlay.querySelector('.glass-panel') as HTMLElement;
      if (modal) {
        modal.style.animation = 'modal-in 0.2s ease reverse forwards';
      }
      setTimeout(() => {
        this.overlay?.remove();
        this.overlay = null;
      }, 200);
    }
  }
}
