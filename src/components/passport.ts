import type { StampRecord } from '../state';

export class PassportComponent {
  private el: HTMLElement;
  private stamps: StampRecord[];

  constructor(container: HTMLElement, stamps: StampRecord[] = []) {
    this.stamps = stamps;
    
    this.el = document.createElement('div');
    this.el.className = 'passport-container';
    
    this.render();
    container.appendChild(this.el);
  }

  private render() {
    Object.assign(this.el.style, {
      width: '300px',
      height: '200px',
      backgroundColor: '#1e3a8a', // navy blue
      borderRadius: 'var(--radius-lg)',
      position: 'relative',
      padding: '20px',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 10px 15px -3px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      gap: '10px'
    });

    // Passport background text/decoration
    const bg = document.createElement('div');
    bg.innerHTML = '<div style="color: rgba(255,255,255,0.1); font-size: 2rem; font-weight: bold; text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;">PASSPORT</div>';
    this.el.appendChild(bg);

    // Draw slots
    for (let i = 0; i < 9; i++) {
      const slot = document.createElement('div');
      Object.assign(slot.style, {
        border: '2px dashed rgba(255,255,255,0.2)',
        borderRadius: '50%',
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      });
      slot.dataset.slotIndex = i.toString();
      this.el.appendChild(slot);
    }
    
    this.stamps.forEach((stamp, index) => {
      if (index < 9) {
        this.addStampUI(stamp, index, false);
      }
    });
  }

  private addStampUI(stamp: StampRecord, slotIndex: number, animate: boolean) {
    const slots = this.el.querySelectorAll('[data-slot-index]');
    if (slotIndex >= slots.length) return;
    
    const slot = slots[slotIndex] as HTMLElement;
    
    const colors = ['#dc2626', '#16a34a', '#ca8a04', '#2563eb', '#9333ea'];
    const color = colors[stamp.mode % colors.length];
    
    const stampEl = document.createElement('div');
    Object.assign(stampEl.style, {
      width: '80%',
      height: '80%',
      borderRadius: '50%',
      border: `3px solid ${color}`,
      color: color,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '0.6rem',
      textAlign: 'center',
      transform: 'rotateZ(-15deg)',
      backgroundColor: 'rgba(255,255,255,0.9)'
    });
    
    stampEl.innerHTML = `
      <div style="font-size: 1.2rem; margin-bottom: 2px;">${this.getIcon(stamp.iconName)}</div>
      <div>MODE ${stamp.mode + 1}</div>
    `;
    
    if (animate) {
      stampEl.style.animation = 'stamp-land 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
    } else {
      stampEl.style.transform = 'scale(1) rotateZ(0deg)';
    }
    
    slot.innerHTML = '';
    slot.appendChild(stampEl);
  }
  
  public addStamp(stamp: StampRecord) {
    if (this.stamps.length >= 9) return;
    this.stamps.push(stamp);
    this.addStampUI(stamp, this.stamps.length - 1, true);
  }
  
  private getIcon(name: string): string {
    const icons: Record<string, string> = {
      'star': '⭐',
      'check': '✅',
      'plane': '✈️',
      'trophy': '🏆'
    };
    return icons[name] || '🌟';
  }
}
