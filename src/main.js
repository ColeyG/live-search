import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

const elementsToBind = document.querySelectorAll('[data-bind]');
const searchBar = document.querySelector('.search-bar');
const colors = document.querySelectorAll('.color-filter');
const cardSection = document.querySelector('.cards');
const searchTimeOffset = 500;
let searchTimer;
let colorFilter = '';

const clearCards = () => {
  while (cardSection.firstChild) {
    cardSection.removeChild(cardSection.firstChild);
  }
};

const displayCard = (card) => {
  const cardImg = document.createElement('img');

  cardImg.className = 'card';

  cardImg.src = card.image_uris.normal;
  cardImg.alt = card.name;

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

const actionBinds = {
  colorToggle: (e) => {
    colors.forEach((element) => {
      element.style.filter = '';
    });
    e.target.style.filter = 'invert(1)';
    colorFilter = e.target.id;
    search(searchBar.value);
  },
};

searchBar.addEventListener('input', keyPressHandler, false);

elementsToBind.forEach((element) => {
  element.addEventListener('click', actionBinds[element.dataset.bind], false);
});
