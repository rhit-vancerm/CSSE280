//callbacks

function wait(message, callback, seconds){
    setTimeout(callback, seconds*1000);
    console.log(message);
}

function selfDestruct(){
    console.log("boom");
}

wait('this tape will self destruct in 5', selfDestruct, 5);

// setTimeout runs asynchronously
// callback must wait for current stack to execute

//closures

// reference to a variable created inside a different scope

function outer(){
    const outside = 'outside';
    function inner(){
        const inside = 'inside';
        console.log(outside);
        console.log(inside);
    }
    return inner; //closure
}

// inner function has access to outer function's variables

//closure is formed when inner function is returned by outer function, so variables are still accessible

// fetch API

fetch('https://.....')
.then('response')
.catch('catches error')

if(Response.ok){
    return response
}

// ok property returns true if status is between 200 and 299

// response properties:
// Headersurl
// redirected
// type

redirect(newURL)

response.text() // transforms into javascript string

// JSON most common format for AJAX responses

fetch(url)
.then(response => response.json() );

// headers are used to pass additional info

const headers = new Headers();
// has(), get(), append(), delete()

//async
async function functionName() {
    //const var = await afn();

}

//promises
//future result of async operation

const promise = new Promise((resolve, reject) => {
    if(success){
        resolve(value);
    }
    else{
        reject(error)
    }
})


