const nav = document.querySelectorAll('.nav a');
const navBlock = document.getElementsByTagName('nav');
const queryString = window.location.search;
const queryParse = new URLSearchParams(queryString);
let page = queryParse.get('page');
if (!page) {
    page = 1;
}
const searchText = queryParse.get('search');
const navBackHTML = `<a href="/books/?search=${searchText}&page=${page - 1}"><</a>`;
const navForwardHTML = `<a href="/books/?search=${searchText || ""}&page=${parseInt(page)+1 || 2}">></a>`;

if (nav.length > 0) {
    for (let i = 0; i < nav.length; i++){
        let pageNum = nav[i];
        console.log(pageNum);
        if (parseInt(pageNum.innerText) === parseInt(page)) {
            const disabled = `<p class='selected'>${page}</p>`;
            pageNum.insertAdjacentHTML('afterend', disabled);
            pageNum.remove();
        }
    }

    // button for navigating one page back
    if (parseInt(page) === 1 || !page) {
        navBlock[0].insertAdjacentHTML('afterbegin', '<p class="inactive"><</p>');
    } else {
        navBlock[0].insertAdjacentHTML('afterbegin', navBackHTML);
    };

    // button for navigating one page forward
    if (parseInt(page) === parseInt(nav[nav.length-1].innerText)) {
        navBlock[0].insertAdjacentHTML('beforeend', '<p class="inactive">></p>');
    } else {
        navBlock[0].insertAdjacentHTML('beforeend', navForwardHTML);
    };
};