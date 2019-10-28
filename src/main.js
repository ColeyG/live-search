import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

const respDiv = document.querySelector('.response');

async function fetchData() {
  await fetch('http://localhost:3000', { method: 'GET', mode: 'cors' })
    .then((resp) => resp.text())
    .then((data) => {
      console.log(data);
      respDiv.appendChild(document.createTextNode(data));
    });
}

const initialize = () => {
  fetchData();
};

// initialize();
