
let books;
let wishList=JSON.parse(localStorage.getItem('wishList')) || [];
let readedBooks = JSON.parse(localStorage.getItem("read_books")) || [];

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

        if (window.location.pathname.endsWith("category.html"))
            categoriesFunction()

       
    });

function displayBook(book){
    let booksSection=document.querySelector('#books');
    let bookItem=document.createElement('article');
    wishList=JSON.parse(localStorage.getItem('wishList')) || [];
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
                book.categories.toLowerCase().includes(input))
            ){
            displayBook(book);
            found = true;
        } else if (select === 'title' && book.title.toLowerCase().includes(input)) {
            displayBook(book);
            found = true;
        } else if (select === 'author' && book.author.fullName.toLowerCase().includes(input)) {
            displayBook(book);
            found = true;
            console.log(book.categories);
        } else if (select === 'categorie' && book.categories.toLowerCase().includes(input)) {
            displayBook(book);
            console.log(book.categories);
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
    wishList=JSON.parse(localStorage.getItem('wishList')) || [];
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
                <p><span>Auther: </span>${book.author.fullName}</p>
                <p><span>Release date: </span>${book.releaseDate}</p>
                <p><span>Categories: </span>${book.categories}</p>
                <p class="description">${book.description}</p>
                <div class="buttonDetail">
                    <a href="${book.linkPDF}" target="_blank"><i class="fa-regular fa-eye"></i>Read</a>
                    <a href="" class="wishList" onclick='addToWishList(this)' dataBook='${JSON.stringify(book)}'>${wishButton}</a>    
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
    let bookJson=element.getAttribute('dataBook');
    const book = JSON.parse(bookJson);
    wishList = JSON.parse(window.localStorage.getItem('wishList')) || [];
    const index = wishList.findIndex(item => item.title === book.title);
    if (index !== -1) {
        element.innerHTML = '<i class="fa-regular fa-heart" ></i>';
        wishList.splice(index, 1);
    }else{
        wishList.push(book);
        element.innerHTML = '<i class="fa-solid fa-heart" style="color=red;"></i>';
    }
    window.localStorage.setItem('wishList', JSON.stringify(wishList));
    
}

///************* category_section ******** */

let categoriesList = [];

let categoriesContainer = document.getElementById("category_section");
let booksContainerCat = document.getElementById("books_section");

let srcImg;


function categoriesFunction() {

    let isCatAlredyAvailable = false;

    books.forEach(book => {

        isCatAlredyAvailable = false;

        for (let i = 0; i < categoriesList.length; i++) {
            if (categoriesList[i] === book.categories) {
                isCatAlredyAvailable = true;
                break;
            }
        }

        if (!isCatAlredyAvailable) {
            categoriesList.push(book.categories);

            categoriesContainer.innerHTML += `<div class="checkbox_containers">
                <input type="checkbox" value="${book.categories}" id="box_${book.categories}" name="categories" class="categoryBox">
                <label for="box_${book.categories}">${book.categories}</label>
            </div>`;
        }

    });



    let checkboxes = document.querySelectorAll(".categoryBox");

    checkboxes.forEach(checkBox => {

        books.forEach(book => {
            let isInWL = false;
            for (let i = 0; i < wishList.length; i++) {
                if (book.title === wishList[i].title && book.author.fullName === wishList[i].author.fullName) {
                    isInWL = true;
                    break;
                }
            }

            if(checkBox.value === "All" && checkBox.checked){
                if (isInWL)
                    srcImg="images/addedToWL.png";
                    
                else 
                    srcImg="images/addToWL.png";

                    booksContainerCat.innerHTML += `<div class="category_books">
                    <img src="${book.cover}" alt="test book" class="book_cover">
                    <h3 class="book_title">${book.title}</h3>
                    <p class="book_authorName">${book.author.fullName}</p>
                    <div class="content">
                        <img class="add_to_wl_icon" src=${srcImg} alt="add to wishlist">
                    </div>
                </div>`;            
            }
        });

        let addToWishListImg = document.querySelectorAll(".add_to_wl_icon");
        ImageClickListener(addToWishListImg,books);

        

        checkBox.addEventListener("click", () => {

            booksContainerCat.innerHTML = "";

            if (checkBox.checked) {

                checkboxes.forEach(otherCheckboxes => {
                    otherCheckboxes.checked = false;
                });

                checkBox.checked = true;

                books.forEach(book => {

                    let isInWL = false;

                        for (let i = 0; i < wishList.length; i++) {

                            if (book.title === wishList[i].title && book.author.fullName === wishList[i].author.fullName) {
                                isInWL = true;
                                break;
                            }

                        }


                    if(checkBox.value === 'All'){

                        if (isInWL) 
                            srcImg="images/addedToWL.png";
                        else
                            srcImg="images/addToWL.png";

                            booksContainerCat.innerHTML += `<div class="category_books">
                            <img src="${book.cover}" alt="test book" class="book_cover">
                            <h3 class="book_title">${book.title}</h3>
                            <p class="book_authorName">${book.author.fullName}</p>
                            <div class="content">
                                <img class="add_to_wl_icon" src=${srcImg} alt="add to wishlist">
                            </div>
                        </div>`;

                    }else if (book.categories === checkBox.value) {

                        
                        if (isInWL) {
                            srcImg='images/addedToWL.png';
                        } else {
                            srcImg='images/addToWL.png';
                        }
                        booksContainerCat.innerHTML += `<div class="category_books">
                                    <img src="${book.cover}" alt="test book" class="book_cover">
                                    <h3 class="book_title">${book.title}</h3>
                                    <p class="book_authorName">${book.author.fullName}</p>
                                    <div class="content">
                                        <img class="add_to_wl_icon" src=${srcImg} alt="add to wishlist">
                                    </div>
                                </div>`;


                    }


                });

                let addToWishListImg = document.querySelectorAll(".add_to_wl_icon");
                ImageClickListener(addToWishListImg,books);

    addCategoryBooksClickListener();
                

            } else {

                checkBox.checked = false;
            }

        })

    });

    addCategoryBooksClickListener();


}

function ImageClickListener(listImages = [],listBooks = []){

    listImages.forEach(imageClick => {

        imageClick.addEventListener('click', () => {

            let isInWishList = false;
            let index;
            let title = imageClick.closest(".category_books").querySelector('.book_title').textContent;
            let authorName = imageClick.closest(".category_books").querySelector('.book_authorName').textContent;

            listBooks.forEach(book => {

                if (title === book.title && authorName === book.author.fullName) {

                    for (let i = 0; i < wishList.length; i++) {

                        if (wishList[i].title === title && wishList[i].author.fullName === authorName) {
                            isInWishList = true;
                            index = i;
                            break;
                        }

                    }

                    if (!isInWishList) {
                        wishList.push(book);
                        imageClick.src = "images/addedToWL.png";
                        localStorage.setItem("wishList", JSON.stringify(wishList));
                    } else {
                        imageClick.src = "images/addToWL.png";
                        wishList.splice(index, 1);
                        localStorage.setItem("wishList", JSON.stringify(wishList));
                    }

                }

            });

        });

    });

}
function addCategoryBooksClickListener() {
    let categoryBooks = document.querySelectorAll('.category_books');
    categoryBooks.forEach((bookElement) => {
        bookElement.addEventListener('click', (event) => {
            if (!event.target.classList.contains('add_to_wl_icon')) {
                let title = bookElement.querySelector('.book_title').textContent;
                let authorName = bookElement.querySelector('.book_authorName').textContent;

                
                let selectedBook = books.find(book => book.title === title && book.author.fullName === authorName);

                if (selectedBook) {
                    window.location.href = `details.html?book=${encodeURIComponent(JSON.stringify(selectedBook))}`;
                }
            }
        });
    });
}

///************* wishList ***********/

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith("wishlist.html")) {
        let  bookContainer = document.getElementById('book_container');
        wishList.forEach(book => {
            UpdateBooks(bookContainer,book.cover, book.title, book.description, book.author.fullName, book.releaseDate);
        });
    

    let removeIcons = document.querySelectorAll('.wishlist_remove');
let readIcons = document.querySelectorAll('.wishlist_read');
let wishContainer = document.querySelectorAll('.wish_bookContainer');

wishContainer.forEach(book => {

    book.addEventListener('click', (event)=>{


        if (!event.target.classList.contains('wishlist_remove') && !event.target.classList.contains('wishlist_read')) {
            let wl_book_title = book.querySelector('.wl_book_title').textContent;
            let wl_author_name = book.querySelector('.wl_author_name').textContent;

            for(let i = 0 ; i < books.length ; i++){

                if(books[i].title === wl_book_title && books[i].author.fullName === wl_author_name)

            window.location.href = `details.html?book=${encodeURIComponent(JSON.stringify(books[i]))}`;

            }    
        }
    });

});
readIcons.forEach(icon => {

icon.addEventListener('click', ()=>{

let isAvailableInReadList = false;
let index;
let wl_book_title = icon.closest(".wish_bookContainer").querySelector('.wl_book_title').textContent;
let wl_authot_name = icon.closest(".wish_bookContainer").querySelector('.wl_author_name').textContent;


for(let i =0 ; i < readedBooks.length ; i++){

    if(readedBooks[i].title === wl_book_title && readedBooks[i].authorName === wl_authot_name){
        isAvailableInReadList = true;
        index = i;

    }

}

if(isAvailableInReadList){

    readedBooks.splice(index ,1);
    localStorage.setItem("read_books",JSON.stringify(readedBooks));
    icon.src = "images/book_not_readed.png"

}else{
    const readedBook = new Object({
        title : wl_book_title,
        authorName : wl_authot_name
    })

    readedBooks.push(readedBook);

    localStorage.setItem("read_books",JSON.stringify(readedBooks));

    icon.src = "images/book_readed.png"
}

});

})

removeIcons.forEach(icon =>{
icon.addEventListener('click',() => {

let wl_book_title = icon.closest(".wish_bookContainer").querySelector('.wl_book_title').textContent;
let wl_authot_name = icon.closest(".wish_bookContainer").querySelector('.wl_author_name').textContent;

for(let i =0 ; i < readedBooks.length ; i++){

    if(readedBooks[i].title === wl_book_title && readedBooks[i].authorName === wl_authot_name){
        
        readedBooks.splice(i,1);
        localStorage.setItem("read_books",JSON.stringify(readedBooks));

    }

}



for(let i =0 ; i<wishList.length ; i++){

    if(wl_book_title == wishList[i].title && wl_authot_name == wishList[i].author.fullName){
        wishList.splice(i , 1);
        localStorage.setItem("wishList", JSON.stringify(wishList));
        icon.closest(".wish_bookContainer").remove();
    }

}

})
});
}});






function UpdateBooks( container,cover, title, description, authorName, releasedate){

let isInReadList = false;
let imageSrc= 'book_not_readed.png';

readedBooks.forEach(readedBook => {

    
    if(readedBook.title === title && readedBook.authorName === authorName){
        isInReadList = true;
    }



});

if(isInReadList){
imageSrc = 'book_readed.png';
}




container.innerHTML +=`<div class="wish_bookContainer">

        <img class="wl_book_cover" src="${cover}" alt="test Image">
        <div class="book_content_details">
            <h3 class="wl_book_title">${title}</h3>
            <p>${description}</p>
            <p class="wl_author_name">${authorName}</p>
            <p>${releasedate}</p>

        </div>
        <div class="hoverContent">
            <img class="wishlist_remove" src="images/addedToWL.png" alt="add to wishlist">
            <img class="wishlist_read" src="images/${imageSrc}" alt="add to wishlist">
        </div>

    </div>`;

}
