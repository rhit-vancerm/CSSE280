/*

Callbacks

functions can be given as a parameter to another function- known as a callback

*/

function sing(song, callback) {
    console.log(`I'm singing along to ${song}`);
    callback();
}

function dance(){
    console.log("i'm moving my body to the groove")
}

sing(`Let it go`, dance);

// can also take an anonymous function in the callback

//callback using sort on numbers

function numerically(a,b) {
    return a-b;
}

[1, 3, 12, 5, 23].sort(numerically);

/*
    For Each

    array.forEach( (color, index) => {console.log("!")} )

    map()

    replaces each value in array with return value of function called
*/

/*
    GETTING ELEMENTS

    const h1 = document.getElementById('title');

    const listItems = document.getElementsByTagName('li');
    ^ node list

    const heroes = document.getElementsByClassName('hero');
    ^also node list

    document.querySelector()
    find the first element in document that matches argument
    document.querySelectorAll()
    all elements



    GETTING/SETTING ATTRIBUTES
    
    wonderWoman.getAttribute('class');
    gets class of wonderWoman

    wonderWoman.setAttribute('class', 'villain');
    changes class of wonderWoman to villain or adds it if it does not exist

    classList - list of all classes of element

    const test = document.createElement('li');



    UPDATING CSS

    const superman;
    superman.style.border = "red 2px solid";

    CSS separated by dashes must be written in camelCase

    superman.style.backgroundColor = 'blue';
    OR
    superman.style['backgound color'] = 'blue';

    superman.style.display = 'none';
    HIDES ELEMENT

    superman.style.display = 'block';
    REAPPEAR

    getComputedStyle()
    retrieves styles

*/