(function () {
  const target = document.getElementById('typeTarget');
  const form = document.getElementById('contactForm');

  if (target) {
    // deduped glyph pool: letters, digits and symbols for the falling rain columns
    const glyphs = Array.from(new Set(
      '7xK#m9!vQ$pB2@wZ&L*u9%tY6(xN1)zP5_eR8+qW3=jM4[vF]oK0{dX}pL~aG@4!mK9$xP2#zL6&Y*v1%uR3(bN7)wQ5_jW8+tX4=eM0[fF]kO7{sP}xI~q'.split('')
    ));
    const fontSize = 11;
    const columnWidth = 9;
    const rainColor = '#5FBF8E';
    const bgColor = '#10121A';
    const ctx = target.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rows = 0;
    let columns = 0;
    let landedGrid = [];
    let fillHeight = [];
    let dropRow = [];
    let dropGlyph = [];
    let dropDelay = [];
    let intervalId = null;

    function randomGlyph() {
      return glyphs[Math.floor(Math.random() * glyphs.length)];
    }

    function resize() {
      const rect = target.getBoundingClientRect();
      target.width = rect.width;
      target.height = rect.height;
      columns = Math.max(1, Math.floor(target.width / columnWidth));
      rows = Math.max(1, Math.floor(target.height / fontSize));
      landedGrid = new Array(columns).fill(null).map(() => new Array(rows).fill(null));
      fillHeight = new Array(columns).fill(0);
      dropRow = new Array(columns).fill(null);
      dropGlyph = new Array(columns).fill(null);
      dropDelay = new Array(columns).fill(0).map(() => Math.floor(Math.random() * 20));
    }

    function drawGrid() {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, target.width, target.height);
      ctx.font = fontSize + 'px "Courier New", Courier, monospace';
      ctx.textBaseline = 'top';
      ctx.fillStyle = rainColor;

      for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows; row++) {
          const glyph = landedGrid[column][row];
          if (glyph) {
            ctx.fillText(glyph, column * columnWidth, row * fontSize);
          }
        }

        if (dropRow[column] !== null && dropRow[column] >= 0) {
          ctx.fillText(dropGlyph[column], column * columnWidth, dropRow[column] * fontSize);
        }
      }
    }

    function tick() {
      let allFilled = true;

      for (let column = 0; column < columns; column++) {
        if (fillHeight[column] >= rows) {
          continue;
        }

        allFilled = false;

        if (dropRow[column] === null) {
          if (dropDelay[column] > 0) {
            dropDelay[column] -= 1;
            continue;
          }
          dropRow[column] = -1 - Math.floor(Math.random() * 6);
          dropGlyph[column] = randomGlyph();
          continue;
        }

        dropRow[column] += 1;
        dropGlyph[column] = randomGlyph();

        const landingRow = rows - 1 - fillHeight[column];

        if (dropRow[column] >= landingRow) {
          landedGrid[column][landingRow] = dropGlyph[column];
          fillHeight[column] += 1;
          dropRow[column] = null;
          dropDelay[column] = Math.floor(Math.random() * 8);
        }
      }

      drawGrid();

      if (allFilled) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function drawStaticFrame() {
      for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows; row++) {
          landedGrid[column][row] = randomGlyph();
        }
      }
      drawGrid();
    }

    function start() {
      resize();

      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }

      if (reduced) {
        drawStaticFrame();
      } else {
        intervalId = setInterval(tick, 50);
      }
    }

    start();
    window.addEventListener('resize', start);
  }

  if (form) {
    const nameField = document.getElementById('cf-name');
    const emailField = document.getElementById('cf-email');
    const messageField = document.getElementById('cf-message');
    const honeypotField = form.querySelector('[name="_honey"]');
    const emailPattern = /^[^\s@,]+@[^\s@,]+\.[^\s@,]{2,}$/;
    const testAddressPattern = /^(test|example|demo)(?:[+._-].*)?$/i;
    const contactAddress = 'nico.meihuizen@protonmail.com';

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const trimmedName = nameField.value.trim();
      const trimmedEmail = emailField.value.trim();
      const trimmedMessage = messageField.value.trim();
      const emailLocalPart = trimmedEmail.split('@')[0];
      const isNameValid = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s.'-]{1,79}$/.test(trimmedName);
      const isEmailValid = emailPattern.test(trimmedEmail) && !testAddressPattern.test(emailLocalPart);
      const isMessageValid = trimmedMessage.length >= 10 && trimmedMessage.length <= 4000;

      nameField.setCustomValidity(isNameValid ? '' : 'Enter a real name using letters, spaces, apostrophes, or hyphens.');
      emailField.setCustomValidity(isEmailValid ? '' : 'Enter a valid, non-test email address.');
      messageField.setCustomValidity(isMessageValid ? '' : 'Message must be between 10 and 4000 characters.');

      if (honeypotField.value.trim() !== '' || !isNameValid || !isEmailValid || !isMessageValid) {
        form.reportValidity();
        return;
      }

      const subject = encodeURIComponent('Portfolio contact from ' + trimmedName);
      const body = encodeURIComponent('Name: ' + trimmedName + '\nEmail: ' + trimmedEmail + '\n\n' + trimmedMessage);
      window.location.href = 'mailto:' + contactAddress + '?subject=' + subject + '&body=' + body;
    });
  }
})();
