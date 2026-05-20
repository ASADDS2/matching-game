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
    // Style the passport container as a luxury booklet
    Object.assign(this.el.style, {
      width: '320px',
      height: '220px',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', // Midnight slate texture
      borderRadius: 'var(--radius-lg)',
      position: 'relative',
      padding: '24px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.4), inset 0 0 15px rgba(255,255,255,0.05), inset 0 -4px 10px rgba(0,0,0,0.6)',
      border: '2px solid #d4af37', // Gold foiled border
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      gap: '12px',
      transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
      transformStyle: 'preserve-3d',
      cursor: 'pointer'
    });

    // 3D tilt effect
    this.el.addEventListener('mousemove', (e) => {
      const rect = this.el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const dx = x - xc;
      const dy = y - yc;
      
      const rotX = -(dy / yc) * 12; // tilt angle X
      const rotY = (dx / xc) * 12;  // tilt angle Y
      
      this.el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`;
      this.el.style.boxShadow = '0 25px 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.08)';
    });
    
    this.el.addEventListener('mouseleave', () => {
      this.el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      this.el.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4), inset 0 0 15px rgba(255,255,255,0.05)';
    });

    // Passport background gold watermark
    const bg = document.createElement('div');
    Object.assign(bg.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) translateZ(-10px)',
      color: 'rgba(212, 175, 55, 0.04)',
      fontSize: '2.5rem',
      fontWeight: '800',
      fontFamily: 'var(--font-display)',
      letterSpacing: '6px',
      pointerEvents: 'none',
      userSelect: 'none',
      textAlign: 'center'
    });
    bg.innerHTML = 'PASSPORT';
    this.el.appendChild(bg);

    // Draw slots
    for (let i = 0; i < 9; i++) {
      const slot = document.createElement('div');
      Object.assign(slot.style, {
        border: '1.5px dashed rgba(212, 175, 55, 0.25)',
        borderRadius: '50%',
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.25)',
        boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.4)',
        transition: 'all 0.3s ease',
        transform: 'translateZ(10px)'
      });
      
      // Soft hover effect on slot
      slot.addEventListener('mouseenter', () => {
        if (!slot.querySelector('.stamp-seal')) {
          slot.style.borderColor = 'rgba(212, 175, 55, 0.6)';
          slot.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
          slot.style.boxShadow = 'inset 0 3px 6px rgba(0,0,0,0.4), 0 0 8px rgba(212, 175, 55, 0.2)';
        }
      });
      
      slot.addEventListener('mouseleave', () => {
        slot.style.borderColor = 'rgba(212, 175, 55, 0.25)';
        slot.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
        slot.style.boxShadow = 'inset 0 3px 6px rgba(0,0,0,0.4)';
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
    slot.style.borderColor = 'transparent';
    slot.style.background = 'transparent';
    slot.style.boxShadow = 'none';
    
    const colors = [
      'linear-gradient(135deg, #e11d48, #9f1239)', // Rose wax seal
      'linear-gradient(135deg, #059669, #065f46)', // Emerald wax seal
      'linear-gradient(135deg, #d97706, #92400e)', // Amber wax seal
      'linear-gradient(135deg, #2563eb, #1e40af)', // Royal blue seal
      'linear-gradient(135deg, #7c3aed, #5b21b6)'  // Violet seal
    ];
    const color = colors[stamp.mode % colors.length];
    
    const stampEl = document.createElement('div');
    stampEl.className = 'stamp-seal';
    Object.assign(stampEl.style, {
      width: '90%',
      height: '90%',
      borderRadius: '50%',
      background: color,
      border: '2px double #f59e0b', // Golden emblem border
      color: '#fef3c7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '0.62rem',
      textAlign: 'center',
      transform: 'rotateZ(-10deg) translateZ(20px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.2)',
      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
      userSelect: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, filter 0.2s ease'
    });
    
    stampEl.innerHTML = `
      <div style="font-size: 1.35rem; margin-bottom: 1px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));">${this.getIcon(stamp.iconName)}</div>
      <div style="font-family: var(--font-display); letter-spacing: 0.5px; font-weight: 700; transform: scale(0.95);">MÓDULO ${stamp.mode + 1}</div>
    `;

    // Interactive scale on seal hover
    stampEl.addEventListener('mouseenter', () => {
      stampEl.style.transform = 'rotateZ(0deg) scale(1.1) translateZ(25px)';
      stampEl.style.filter = 'brightness(1.1)';
    });

    stampEl.addEventListener('mouseleave', () => {
      stampEl.style.transform = 'rotateZ(-10deg) translateZ(20px)';
      stampEl.style.filter = 'brightness(1)';
    });
    
    if (animate) {
      stampEl.style.animation = 'stamp-land 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
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

