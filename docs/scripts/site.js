(function () {
  const target = document.getElementById('typeTarget');
  const form = document.getElementById('contactForm');

  if (target) {
    const buildSequence = () => {
      const prefix = 'public abstract synchronized Future<Sleep> procrastinate(Deadline deadline) throws PanicAttack {';
      const suffixes = [
        ' if (systemsAwake) {',
        ' return build();',
        ' while (ideasFlow) {',
        ' ship(workingPrototype);',
        ' // build with intent',
        ' solve(problem);',
        ' }',
        ' keepMomentum();'
      ];

      let text = prefix;
      const minLength = 220 + Math.floor(Math.random() * 90);

      while (text.length < minLength) {
        text += ' ' + suffixes[Math.floor(Math.random() * suffixes.length)];
      }

      return text.trim() + ' $';
    };

    const sequence = [buildSequence()];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sequencePlayedKey = 'homepageSequencePlayed';
    let sequenceAlreadyPlayed = false;

    try {
      sequenceAlreadyPlayed = sessionStorage.getItem(sequencePlayedKey) === 'true';
    } catch (error) {
      sequenceAlreadyPlayed = false;
    }

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
      cursor.setAttribute('aria-hidden', 'true');
      target.appendChild(cursor);
    }

    function render(text) {
      target.replaceChildren();
      const sequenceText = document.createElement('span');
      sequenceText.className = 'sequence-green';
      sequenceText.textContent = text;
      target.appendChild(sequenceText);
      appendCursor();
    }

    if (reduced || sequenceAlreadyPlayed || internalNavigation) {
      render(sequence[0]);
    } else {
      try {
        sessionStorage.setItem(sequencePlayedKey, 'true');
      } catch (error) {
        // storage may be blocked (e.g. mobile Safari with cookies disabled); still play the animation
      }

      let characterIndex = 0;

      function tick() {
        const fullText = sequence[0];
        characterIndex += 1;
        render(fullText.slice(0, characterIndex));

        if (characterIndex < fullText.length) {
          setTimeout(tick, 22);
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
