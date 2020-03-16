const bibleVerseList = document.querySelector(`#verse-list`);
const chapterText = document.querySelector(`#chapter-text`);
const bibleVersionID = getParameterByName(`version`);
const bibleChapterID = getParameterByName(`chapter`);
const abbreviation = getParameterByName(`abbr`);
let verseHTML = ``;

if (!bibleVersionID || !bibleChapterID) {
  window.location.href = `./index.html`;
}

getVerses(bibleVersionID, bibleChapterID).then((verseList) => {
  verseHTML += `<ol>`;
  for (let verse of verseList) {
    const verseNumber = getVerseNumber(verse.id);
    verseHTML += `<li class="grid"><a class="grid-link" href="verse-selected.html?version=${bibleVersionID}&abbr=${abbreviation}&verse=${verse.id}"> ${verseNumber} </a></li>`;
  }
  verseHTML += `</ol>`;
  bibleVerseList.innerHTML = verseHTML;
});

getChapterText(bibleChapterID).then((content) => {
  chapterText.innerHTML = content;
});

const [book, chapter] = bibleChapterID.split(`.`);
const breadcrumbsHTML = `
  <ul>
    <li><a href="index.html">Home</a></li>
    <li><a href="book.html?version=${bibleVersionID}&abbr=${abbreviation}">${abbreviation}</a></li>
    <li><a href="chapter.html?version=${bibleVersionID}&abbr=${abbreviation}&book=${book}">${book}</a></li>
    <li>${chapter}</li>
  </ul>
`;
breadcrumbs.innerHTML = breadcrumbsHTML;

document.querySelector(`#viewing`).innerHTML = `${chapter}`;

function getParameterByName(name) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, `\\$&`);
  const regex = new RegExp(`[?&]` + name + `(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return ``;
  return decodeURIComponent(results[2].replace(/\+/g, ` `));
}

function getVerses(bibleVersionID, bibleChapterID) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener(`readystatechange`, function() {
      if (this.readyState === this.DONE) {
        const {data} = JSON.parse(this.responseText);
        const verses = data.map( ({id}) => { return {id};} );

        resolve(verses);
      }
    });

    xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/chapters/${bibleChapterID}/verses`);
    xhr.setRequestHeader(`api-key`, API_KEY);

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send();
  });
}

function getChapterText(bibleChapterID) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener(`readystatechange`, function() {
      if (this.readyState === this.DONE) {
        const {data, meta} = JSON.parse(this.responseText);

        _BAPI.t(meta.fumsId);
        resolve(data.content);
      }
    });

    xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/chapters/${bibleChapterID}`);
    xhr.setRequestHeader(`api-key`, API_KEY);

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send();
  });
}

function getVerseNumber(verseID) {
  let verseNumber;
  if (verseID.includes(`-`)) {
    verseNumber = verseID.split(`-`).shift().split(`.`).pop() + `-` + verseID.split(`-`).pop().split(`.`).pop();
  } else {
    verseNumber = verseID.split(`.`).pop();
  }
  return verseNumber;
}
function searchButton(){
  const searchInput = document.querySelector(`#search-input`);
  window.location.href = `./search.html?&version=${bibleVersionID}&abbr=${abbreviation}&query=${searchInput.value}`;
}