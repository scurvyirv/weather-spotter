// declare variables on form
const searchEl = document.querySelector('#city-entry');
const submitEl = document.querySelector('#submit');

// prevent default + JSON for submission function
submitEl.addEventListener('click', function (event) {
    event.preventDefault();

    // Get an error message if not all fields completed
    if (searchEl.value.trim() === '') {
        alert('city cannot be blank'); 
    } else {

        // let searchData = JSON.parse(localStorage.getItem("tasks")) || [];

        //storing searches into local storage (DO WE NEED THIS?)
        let searchData;
        if (!localStorage.getItem('searchData')) {
            searchData = []; //how do we convert it to the commented one above
        }

        if (localStorage.getItem('searchData')) {
            searchData = JSON.parse(localStorage.getItem('searchData'));
        } 
        const blogPost = { 
            city: searchEl.value.trim(),
        }
        searchData.push(blogPost);

        localStorage.setItem('searchData', JSON.stringify(searchData));
    };
});