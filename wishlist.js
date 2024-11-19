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
                    <img class="wishlist_read" src="images/${imageSrc}" alt="add to wishlist">
                </div>

            </div>`;

}
