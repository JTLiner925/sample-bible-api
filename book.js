const bibleBookList = document.querySelector(`#book-list`);
const breadcrumbs = document.querySelector(`#breadcrumbs`);
const bibleVersionID = getParameterByName(`version`);
const abbreviation = getParameterByName(`abbr`);

let bookHTML = ``;

if (!bibleVersionID) {
  window.location.href = `./index.html`;
}

getBooks(bibleVersionID).then((bookList) => {
  bookHTML += `<ul>`;
  for (let book of bookList) {
    bookHTML += `<li><a href="chapter.html?version=${bibleVersionID}&abbr=${abbreviation}&book=${book.id}"> ${book.name} </a></li>`;
  }
  bookHTML += `</ul>`;
  bibleBookList.innerHTML = bookHTML;
});

document.querySelector(`#viewing`).innerHTML = `${abbreviation}`;
const breadcrumbsHTML = `
  <ul>
    <li><a href="index.html">Home</a></li>
    <li>${abbreviation}</li>
  </ul>
`;
breadcrumbs.innerHTML = breadcrumbsHTML;

function getBooks(bibleVersionID) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
  
    xhr.addEventListener(`readystatechange`, function() {
      if (this.readyState === this.DONE) {
        const {data} = JSON.parse(this.responseText);
        const books = data.map( ({name, id}) => { return {name, id}; } );
  
        resolve(books);
      }
    });
  
    xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/books`);
    xhr.setRequestHeader(`api-key`, API_KEY);
  
    xhr.onerror = () => reject(xhr.statusText);
  
    xhr.send();
  });
}

function getParameterByName(name) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, `\\$&`);
  const regex = new RegExp(`[?&]` + name + `(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return ``;
  return decodeURIComponent(results[2].replace(/\+/g, ` `));
}
  
function searchButton(){
  const searchInput = document.querySelector(`#search-input`);
  window.location.href = `./search.html?&version=${bibleVersionID}&abbr=${abbreviation}&query=${searchInput.value}`;
}