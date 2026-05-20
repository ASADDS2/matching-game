export type CardState = 'hidden' | 'revealed' | 'matched';

export class CardComponent {
  public el: HTMLElement;
  private state: CardState = 'hidden';
  public id: string;
  public matchId: string;

  constructor(id: string, matchId: string, frontContent: string, backContent: string) {
    this.id = id;
    this.matchId = matchId;
    
    this.el = document.createElement('div');
    this.el.className = 'card';
    this.el.dataset.id = id;
    this.el.dataset.matchId = matchId;
    
    this.el.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${frontContent}</div>
        <div class="card-back">${backContent}</div>
      </div>
    `;
    
    this.addStyles();
  }

  private addStyles() {
    // Sizing and layout are handled by CSS (see .card rules in main.css) so
    // media queries can take effect. Only set runtime-only properties here.
  }

  public setState(newState: CardState) {
    this.state = newState;
    const inner = this.el.querySelector('.card-inner') as HTMLElement;
    
    if (newState === 'hidden') {
      inner.style.transform = 'rotateY(0deg)';
      this.el.style.pointerEvents = 'auto';
    } else if (newState === 'revealed') {
      inner.style.transform = 'rotateY(180deg)';
      this.el.style.pointerEvents = 'none';
    } else if (newState === 'matched') {
      inner.style.transform = 'rotateY(180deg)';
      this.el.style.pointerEvents = 'none';
      inner.style.animation = 'pulse-success 0.3s ease';
      const back = this.el.querySelector('.card-back') as HTMLElement;
      back.style.borderColor = 'var(--color-success)';
      back.style.backgroundColor = 'rgba(99, 153, 34, 0.1)';
    }
  }

  public getState(): CardState {
    return this.state;
  }

  public shake() {
    this.el.style.animation = 'none';
    // Trigger reflow
    void this.el.offsetWidth;
    this.el.style.animation = 'shake 0.4s ease';
  }
}
