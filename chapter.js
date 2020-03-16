const bibleChapterList = document.querySelector(`#chapter-list`);
const bibleSectionList = document.querySelector(`#section-list`);
const bibleVersionID = getParameterByName(`version`);
const bibleBookID = getParameterByName(`book`);
const abbreviation = getParameterByName(`abbr`);
const breadcrumbs = document.querySelector(`#breadcrumbs`);

let chapterHTML = ``;
let sectionHTML = ``;

if (!bibleVersionID || !bibleBookID) {
  window.location.href = `./index.html`;
}

getChapters(bibleVersionID, bibleBookID).then((chapterList) => {
  chapterHTML += `<ol>`;
  for (let chapter of chapterList) {
    chapterHTML += `<li class="grid"><a class="grid-link" href="verse.html?version=${bibleVersionID}&abbr=${abbreviation}&chapter=${chapter.id}"> ${chapter.number} </a></li>`;
  }
  chapterHTML += `</ol>`;
  bibleChapterList.innerHTML = chapterHTML;
});

getSections(bibleVersionID, bibleBookID).then((sectionList) => {
  if (sectionList) {
    sectionHTML += `<ol>`;
    for (let section of sectionList) {
      sectionHTML += `<li class="section"><a href="section.html?version=${bibleVersionID}&abbr=${abbreviation}&section=${section.id}"><abbr class="section-id">${section.id}</abbr><span class="bible-version-name"> ${section.title} </span></a></li>`;
    }
    sectionHTML += `</ol>`;
  } else {
    sectionHTML += `<div>There are no sections for this version and chapter.</div>`;
  }
  
  bibleSectionList.innerHTML = sectionHTML;
});


  
document.querySelector(`#viewing`).innerHTML = `${bibleBookID}`;
const breadcrumbsHTML = `
  <ul>
    <li><a href="index.html">Home</a></li>
    <li><a href="book.html?version=${bibleVersionID}&abbr=${abbreviation}">${abbreviation}</a></li>
    <li>${bibleBookID}</li>
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

function getChapters(bibleVersionID, bibleBookID) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener(`readystatechange`, function() {
      if (this.readyState === this.DONE) {
        const {data} = JSON.parse(this.responseText);
        const chapters = data.map( ({number, id}) => { return {number, id}; } );

        resolve(chapters);
      }
    });
    

    xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/books/${bibleBookID}/chapters`);
    xhr.setRequestHeader(`api-key`, API_KEY);

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send();
  });
}
function getSections(bibleVersionID, bibleBookID) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
  
    xhr.addEventListener(`readystatechange`, function() {
      if (this.readyState === this.DONE) {
        const {data} = JSON.parse(this.responseText);
        const sections = data ? data.map( ({title, id}) => { return {title, id}; } ) : null;
  
        resolve(sections);
      }
    });
  
    xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/books/${bibleBookID}/sections`);
    xhr.setRequestHeader(`api-key`, API_KEY);
  
    xhr.onerror = () => reject(xhr.statusText);
  
    xhr.send();
  });
}

