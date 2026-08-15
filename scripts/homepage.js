const typedElement = document.querySelector('.hero h1');

if (typedElement) {
  const lines = [
    'Nico Meihuizen',
    'AI-native software engineer',
    'building useful systems'
  ];

  const introText = 'Nico Meihuizen';
  const subtitle = document.querySelector('.hero h1 span');

  if (subtitle) {
    const savedText = sessionStorage.getItem('meihuizen-home-typing');
    const activeText = savedText || lines[2];
    sessionStorage.setItem('meihuizen-home-typing', activeText);
    subtitle.textContent = activeText;
  }

  let index = 0;
  const originalText = introText;
  const cycle = () => {
    const fragment = lines[index % lines.length];
    typedElement.innerHTML = `${fragment}<span>${subtitle ? subtitle.textContent : 'AI-native software engineer'}</span>`;
    index += 1;
    window.setTimeout(cycle, 2400);
  };

  typedElement.innerHTML = `${originalText}<span>AI-native software engineer</span>`;
  window.setTimeout(cycle, 1800);
}
