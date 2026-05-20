export function renderFeelingMode(container: HTMLElement, navigate: (screen: 'home' | 'select' | 'game' | 'results') => void) {
  container.innerHTML = `<div>Feeling Mode Screen Stub</div><button id="btn-back">Back</button>`;
  container.querySelector('#btn-back')?.addEventListener('click', () => navigate('select'));
}
