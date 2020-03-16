const bibleVerseTitle = document.querySelector(`#verse`);
const bibleVerseList = document.querySelector(`#verse-content`);
const bibleVersionID = getParameterByName(`version`);
const bibleVerseID = getParameterByName(`verse`);
const abbreviation = getParameterByName(`abbr`);
const breadcrumbs = document.querySelector(`#breadcrumbs`);

if (!bibleVersionID || !bibleVerseID) {
  window.location.href = `./index.html`;
}

getSelectedVerse(bibleVersionID, bibleVerseID).then(({ content, reference }) => {
  bibleVerseTitle.innerHTML = `<span><i>${reference}</i></span>`;
  bibleVerseList.innerHTML = `<div class="eb-container">${content}</div>`;
});

let [book, chapter, verse] = bibleVerseID.split(`.`);
if (bibleVerseID.includes(`-`)) {
  verse = bibleVerseID.split(`-`).shift().split(`.`).pop() + `-` + bibleVerseID.split(`-`).pop().split(`.`).pop();
}
const breadcrumbsHTML = `
  <ul>
    <li><a href="index.html">Home</a></li>
    <li><a href="book.html?version=${bibleVersionID}&abbr=${abbreviation}">${abbreviation}</a></li>
    <li><a href="chapter.html?version=${bibleVersionID}&abbr=${abbreviation}&book=${book}">${book}</a></li>
    <li><a href="verse.html?version=${bibleVersionID}&abbr=${abbreviation}&chapter=${book}.${chapter}">${chapter}</a></li>
    <li>${verse}</li>
  </ul>
`;
breadcrumbs.innerHTML = breadcrumbsHTML;

function getParameterByName(name) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, `\\$&`);
  const regex = new RegExp(`[?&]` + name + `(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return ``;
  return decodeURIComponent(results[2].replace(/\+/g, ` `));
}

function getSelectedVerse(bibleVersionID, bibleVerseID) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener(`readystatechange`, function() {
      if (this.readyState === this.DONE) {
        const response = JSON.parse(this.responseText);
        const fumsId = response.meta.fumsId;
        const {content, reference} = response.data;
        const verse = {content, reference};

        _BAPI.t(fumsId);
        resolve(verse);
      }
    });

    xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/verses/${bibleVerseID}?include-chapter-numbers=false&include-verse-numbers=false`);
    xhr.setRequestHeader(`api-key`, API_KEY);

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send();
  });
}
function searchButton(){
  const searchInput = document.querySelector(`#search-input`);
  window.location.href = `./search.html?&version=${bibleVersionID}&abbr=${abbreviation}&query=${searchInput.value}`;
}