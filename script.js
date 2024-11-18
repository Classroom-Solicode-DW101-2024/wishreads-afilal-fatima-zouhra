
let books = [];
let categories = [];
let wishListArray = [];

let categoriesContainer = document.getElementById("category_section");
let booksContainer = document.getElementById("books_section");

fetch("books.json").then(results => {
    
    let myData = results.json();
    console.log(myData);
    return myData;
}).then((myData) =>{

    myData.forEach(data => {

        books.push(data);
        
    });

    console.log(books);
    categoriesFunction(books);

});

wishListArray = getBooksFromLocalStorage();

console.log("wishList : ");
console.log(wishListArray);


function categoriesFunction(arrayBooks=[]){

    let isCatAlredyAvailable = false;

        

    arrayBooks.forEach(book =>{

        isCatAlredyAvailable = false;

            for(let i = 0 ; i < categories.length ; i++){

                if(categories[i] === book.categorie){
                    isCatAlredyAvailable = true;
                    break;

                }

            }

            if(!isCatAlredyAvailable){
                categories.push(book.categorie);

                categoriesContainer.innerHTML += `<div class="checkbox_containers">
                <input type="checkbox" value="${book.categorie}" id="box_${book.categorie}" name="categories" class="categoryBox">
                <label for="box_${book.categorie}">${book.categorie}</label>
            </div>`;

            console.log(`box_${book.categorie}`);
            }

    });

    console.log(categories);

    
    let checkboxes = document.querySelectorAll(".categoryBox");

    checkboxes.forEach(checkBox =>{

        checkBox.addEventListener("click", () => {

            booksContainer.innerHTML = "";

            if (checkBox.checked) {
                
                checkboxes.forEach(otherCheckboxes => {
                    otherCheckboxes.checked = false;
                });
              
                checkBox.checked = true;

                arrayBooks.forEach(book =>{


                    if(book.categorie === checkBox.value){

                        let isInWL = false;

                        for(let i = 0 ; i< wishListArray.length ; i++){

                            if(book.title === wishListArray[i].title && book.author.fullName === wishListArray[i].author.fullName){
                                isInWL = true;
                                break;
                            }

                        }

                        if(isInWL){
                            booksContainer.innerHTML += `<div class="category_books">

            <img src="${book.cover}" alt="test book" class="book_cover">
            <h3 class="book_title">${book.title}</h3>
            <p class="book_authorName">${book.author.fullName}</p>
            <div class="content">
                <img class="add_to_wl_icon" src="images/addedToWL.png" alt="add to wishlist">
            </div>
        </div>`;
                        }else{
                            
                        booksContainer.innerHTML += `<div class="category_books">

                        <img src="${book.cover}" alt="test book" class="book_cover">
                        <h3 class="book_title">${book.title}</h3>
                        <p class="book_authorName">${book.author.fullName}</p>
                        <div class="content">
                            <img class="add_to_wl_icon" src="images/addToWL.png" alt="add to wishlist">
                        </div>
                    </div>`;

                        }



                    }


                });

                let addToWishListImg = document.querySelectorAll(".add_to_wl_icon");

                addToWishListImg.forEach(imageClick => {

                imageClick.addEventListener('click',()=>{
                    
                    let isInWishList = false;
                    let index;
                    let title = imageClick.closest(".category_books").querySelector('.book_title').textContent;
                    let authorName = imageClick.closest(".category_books").querySelector('.book_authorName').textContent;

                    arrayBooks.forEach(book => {

                        if(title === book.title && authorName === book.author.fullName){

                            for(let i =0; i < wishListArray.length ; i++){

                                if(wishListArray[i].title === title && wishListArray[i].author.fullName === authorName){
                                    isInWishList = true;
                                    index=i;
                                    break;
                                }

                            }

                            if(!isInWishList){
                                wishListArray.push(book);
                                imageClick.src = "images/addedToWL.png";
                                localStorage.setItem("books", JSON.stringify(wishListArray));
                            }else{
                                imageClick.src = "images/addToWL.png";
                                wishListArray.splice(index,1);
                                localStorage.setItem("books", JSON.stringify(wishListArray));
                            }

                            

                        }

                    });

                    console.log(wishListArray);


            });

        })
                

            } else {
                
                checkBox.checked = false;
            }

        })

    });

    


}

function getBooksFromLocalStorage() {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    return books;
}