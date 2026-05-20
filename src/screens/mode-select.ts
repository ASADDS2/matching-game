export function renderModeSelect(container: HTMLElement, navigate: (screen: 'home' | 'select' | 'game' | 'results', modeIndex?: 0|1|2|3|4) => void) {
  container.innerHTML = `<div>Mode Select Screen Stub</div><button id="btn-back">Back</button>`;
  container.querySelector('#btn-back')?.addEventListener('click', () => navigate('home'));
}
