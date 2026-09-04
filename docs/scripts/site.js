(function () {
  const target = document.getElementById('typeTarget');

  if (target) {
    // deduped glyph pool: letters, digits and symbols that make up the skyline
    const glyphs = Array.from(new Set(
      '7xK#m9!vQ$pB2@wZ&L*u9%tY6(xN1)zP5_eR8+qW3=jM4[vF]oK0{dX}pL~aG@4!mK9$xP2#zL6&Y*v1%uR3(bN7)wQ5_jW8+tX4=eM0[fF]kO7{sP}xI~q'.split('')
    ));
    const fontSize = 11;
    const columnWidth = 9;
    const rainColor = '#5FBF8E';
    const bgColor = '#171A24';
    // layout constants below are tuned for this reference canvas size; resize() scales them to the actual (e.g. mobile) canvas size
    const baseCanvasWidthPx = 722;
    const baseCanvasHeightPx = 300;
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

    let rows = 0;
    let columns = 0;
    let maxFillRowsPerColumn = [];
    let landedGrid = [];

    function randomGlyph() {
      return glyphs[Math.floor(Math.random() * glyphs.length)];
    }

    function resize() {
      const rect = target.getBoundingClientRect();
      target.width = rect.width;
      target.height = rect.height;
      columns = Math.max(1, Math.floor(target.width / columnWidth));
      rows = Math.max(1, Math.floor(target.height / fontSize));

      // scale the reference (722x300) layout constants to whatever size the canvas actually renders at (e.g. mobile)
      const widthScale = target.width / baseCanvasWidthPx;
      const heightScale = target.height / baseCanvasHeightPx;
      const scaledLogoClearWidthPx = logoClearWidthPx * widthScale;
      const scaledSkylineRampEndPx = skylineRampEndPx * widthScale;
      const scaledWaveWavelengthPx = waveWavelengthPx * widthScale;
      const scaledFirstRegionWavelengthPx = firstRegionWavelengthPx * widthScale;
      const scaledBaseCapPx = baseCapPx * heightScale;
      const scaledFirstRegionMinPx = firstRegionMinPx * heightScale;
      const scaledSkylineMinPx = skylineMinPx * heightScale;
      const scaledSkylineMaxPx = skylineMaxPx * heightScale;
      const scaledWaveAmplitudePx = waveAmplitudePx * heightScale;
      const scaledJitterAmplitudePx = jitterAmplitudePx * heightScale;
      const scaledFirstRegionJitterPx = firstRegionJitterPx * heightScale;

      const skylineMidPx = (scaledSkylineMinPx + scaledSkylineMaxPx) / 2;
      const firstRegionMidPx = (scaledFirstRegionMinPx + scaledBaseCapPx) / 2;
      const firstRegionAmplitudePx = (scaledBaseCapPx - scaledFirstRegionMinPx) / 2;

      // under the logo (x < scaledLogoClearWidthPx): its own spiked pattern, hard-capped at scaledBaseCapPx;
      // from there it ramps with a sine wave + jitter into the jagged skyline
      maxFillRowsPerColumn = new Array(columns).fill(0).map((_, column) => {
        const x = column * columnWidth + columnWidth / 2;

        if (x < scaledLogoClearWidthPx) {
          const wave = Math.sin((x / scaledFirstRegionWavelengthPx) * Math.PI * 2) * firstRegionAmplitudePx;
          const jitter = (Math.random() - 0.5) * 2 * scaledFirstRegionJitterPx;
          const targetPx = firstRegionMidPx + wave + jitter;
          const clampedPx = Math.min(scaledBaseCapPx, Math.max(scaledFirstRegionMinPx, targetPx));
          return Math.min(rows, Math.max(1, Math.round(clampedPx / fontSize)));
        }

        const rampProgress = Math.min(1, Math.max(0, (x - scaledLogoClearWidthPx) / (scaledSkylineRampEndPx - scaledLogoClearWidthPx)));
        const eased = rampProgress * rampProgress * (3 - 2 * rampProgress);
        const wave = Math.sin((x / scaledWaveWavelengthPx) * Math.PI * 2) * scaledWaveAmplitudePx * eased;
        const jitter = (Math.random() - 0.5) * 2 * scaledJitterAmplitudePx * eased;
        const targetPx = scaledBaseCapPx + eased * (skylineMidPx - scaledBaseCapPx) + wave + jitter;
        const clampedPx = Math.min(scaledSkylineMaxPx, Math.max(scaledBaseCapPx, targetPx));
        return Math.min(rows, Math.max(1, Math.round(clampedPx / fontSize)));
      });

      landedGrid = new Array(columns).fill(null).map(() => new Array(rows).fill(null));
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
      }
    }

    // The skyline is painted straight into its finished position. There is no falling
    // animation: every load of every index page draws the completed shape once.
    // resize() re-rolls the per-column jitter and randomGlyph() re-rolls the characters,
    // so each page shows a slightly different skyline. That variation is deliberate.
    function render() {
      resize();

      for (let column = 0; column < columns; column++) {
        const capRows = maxFillRowsPerColumn[column];
        for (let row = rows - capRows; row < rows; row++) {
          landedGrid[column][row] = randomGlyph();
        }
      }

      drawGrid();
    }

    // Mobile browsers fire 'resize' when the address bar hides/shows on scroll, which only
    // changes the viewport height, not its width. Only redraw when the width actually changes
    // (a real resize or orientation change); otherwise leave the current frame alone, so the
    // skyline does not visibly re-roll its glyphs every time the address bar moves.
    let lastWidth = window.innerWidth;

    function handleResize() {
      const newWidth = window.innerWidth;
      if (newWidth === lastWidth) {
        return;
      }
      lastWidth = newWidth;
      render();
    }

    render();
    window.addEventListener('resize', handleResize);
  }
})();

