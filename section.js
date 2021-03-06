const bibleSectionTitle = document.querySelector(`#section`);
const bibleSectionList = document.querySelector(`#section-content`);
const bibleVersionID = getParameterByName(`version`);
const bibleSectionID = getParameterByName(`section`);
const abbreviation = getParameterByName(`abbr`);
const breadcrumbs = document.querySelector(`#breadcrumbs`);

if (!bibleVersionID || !bibleSectionID) {
  window.location.href = `./index.html`;
}

getSelectedSection(bibleVersionID, bibleSectionID).then(({ content, title }) => {
  bibleSectionTitle.innerHTML = `<span><i>${title}</i></span>`;
  bibleSectionList.innerHTML = `<div class="eb-container">${content}</div>`;
});

const [book, section] = bibleSectionID.split(`.`);
const breadcrumbsHTML = `
  <ul>
    <li><a href="book.html?version=${bibleVersionID}&abbr=${abbreviation}">${abbreviation}</a></li>
    <li><a href="chapter.html?version=${bibleVersionID}&abbr=${abbreviation}&book=${book}">${book}</a></li>
    <li>${section}</li>
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

function getSelectedSection(bibleVersionID, bibleSectionID) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener(`readystatechange`, function() {
      if (this.readyState === this.DONE) {
        const response = JSON.parse(this.responseText);
        const fumsId = response.meta.fumsId;
        const {content, title} = response.data;
        const section = {content, title};

        _BAPI.t(fumsId);
        resolve(section);
      }
    });

    xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/sections/${bibleSectionID}?include-chapter-numbers=true&include-verse-spans=true`);
    xhr.setRequestHeader(`api-key`, API_KEY);

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send();
  });
}
function searchButton(){
  const searchInput = document.querySelector(`#search-input`);
  window.location.href = `./search.html?&version=${bibleVersionID}&abbr=${abbreviation}&query=${searchInput.value}`;
}