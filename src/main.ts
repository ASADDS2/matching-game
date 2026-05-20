import './styles/main.css';
import './styles/animations.css';
import { loadState, getState, setState } from './state';
import { renderHome } from './screens/home';
import { renderModeSelect } from './screens/mode-select';
import { renderVerbFlip } from './screens/verb-flip';
import { renderCultureClash } from './screens/culture-clash';
import { renderFeelingMode } from './screens/feeling-mode';
import { renderTravelTiles } from './screens/travel-tiles';
import { renderTimeDetective } from './screens/time-detective';
import { renderResults } from './screens/results';

function initTheme() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle';
  Object.assign(toggleBtn.style, {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    zIndex: '1000'
  });
  
  const updateIcon = () => {
    toggleBtn.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
  };
  updateIcon();
  
  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    document.documentElement.dataset.theme = current === 'dark' ? 'light' : 'dark';
    updateIcon();
  });
  
  document.body.appendChild(toggleBtn);
}

function router() {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;
  app.innerHTML = '';
  
  const state = getState();
  
  switch (state.currentScreen) {
    case 'home':
      renderHome(app, navigate);
      break;
    case 'select':
      renderModeSelect(app, navigate);
      break;
    case 'game':
      switch (state.currentMode) {
        case 0: renderVerbFlip(app, navigate); break;
        case 1: renderCultureClash(app, navigate); break;
        case 2: renderFeelingMode(app, navigate); break;
        case 3: renderTravelTiles(app, navigate); break;
        case 4: renderTimeDetective(app, navigate); break;
      }
      break;
    case 'results':
      renderResults(app, navigate);
      break;
  }
}

export function navigate(screen: 'home' | 'select' | 'game' | 'results', modeIndex?: 0|1|2|3|4) {
  const updates: any = { currentScreen: screen };
  if (modeIndex !== undefined) {
    updates.currentMode = modeIndex;
  }
  setState(updates);
  router();
}

window.addEventListener('DOMContentLoaded', () => {
  loadState();
  initTheme();
  router();
});
