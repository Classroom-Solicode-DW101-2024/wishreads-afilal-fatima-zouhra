fetch('./book.json')
.then(promise => {
    if(!promise.ok)
        console.log('Error');
    return promise.json();
})
.then(data =>{
    console.log(data);
});
