function changeFlag(country) {
  const flagIcon = document.getElementById('flag-icon');
  if (!flagIcon) {
    console.error('Element with id "flag-icon" not found.');
    return;
  }

  let flagSrc = '';
  let flagAlt = '';
  let flagText = '';

  if (country === 'us') {
    flagSrc = 'Images/USFlag.png';
    flagAlt = 'US Flag';
    flagText = ' US';
  } else if (country === 'canada') {
    flagSrc = 'Images/canadaFlag.png';
    flagAlt = 'Canada Flag';
    flagText = ' Canada';
  } else {
    console.error('Invalid country code.');
    return;
  }

  flagIcon.src = flagSrc;
  flagIcon.alt = flagAlt;

  const nextSibling = flagIcon.nextSibling;
  if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
    nextSibling.textContent = flagText;
  } else if (nextSibling) {
    nextSibling.textContent = flagText;
  } else {
    console.error('Next sibling not found or not a text node.');
  }
}
