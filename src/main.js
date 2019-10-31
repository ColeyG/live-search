import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

const searchBar = document.querySelector('.search-bar');
const searchTimeOffset = 500;
const cardLimit = 10;
const cardSection = document.querySelector('.cards');
let searchTimer;

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
  fetch(`https://api.scryfall.com/cards/search?q=${value}`, { method: 'GET', mode: 'cors' })
    .then((resp) => resp.json())
    .then((data) => {
      data.data.forEach((card) => {
        displayCard(card);
      });
    });
};

const keyPressHandler = (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    clearCards();
    search(searchBar.value);
  }, searchTimeOffset);
};

searchBar.addEventListener('input', keyPressHandler, false);
