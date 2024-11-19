let booksContainer = document.getElementById('book_container');
let booksList = [];
let readedBooks = [];

readedBooks = JSON.parse(localStorage.getItem("read_books")) || [];


booksList = JSON.parse(localStorage.getItem("books")) || [];

console.log(booksList);


booksList.forEach(book => {

            UpdateBooks(booksContainer, book.cover, book.title, book.description, book.author.fullName, book.releaseDate);
    
});

let removeIcons = document.querySelectorAll('.wishlist_remove');
let readIcons = document.querySelectorAll('.wishlist_read');

readIcons.forEach(icon => {

    icon.addEventListener('click', ()=>{

        let wl_book_title = icon.closest(".wish_bookContainer").querySelector('.wl_book_title').textContent;
        let wl_authot_name = icon.closest(".wish_bookContainer").querySelector('.wl_author_name').textContent;

        



    });

})

removeIcons.forEach(icon =>{
    icon.addEventListener('click',() => {

        let wl_book_title = icon.closest(".wish_bookContainer").querySelector('.wl_book_title').textContent;
        let wl_authot_name = icon.closest(".wish_bookContainer").querySelector('.wl_author_name').textContent;

        for(let i =0 ; i<booksList.length ; i++){

            if(wl_book_title == booksList[i].title && wl_authot_name == booksList[i].author.fullName){
                booksList.splice(i , 1);
                localStorage.setItem("books", JSON.stringify(booksList));
                icon.closest(".wish_bookContainer").remove();
            }

        }

    })
});

function UpdateBooks(Container, cover, title, description, authorName, releasedate){

    Container.innerHTML +=`<div class="wish_bookContainer">

                <img class="wl_book_cover" src="${cover}" alt="test Image">
                <div class="book_content_details">

                    <h3 class="wl_book_title">${title}</h3>
                    <p>${description}</p>
                    <p class="wl_author_name">${authorName}</p>
                    <p>${releasedate}</p>


                </div>
                <div class="hoverContent">
                    <img class="wishlist_remove" src="images/addedToWL.png" alt="add to wishlist">
                    <img class="wishlist_read" src="images/notRead.png" alt="add to wishlist">
                </div>

            </div>`;

}
