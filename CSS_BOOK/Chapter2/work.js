//this is a short comment

/* This is a multi-line
comment */

const message = 'Hello World!';
alert(message);

{
    //this is a block containing 2 statements
    const message = 'Hello!';
    alert(message);
}

console.log(typeof 'hello') //string
typeof 10 //number
typeof true //boolean
typeof {ninja: 'turtle'} //object
typeof [1,2,3] //object

//Variables

const name = 'Ryan'; //string

let score = 0; // "let" variables can be reassigned later

score = 5;

//const cannot be reassigned later

/* to see value of a variable,
enter it into the console */

//global scope is everywhere
//local scope is inside a block where variable is declared

let b = 2;
{b = 4; b;} //4
b; //also 4, because of let

{c = 2; c;}//2
c; //also 2 doesnt use const or let so it is global

//non-primitive assignments affect all references to object

// use \ to escape special characters in a string

//some String methods
name.length;
name.toUpperCase;
name.indexOf;
name.trim();

//template literals
`hello`

//symbols
const uniqueId = Symbol(`this is a unique id`);

//numbers
//float or integer
//some methods
5 .toExponential();
5 - 4;
4**2;
//% modulo

//+=, -=, *=, ++, --

// infinity - too big
// NaN - not a number
// Undefined - not given value
// Null - no value behaves as 0 with numbers
// Boolean - true or false
// ! - not
// !! - not not
// || - or
// && - and
// == soft equality
// === hard equality
// != soft inequality
// !== hard inequality
// > greater than
// < less than



//string to number
Number(`23`); //23
String(3); //'3'

const question = "What is superman's real name?"
const answer = prompt(quesiton);
alert(`you answered ${answer}`);