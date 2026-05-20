export class TimerComponent {
  private el: HTMLElement;
  private totalSeconds: number;
  private currentSeconds: number;
  private intervalId: number | null = null;
  private svgCircle: SVGCircleElement | null = null;
  private textEl: SVGTextElement | null = null;

  constructor(container: HTMLElement, totalSeconds: number) {
    this.totalSeconds = totalSeconds;
    this.currentSeconds = totalSeconds;
    
    this.el = document.createElement('div');
    this.el.className = 'timer-container';
    
    this.render();
    container.appendChild(this.el);
  }

  private render() {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    
    this.el.innerHTML = `
      <svg width="60" height="60" viewBox="0 0 50 50" class="timer-svg">
        <circle cx="25" cy="25" r="${radius}" fill="none" stroke="var(--color-border)" stroke-width="4"></circle>
        <circle class="timer-progress" cx="25" cy="25" r="${radius}" fill="none" stroke="var(--color-success)" stroke-width="4"
          stroke-dasharray="${circumference}" stroke-dashoffset="0" transform="rotate(-90 25 25)"
          style="transition: stroke-dashoffset 1s linear, stroke 0.3s;"></circle>
        <text class="timer-text" x="25" y="25" dominant-baseline="central" text-anchor="middle" font-size="14" fill="var(--color-text)">
          ${this.currentSeconds}
        </text>
      </svg>
    `;
    
    this.svgCircle = this.el.querySelector('.timer-progress') as SVGCircleElement;
    this.textEl = this.el.querySelector('.timer-text') as SVGTextElement;
  }

  public start() {
    if (this.intervalId) return;
    this.intervalId = window.setInterval(() => {
      this.currentSeconds--;
      this.updateUI();
      
      if (this.currentSeconds <= 0) {
        this.stop();
        this.el.dispatchEvent(new CustomEvent('timer:expired', { bubbles: true }));
      }
    }, 1000);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  public getRemainingSeconds(): number {
    return this.currentSeconds;
  }

  private updateUI() {
    if (!this.svgCircle || !this.textEl) return;
    
    this.textEl.textContent = this.currentSeconds.toString();
    
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (this.currentSeconds / this.totalSeconds) * circumference;
    this.svgCircle.style.strokeDashoffset = offset.toString();
    
    const ratio = this.currentSeconds / this.totalSeconds;
    if (ratio <= 0.25) {
      this.svgCircle.style.stroke = 'var(--color-danger)';
    } else if (ratio <= 0.5) {
      this.svgCircle.style.stroke = 'var(--color-amber)';
    } else {
      this.svgCircle.style.stroke = 'var(--color-success)';
    }
  }
}
