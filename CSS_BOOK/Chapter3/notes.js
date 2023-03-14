//array literals:
const myArray = [];

//adding values
myArray[0] = 'Hello';
myArray[1] = 'World';
myArray;

const newArr = [1,2,3,4,5];

//removing values
delete newArr[3];
newArr;
//value at pos3 becomes UNDEFINED

//destructuring
const[x,y] = [1,2];

//methods
newArr.length = 8;
//extra slots filled with undefined

newArr.pop();
//remove last item and returns

newArr.shift();
//same but first item

newArr.push(4);
//adds to end of array

newArr.concat([2,4,5]);
//merges two arrays

newArr.join('&');
//turns array into string with all items and chooses separator &

newArr.slice(2,4)
//returns part of array at indices

newArr.splice(2,1, 3)
//replaces part of array

newArr.reverse();
//reverse order of array

newArr.sort()
//sorts array

newArr.indexOf()
newArr.includes()
//self-explanatory

//2d arrays

//sets
const list = new Set();
list.add(1);
list.add(2).add(3);
list.delete(2);
list.clear();
//list to array -> [...setName]

const weak = new WeakSet();
//non-primitive, garbage collection

const romanNumerals = new Map();

romanNumerals.set(1,'I').set(2,'II');
//.get() .has() .size .delete() .clear() Array.from(map or set) weak maps, too

/*
    if(condition) {

    }
    else{

    }

    or
    condition ? code if true : code if false

    switch(number){
    case 4 :
        code break;
    case 5:
        code break;
    }

    while(condition) {

    }

    do{

    }
    while(condition)

    for(initialize; condition; after){
        code
    }

*/
