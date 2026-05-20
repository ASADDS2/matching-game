export function renderVerbFlip(container: HTMLElement, navigate: (screen: 'home' | 'select' | 'game' | 'results') => void) {
  container.innerHTML = `<div>Verb Flip Screen Stub</div><button id="btn-back">Back</button>`;
  container.querySelector('#btn-back')?.addEventListener('click', () => navigate('select'));
}
