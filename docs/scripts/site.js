(function () {
  const target = document.getElementById('typeTarget');
  const form = document.getElementById('contactForm');

  if (target) {
    const sequence = [
      'public abstract synchronized Future<Sleep> procrastinate(Deadline deadline) throws PanicAttack {',
      'Nico Meihuizen - AI Native Software Engineer. $'
    ];
    const accentWord = 'AI Native';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sequencePlayedKey = 'homepageSequencePlayed';
    const sequenceAlreadyPlayed = sessionStorage.getItem(sequencePlayedKey) === 'true';
    let internalNavigation = false;

    if (document.referrer) {
      try {
        internalNavigation = new URL(document.referrer, window.location.href).origin === window.location.origin;
      } catch (error) {
        internalNavigation = false;
      }
    }

    function appendCursor() {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      target.appendChild(cursor);
    }

    function render(text, isGreenSequence) {
      target.replaceChildren();

      if (isGreenSequence) {
        const sequenceText = document.createElement('span');
        sequenceText.className = 'sequence-green';
        sequenceText.textContent = text;
        target.appendChild(sequenceText);
        appendCursor();
        return;
      }

      const accentStart = text.indexOf(accentWord);
      if (accentStart === -1) {
        target.textContent = text;
        appendCursor();
        return;
      }

      target.appendChild(document.createTextNode(text.slice(0, accentStart)));

      const accentText = document.createElement('span');
      accentText.className = 'accent-word';
      accentText.textContent = accentWord;
      target.appendChild(accentText);

      target.appendChild(document.createTextNode(text.slice(accentStart + accentWord.length)));
      appendCursor();
    }

    if (reduced || sequenceAlreadyPlayed || internalNavigation) {
      render(sequence[1], false);
    } else {
      sessionStorage.setItem(sequencePlayedKey, 'true');
      let sequenceIndex = 0;
      let characterIndex = 0;

      function tick() {
        const fullText = sequence[sequenceIndex];
        const isGreenSequence = sequenceIndex === 0;
        characterIndex += 1;
        render(fullText.slice(0, characterIndex), isGreenSequence);

        if (characterIndex < fullText.length) {
          setTimeout(tick, 24);
          return;
        }

        if (sequenceIndex < sequence.length - 1) {
          sequenceIndex += 1;
          characterIndex = 0;
          setTimeout(tick, 430);
        }
      }

      tick();
    }
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
