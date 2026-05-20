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
    Object.assign(this.el.style, {
      width: '100px',
      height: '140px',
      perspective: '1000px',
      cursor: 'pointer',
      margin: '8px'
    });
    
    const inner = this.el.querySelector('.card-inner') as HTMLElement;
    Object.assign(inner.style, {
      position: 'relative',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      transition: 'transform 0.4s',
      transformStyle: 'preserve-3d',
      borderRadius: 'var(--radius-md)'
    });
    
    const faces = this.el.querySelectorAll('.card-front, .card-back');
    faces.forEach((face) => {
      const el = face as HTMLElement;
      Object.assign(el.style, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '12px',
        wordBreak: 'break-word',
        fontSize: '1.2rem',
        userSelect: 'none'
      });
    });
    
    const front = this.el.querySelector('.card-front') as HTMLElement;
    Object.assign(front.style, {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      fontSize: '2rem'
    });
    
    const back = this.el.querySelector('.card-back') as HTMLElement;
    Object.assign(back.style, {
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text)',
      transform: 'rotateY(180deg)',
      border: '2px solid var(--color-border)'
    });
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
