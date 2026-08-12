function updateClock() {
  const now = new Date();

  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  const timeEl = document.getElementById('time');
  const dateEl = document.getElementById('date');
  if (!timeEl || !dateEl) return;

  const timeStr = now.toLocaleTimeString([], timeOptions);
  const dateStr = now.toLocaleDateString([], dateOptions);

  if (timeEl.textContent !== timeStr) {
    timeEl.textContent = timeStr;
  }

  dateEl.textContent = dateStr;
}

function isCompactMode() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('compact')) return params.get('compact') !== '0';
    return true;
  } catch (e) {
    return true;
  }
}

function setCompactMode(enabled) {
  if (enabled) {
    document.body.classList.add('compact');
    document.body.classList.remove('expanded');
  } else {
    document.body.classList.remove('compact');
  }
}

function setExpanded(state) {
  if (state) {
    document.body.classList.add('expanded');
    document.body.classList.remove('compact');
  } else {
    document.body.classList.remove('expanded');
    document.body.classList.add('compact');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const initialCompact = isCompactMode();
  setCompactMode(initialCompact);

  const clockCard = document.querySelector('.clock-card');
  function toggleExpanded() {
    const expanded = document.body.classList.contains('expanded');
    setExpanded(!expanded);
  }

  if (clockCard) {
    clockCard.addEventListener('click', toggleExpanded);
    clockCard.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleExpanded();
      }
    });
  }

  const projectsPanel = document.querySelector('.projects-panel');
  const projectsSummary = projectsPanel?.querySelector('.projects-summary');
  function toggleProjects() {
    if (!projectsPanel) return;
    const expanded = projectsPanel.classList.toggle('expanded');
    projectsSummary?.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  if (projectsSummary) {
    projectsSummary.addEventListener('click', toggleProjects);
    projectsSummary.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleProjects();
      }
    });
  }

  updateClock();
  setInterval(updateClock, 1000);
});