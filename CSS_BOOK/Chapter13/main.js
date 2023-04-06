//AJAX

//Asynchronous Javascript And Xml
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

//can send information using ajax with a JSON string