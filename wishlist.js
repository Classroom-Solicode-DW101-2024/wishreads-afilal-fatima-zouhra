let booksContainer = document.getElementById('book_container');
let readedBooksContainer = document.getElementById('readed_book_container');
let booksList = [];
let readedBooks = [];

readedBooks = JSON.parse(localStorage.getItem("read_books")) || [];


booksList = JSON.parse(localStorage.getItem("books")) || [];

console.log(booksList);


booksList.forEach(book => {

            UpdateBooks(booksContainer,readedBooksContainer, book.cover, book.title, book.description, book.author.fullName, book.releaseDate);
    
});

let removeIcons = document.querySelectorAll('.wishlist_remove');
let readIcons = document.querySelectorAll('.wishlist_read');
let BooksContainer = document.querySelectorAll('.wish_bookContainer');


BooksContainer.forEach(book => {

    book.addEventListener('click', (event)=>{

        if (!event.target.classList.contains('wishlist_remove') && !event.target.classList.contains('wishlist_read')) {
            let wl_book_title = book.querySelector('.wl_book_title').textContent;
            let wl_author_name = book.querySelector('.wl_author_name').textContent;

            for(let i = 0 ; i < booksList.length ; i++){

                if(booksList[i].title === wl_book_title && booksList[i].author.fullName === wl_author_name){

                    window.location.href = `details.html?book=${encodeURIComponent(JSON.stringify(booksList[i]))}`;

                }

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
            icon.src = "images/accept.png"

        }else{
            const readedBook = new Object({
                title : wl_book_title,
                authorName : wl_authot_name
            })
    
            readedBooks.push(readedBook);
    
            localStorage.setItem("read_books",JSON.stringify(readedBooks));
    
            icon.src = "images/readed.png"
        }
        
        window.location.reload();
        

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



        for(let i =0 ; i<booksList.length ; i++){

            if(wl_book_title == booksList[i].title && wl_authot_name == booksList[i].author.fullName){
                booksList.splice(i , 1);
                localStorage.setItem("books", JSON.stringify(booksList));
                icon.closest(".wish_bookContainer").remove();
            }

        }

    })
});

function UpdateBooks(ContainerNormal,ContainerReaded, cover, title, description, authorName, releasedate){

    let isInReadList = false;
    let imageSrc= 'accept.png';
    let container = ContainerNormal;

    readedBooks.forEach(readedBook => {

            
            if(readedBook.title === title && readedBook.authorName === authorName){
                isInReadList = true;
            }

        

    });

    if(isInReadList){
        imageSrc = 'readed.png';
        container = ContainerReaded;
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

function searchBookTest() {
    const searchBy = document.getElementById('searchBy').value;
    const searchInput = document.getElementById('searchInput').value.trim();

    if (searchInput) {
        window.location.href = `index.html?searchBy=${searchBy}&searchInput=${searchInput}`;
    }
}
