import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

const searchBar = document.querySelector('.search-bar');
const searchTimeOffset = 500;
let searchTimer;

const search = (value) => {
  console.log(value);
};

const keyPressHandler = (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    search(searchBar.value);
  }, searchTimeOffset);
};

searchBar.addEventListener('input', keyPressHandler, false);
