/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Ryan_Vance
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
const apiUrl = "http://localhost:3000/api/"
var selectedId = "";
var editEntryMode = false;

rhit.variableName = "";
let counter = 0;

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

rhit.ClassName = class {
	constructor() {

	}

	methodName() {

	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	document.querySelector("#decButton").onclick = (event) => {
		console.log("decrement button");
		counter--;
		updateView();
	};
	document.querySelector("#resetButton").onclick = (event) => {
		console.log("reset button");
		counter = 0;
		updateView();
	};
	document.querySelector("#incButton").onclick = (event) => {
		console.log("increment button");
		counter++;
		updateView();
	};
	document.querySelector("#createButton").onclick = (event) => {
		createEntry();
	};
	document.querySelector("#updateButton").onclick = (event) => {
		updateEntry();
		
	};
	document.querySelector("#deleteButton").onclick = (event) => {
		deleteEntry();
		
	};

	loadEntries(); //get data from server and populate entries

};

function updateView(){
	document.querySelector("#counterText").innerHTML = `Count = ${counter}`;

	if(editEntryMode){
		document.querySelector("#createButton").disabled = true;
		document.querySelector("#updateButton").disabled = false;
		document.querySelector("#deleteButton").disabled = false;
	}
	else{
		document.querySelector("#createButton").disabled = false;
		document.querySelector("#updateButton").disabled = true;
		document.querySelector("#deleteButton").disabled = true;
	}
}

function loadEntries(){
	document.querySelector("#displayEntries").innerHTML = "";
	let allEntries = fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			for(let i=0;i<data.length;i++){
				document.querySelector("#displayEntries").innerHTML += 
				`<button id="id${i}" onclick=loadEntry(${i}); >Select Entry</button><label>${data[i].name}</label>&nbsp;<label>${data[i].count}</label><br>`;
			}
		});
}

function loadEntry(id){
	selectedId = id;
	let entry = fetch( apiUrl + "id/" + id)
	.then(response => response.json())
	.then(data => {
		document.querySelector("#inputName").value = data.name;
		counter = data.count;
		editEntryMode = true;
		updateView();
	})
}

function createEntry(){
	
	let name = document.querySelector("#inputName").value;
	let data = {"name": name, "count": counter};

	let entry = fetch(apiUrl, {
		method: "POST", headers: {"Content-Type": 'application/json'}, body: JSON.stringify(data)
	})
		.then(data => {
			editEntryMode = false;
			document.querySelector("#inputName").value = "";
			counter = 0;
			updateView();
			loadEntries();
		})
		.catch((err) => {
			console.log(err);
		})
}

function deleteEntry(){
	fetch( apiUrl + "id/" + selectedId,
	{method : "DELETE"}
	)
	.then(data => {
		editEntryMode = false;
		document.querySelector("#inputName").value = "";
		counter = 0;
		
		updateView();
		loadEntries();
	})
	.catch((err) => {
		console.log(err);
	})
}

function updateEntry(){
	let name = document.querySelector("#inputName").value;
	let data = {"name":name, "count": counter};

	fetch( apiUrl + "id/" + selectedId,
	{
		method: "PUT", headers: {"Content-Type": 'application/json'}, body: JSON.stringify(data)
	}
	)
	.then(data => {
		editEntryMode = false;
		document.querySelector("#inputName").value = "";
		counter = 0;
		
		updateView();
		loadEntries();
	})
	.catch((err) => {
		console.log(err);
	})
}

rhit.main();
