export function renderTimeDetective(container: HTMLElement, navigate: (screen: 'home' | 'select' | 'game' | 'results') => void) {
  container.innerHTML = `<div>Time Detective Screen Stub</div><button id="btn-back">Back</button>`;
  container.querySelector('#btn-back')?.addEventListener('click', () => navigate('select'));
}
