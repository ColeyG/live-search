import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

const elementsToBind = document.querySelectorAll('[data-bind]');
const searchBar = document.querySelector('.search-bar');
const colors = document.querySelectorAll('.color-filter');
const cardSection = document.querySelector('.cards');
const overlay = document.querySelector('.overlay');
const searchTimeOffset = 500;
let saveData = '';
let searchTimer;
let colorFilter = '';

const clearDiv = (div) => {
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
};

const clearCards = () => {
  clearDiv(cardSection);
};

const displayCard = (card) => {
  const cardImg = document.createElement('img');

  cardImg.className = 'card';

  cardImg.src = card.image_uris.normal;
  cardImg.alt = card.name;
  // eslint-disable-next-line no-use-before-define
  cardImg.addEventListener('click', actionBinds.cardOverlay);

  cardSection.append(cardImg);
};

const search = (value) => {
  let query = `?q=${value}`;
  if (colorFilter !== '') {
    query += `+m=${colorFilter}`;
  }
  fetch(`https://api.scryfall.com/cards/search${query}`, { method: 'GET', mode: 'cors' })
    .then((resp) => resp.json())
    .then((data) => {
      clearCards();
      saveData = data.data;
      data.data.forEach((card) => {
        displayCard(card);
      });
    });
};

const keyPressHandler = (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    search(searchBar.value);
  }, searchTimeOffset);
};

const overlayPopulate = (card) => {
  clearDiv(overlay);
  console.log(card.oracle_text.replace(/\n/g, '<br>'));

  const cardImg = document.createElement('img');
  const textWrap = document.createElement('div');
  const title = document.createElement('h2');
  const cardText = document.createElement('p');

  cardImg.className = 'overlay-card';

  cardImg.src = card.image_uris.normal;
  cardImg.alt = card.name;

  title.append(document.createTextNode(card.name));
  cardText.innerHTML = card.oracle_text.replace(/\n/g, '<br><br>');
  // cardText.append(document.createTextNode(card.oracle_text.replace(/\n/g, '<br>')));

  textWrap.append(title);
  textWrap.append(cardText);

  overlay.append(cardImg);
  overlay.append(textWrap);
};

const actionBinds = {
  colorToggle: (e) => {
    colors.forEach((element) => {
      element.style.filter = '';
    });
    e.target.style.filter = 'invert(1)';
    colorFilter = e.target.id;
    if (searchBar.value !== '') {
      search(searchBar.value);
    }
  },
  cardOverlay: (e) => {
    if (overlay.style.opacity === '') {
      const targetCard = e.target.alt;
      let thisCard;
      overlay.style.opacity = 1;
      overlay.style.pointerEvents = 'auto';
      saveData.forEach((card) => {
        if (targetCard === card.name) {
          thisCard = card;
        }
      });
      overlayPopulate(thisCard);
    } else {
      overlay.style.opacity = '';
      overlay.style.pointerEvents = '';
    }
  },
};

searchBar.addEventListener('input', keyPressHandler, false);

elementsToBind.forEach((element) => {
  element.addEventListener('click', actionBinds[element.dataset.bind], false);
});
