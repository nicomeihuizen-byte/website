(function () {
  const target = document.getElementById('typeTarget');

  if (target) {
    // deduped glyph pool: letters, digits and symbols for the falling rain columns
    const glyphs = Array.from(new Set(
      '7xK#m9!vQ$pB2@wZ&L*u9%tY6(xN1)zP5_eR8+qW3=jM4[vF]oK0{dX}pL~aG@4!mK9$xP2#zL6&Y*v1%uR3(bN7)wQ5_jW8+tX4=eM0[fF]kO7{sP}xI~q'.split('')
    ));
    const fontSize = 11;
    const columnWidth = 9;
    const rainColor = '#5FBF8E';
    const bgColor = '#171A24';
    const baseCapPx = 168;
    const logoClearWidthPx = 190;
    const skylineRampEndPx = 420;
    const skylineMinPx = 240;
    const skylineMaxPx = 300;
    const waveWavelengthPx = 60;
    const waveAmplitudePx = 30;
    const jitterAmplitudePx = 12;
    const firstRegionMinPx = 132;
    const firstRegionWavelengthPx = 45;
    const firstRegionJitterPx = 12;
    const ctx = target.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rows = 0;
    let columns = 0;
    let maxFillRowsPerColumn = [];
    let dropSpeedPerColumn = [];
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

      const skylineMidPx = (skylineMinPx + skylineMaxPx) / 2;
      const firstRegionMidPx = (firstRegionMinPx + baseCapPx) / 2;
      const firstRegionAmplitudePx = (baseCapPx - firstRegionMinPx) / 2;

      // under the logo (x < logoClearWidthPx): its own spiked pattern, hard-capped at 140px;
      // from there it ramps with a sine wave + jitter into the jagged 200-250px skyline
      maxFillRowsPerColumn = new Array(columns).fill(0).map((_, column) => {
        const x = column * columnWidth + columnWidth / 2;

        if (x < logoClearWidthPx) {
          const wave = Math.sin((x / firstRegionWavelengthPx) * Math.PI * 2) * firstRegionAmplitudePx;
          const jitter = (Math.random() - 0.5) * 2 * firstRegionJitterPx;
          const targetPx = firstRegionMidPx + wave + jitter;
          const clampedPx = Math.min(baseCapPx, Math.max(firstRegionMinPx, targetPx));
          return Math.min(rows, Math.max(1, Math.round(clampedPx / fontSize)));
        }

        const rampProgress = Math.min(1, Math.max(0, (x - logoClearWidthPx) / (skylineRampEndPx - logoClearWidthPx)));
        const eased = rampProgress * rampProgress * (3 - 2 * rampProgress);
        const wave = Math.sin((x / waveWavelengthPx) * Math.PI * 2) * waveAmplitudePx * eased;
        const jitter = (Math.random() - 0.5) * 2 * jitterAmplitudePx * eased;
        const targetPx = baseCapPx + eased * (skylineMidPx - baseCapPx) + wave + jitter;
        const clampedPx = Math.min(skylineMaxPx, Math.max(baseCapPx, targetPx));
        return Math.min(rows, Math.max(1, Math.round(clampedPx / fontSize)));
      });

      // first-region columns (under the logo) fall twice as fast; the skyline region keeps its normal speed
      dropSpeedPerColumn = new Array(columns).fill(0).map((_, column) => {
        const x = column * columnWidth + columnWidth / 2;
        return x < logoClearWidthPx ? 4 : 2;
      });

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
        if (fillHeight[column] >= maxFillRowsPerColumn[column]) {
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

        dropRow[column] += dropSpeedPerColumn[column];
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
        const capRows = maxFillRowsPerColumn[column];
        for (let row = rows - capRows; row < rows; row++) {
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
        intervalId = setInterval(tick, 30);
      }
    }

    start();
    window.addEventListener('resize', start);
  }
})();
