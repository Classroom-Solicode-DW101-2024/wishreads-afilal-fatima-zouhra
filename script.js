
let books;
let wishList=JSON.parse(localStorage.getItem('books')) || [];

fetch('data.json')
    .then(promise => {
        if(!promise.ok)
            console.log('Error fetching data');
        return promise.json();
    })
    .then(data =>{
        books=data;

        if (window.location.pathname.endsWith("index.html"))
            books.forEach(book => { displayBook(book) });
            
        const urlParams = new URLSearchParams(window.location.search);
        const searchBy = urlParams.get('searchBy');
        const searchInput = urlParams.get('searchInput');
        
        if (searchBy && searchInput) 
            searchBook();
        
    });

function displayBook(book){
    let booksSection=document.querySelector('#books');
    let bookItem=document.createElement('article');
    wishList=JSON.parse(localStorage.getItem('books')) || [];
    let wishButton;
    if( wishList.find(item => item.title === book.title)){
        wishButton = '<i class="fa-solid fa-heart" style="color=red;"></i>';
    }else{
        wishButton = '<i class="fa-regular fa-heart" ></i>';
    }
    bookItem.innerHTML=`
            <a href="details.html?book=${encodeURIComponent(JSON.stringify(book))}" >
            <img src="${book.cover}" alt="" ></a>
            <button class="addToWishList" id="wishButton"  onclick='addToWishList(this)' dataBook='${JSON.stringify(book)}'> ${wishButton}</button>
            <h3>${book.title}</h3>
            <span>${book.author.fullName}</span>`;
    booksSection.appendChild(bookItem);
}


function searchBookTest() {
    const searchBy = document.getElementById('searchBy').value;
    const searchInput = document.getElementById('searchInput').value.trim();

    if (searchInput) {
        window.location.href = `index.html?searchBy=${searchBy}&searchInput=${searchInput}`;
    }
}

function searchBook() {
    const urlParams = new URLSearchParams(window.location.search);
    const select = urlParams.get('searchBy');
    const input = urlParams.get('searchInput')?.toLowerCase();
    console.log(select + ","+input);
    if (!select || !input) return;

    const booksSection = document.querySelector('#books');
    booksSection.innerHTML = '';
    let found = false;

    books.forEach(book => {
        if (select === 'all' && (
                book.title.toLowerCase().includes(input) ||
                book.author.fullName.toLowerCase().includes(input) ||
                (book.categorie || []).some(cat => cat.toLowerCase().includes(input))
            )) {
            displayBook(book);
            found = true;
        } else if (select === 'title' && book.title.toLowerCase().includes(input)) {
            displayBook(book);
            found = true;
        } else if (select === 'author' && book.author.fullName.toLowerCase().includes(input)) {
            displayBook(book);
            found = true;
        } else if (select === 'categorie' && (book.categorie.toLowerCase().includes(input))) {
            displayBook(book);
            found = true;
        }
    });

    if (!found) {
        const noResult = document.createElement('p');
        noResult.className = 'noResult';
        noResult.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i> No results found. Please try a different search.`;
        booksSection.appendChild(noResult);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith("details.html")) {
        displayDetailsBook(); 
    }
});

function displayDetailsBook(){
    let urlParams = new URLSearchParams(new URL(window.location.href).search);
    const bookJson = decodeURIComponent(urlParams.get('book'));
    let book = JSON.parse(bookJson); 
    const main = document.querySelector('.mainDetail');
    const bookDetail= document.createElement('section');
    bookDetail.className ='bookDetail';
    wishList=JSON.parse(localStorage.getItem('books')) || [];
    let wishButton;
    if( wishList.find(item => item.title === book.title)){
        wishButton = '<i class="fa-solid fa-heart" style="color=red;"></i>';
    }else{
        wishButton = '<i class="fa-regular fa-heart" ></i>';
    }

    bookDetail.innerHTML = ` 
            <div class="imageDetail">
                <img src="${book.cover}" alt="">
            </div>
               
            <div class="textDetail">
                <h1>${book.title}</h1>
                <p><span>Author: </span>${book.author.fullName}</p>
                <p><span>Release date: </span>${book.releaseDate}</p>
                <p><span>Categories: </span>${book.categorie}</p>
                <p class="description">${book.description}</p>
                <div class="buttonDetail">
                    <a href="${book.linkPDF}" target="_blank"><i class="fa-regular fa-file-pdf"></i>Read</a>
                    <a href="" class="wishList" onclick='addToWishList(this)' dataBook='${JSON.stringify(book)}' >${wishButton}</a>    
                </div>
            </div>`;
    main.appendChild(bookDetail);
    const biography = document.createElement('section');
    biography.className='biography';
    biography.innerHTML = `
                    <span>Biography</span>
                    <p>${book.author.biography}</p>`;
    main.appendChild(biography);  
}




function addToWishList(element){
    console.log('Button clicked');
    let bookJson=element.getAttribute('dataBook');
    console.log(bookJson);
    const book = JSON.parse(bookJson);
    console.log(book);
    wishList = JSON.parse(window.localStorage.getItem('books')) || [];
    const index = wishList.findIndex(item => item.title === book.title);
    if (index !== -1) {
        element.innerHTML = '<i class="fa-regular fa-heart" ></i>';
        wishList.splice(index, 1);
    }else{
        wishList.push(book);
        element.innerHTML = '<i class="fa-solid fa-heart" style="color=red;"></i>';
    }
    window.localStorage.setItem('books', JSON.stringify(wishList));
    
}