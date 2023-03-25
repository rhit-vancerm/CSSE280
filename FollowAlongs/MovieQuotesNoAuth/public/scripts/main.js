
var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIEQUOTE = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbMovieQuotesManager = null;

rhit.ListPageController = class{
	constructor(){
		document.querySelector("#submitAddQuote").addEventListener("click", (event) => {
			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			rhit.fbMovieQuotesManager.add(quote, movie);
		});

		$('#addQuoteDialog').on('show.bs.modal', function (event) {
			document.querySelector("#inputQuote").value = "";
			document.querySelector("#inputMovie").value = "";
		});
		$('#addQuoteDialog').on('shown.bs.modal', function (event) {
			document.querySelector("#inputQuote").focus();
		});

		rhit.fbMovieQuotesManager.beginListening(this.updateList.bind(this));
	}
	updateList(){
		console.log("update list on page");
		console.log(`num quotes = ${rhit.fbMovieQuotesManager.length}`);
	}
}

rhit.MovieQuote = class{
	constructor(id, quote, movie){
		this.id = id;
		this.quote = quote;
		this.movie = movie;
	}
}

rhit.FbMovieQuotesManager = class{
	constructor(){
		console.log("created fbmoviequotesmanager");
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE);
		this._unsubscribe = null;
	}
	add(quote, movie){
		this._ref.add({
			[rhit.FB_KEY_QUOTE]: quote,
			[rhit.FB_KEY_MOVIE]: movie,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function (docRef) {
			console.log("doc written with id: ", docRef.id);
		})
		.catch(function (error){
			console.error("error adding doc: ", error);
		});
	}
	beginListening(changeListener){
		this._unsubscribe = this._ref.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}
	stopListening(){
		this._unsubscribe();
	}
	// update(id, quote, movie){

	// }
	// delete(id){

	// }
	get length(){
		return this._documentSnapshots.length;
	}
	getMovieQuoteAtIndex(index){
		const docSnapshot = this._documentSnapshots[index];
		const mq = new rhit.MovieQuote(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_QUOTE),
			docSnapshot.get(rhit.FB_KEY_MOVIE),
		);

		return mq;
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	if(document.querySelector("#listPage")){
		console.log("list page");
		rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager();
		new rhit.ListPageController();
	}

	if(document.querySelector("#detailPage")){
		console.log("detail page");
	}
	

	// //temp code
	// const ref = firebase.firestore().collection("MovieQuotes");
	// ref.onSnapshot((querySnapshot) => {
		
	// 	querySnapshot.forEach((doc) => {
	// 		console.log(doc.data());
	// 	});

	// });

	// ref.add({
	// 	quote: "My first test",
	// 	movie: "My first movie"
	// });

	

};

rhit.main();
