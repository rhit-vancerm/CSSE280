var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIEQUOTE = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.FB_KEY_AUTHOR = "author";
rhit.fbMovieQuotesManager = null;
rhit.fbSingleQuoteManager = null;
rhit.fbAuthManager = null;

//from stackoverflow
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.ListPageController = class {
	constructor() {

		document.querySelector("#menuShowAllQuotes").addEventListener("click", (event) => {
			window.location.href = "/list.html";
		});
		document.querySelector("#menuShowMyQuotes").addEventListener("click", (event) => {
			window.location.href = `/list.html?uid=${rhit.fbAuthManager.uid}`;
		});
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});


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
	updateList() {

		const newList = htmlToElement('<div id="quoteListContainer"></div>');

		for (let i = 0; i < rhit.fbMovieQuotesManager.length; i++) {
			const mq = rhit.fbMovieQuotesManager.getMovieQuoteAtIndex(i);
			const newCard = this._createCard(mq);

			newCard.onclick = (event) => {
				//rhit.storage.setMovieQuoteId(mq.id);
				window.location.href = `/moviequote.html?id=${mq.id}`;
			}

			newList.appendChild(newCard);

		}

		const oldList = document.querySelector("#quoteListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		oldList.parentElement.appendChild(newList);

	}

	_createCard(movieQuote) {
		return htmlToElement(`<div class="card">
        <div class="card-body">
          <h5 class="card-title">${movieQuote.quote}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${movieQuote.movie}</h6>
        </div>
      </div>`);
	}

}

rhit.MovieQuote = class {
	constructor(id, quote, movie) {
		this.id = id;
		this.quote = quote;
		this.movie = movie;
	}
}

rhit.FbMovieQuotesManager = class {
	constructor(uid) {
		this._uid = uid;
		console.log("created fbmoviequotesmanager");
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE);
		this._unsubscribe = null;
	}
	add(quote, movie) {
		this._ref.add({
				[rhit.FB_KEY_QUOTE]: quote,
				[rhit.FB_KEY_MOVIE]: movie,
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
				[rhit.FB_KEY_AUTHOR]: rhit.fbAuthManager.uid
			})
			.then(function (docRef) {
				console.log("doc written with id: ", docRef.id);
			})
			.catch(function (error) {
				console.error("error adding doc: ", error);
			});
	}
	beginListening(changeListener) {

		let query = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50);
		if(this._uid){
			query = query.where(rhit.FB_KEY_AUTHOR, "==", this.uid);
		}

		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}
	stopListening() {
		this._unsubscribe();
	}
	// update(id, quote, movie){

	// }
	// delete(id){

	// }
	get length() {
		return this._documentSnapshots.length;
	}
	getMovieQuoteAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const mq = new rhit.MovieQuote(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_QUOTE),
			docSnapshot.get(rhit.FB_KEY_MOVIE),
		);

		return mq;
	}
}

rhit.DetailPageController = class {
	constructor() {

		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});

		document.querySelector("#submitEditQuote").addEventListener("click", (event) => {
			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			rhit.fbSingleQuoteManager.update(quote, movie);
		});

		$('#editQuoteDialog').on('show.bs.modal', function (event) {
			document.querySelector("#inputQuote").value = rhit.fbSingleQuoteManager.quote;
			document.querySelector("#inputMovie").value = rhit.fbSingleQuoteManager.movie;
		});
		$('#editQuoteDialog').on('shown.bs.modal', function (event) {
			document.querySelector("#inputQuote").focus();
		});

		document.querySelector("#submitDeleteQuote").addEventListener("click", (event) => {
			rhit.fbSingleQuoteManager.delete().then(function () {
				console.log("document deleted");
				window.location.href = "/";
			}).catch(function (error) {
				console.log("error removing doc: ", error);
			})
		});


		rhit.fbSingleQuoteManager.beginListening(this.updateView.bind(this));
	}
	updateView() {
		document.querySelector("#cardQuote").innerHTML = rhit.fbSingleQuoteManager.quote;
		document.querySelector("#cardMovie").innerHTML = rhit.fbSingleQuoteManager.movie;

		if(rhit.fbSingleQuoteManager.author == rhit.fbAuthManager.uid){
			doc.querySelector("#menuEdit").style.display = "flex";
			doc.querySelector("#menuDelete").style.display = "flex";
		}

	}
}

rhit.FbSingleQuoteManager = class {
	constructor(movieQuoteId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE).doc(movieQuoteId);
	}
	beginListening(changeListener) {

		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("current data: ", doc.data());
				this._documentSnapshot = doc;
				changeListener();
			} else {
				console.log("no such document");
			}
		});

	}
	stopListening() {
		this._unsubscribe();
	}
	update(quote, movie) {
		this._ref.update({
				[rhit.FB_KEY_QUOTE]: quote,
				[rhit.FB_KEY_MOVIE]: movie,
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(() => {
				console.log("doc written with id: ", docRef.id);
			})
			.catch(function (error) {
				console.error("error adding doc: ", error);
			});
	}
	delete() {
		return this._ref.delete();
	}

	get quote() {
		return this._documentSnapshot.get(rhit.FB_KEY_QUOTE);
	}

	get movie() {
		return this._documentSnapshot.get(rhit.FB_KEY_MOVIE);
	}

	get author() {
		return this._documentSnapshot.get(rhit.FB_KEY_AUTHOR);
	}

}





// rhit.storage = rhit.storage || {};
// rhit.storage.MOVIEQUOTE_ID_KEY = "movieQuoteId";
// rhit.storage.getMovieQuoteId = function () {
// 	const mqId = sessionStorage.getItem(rhit.storage.MOVIEQUOTE_ID_KEY);
// 	if (!mqId) {
// 		console.log("No movie quote id in sessionStorage!");
// 	}
// 	return mqId;
// };
// rhit.storage.setMovieQuoteId = function (movieQuoteId) {
// 	sessionStorage.setItem(rhit.storage.MOVIEQUOTE_ID_KEY, movieQuoteId);
// };

rhit.LoginPageController = class {
	constructor() {
		document.querySelector("#rosefireButton").onclick = (event) => {
			rhit.fbAuthManager.signIn();
		}
	}
}

rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
		console.log("made auth manager");
	}
	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		})
	}
	signIn() {
		Rosefire.signIn("5d1f160b-c8c8-435a-853e-94e826196f39", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log("Rosefire success!", rfUser);

			firebase.auth().signInWithCustomToken(rfUser.token).catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				if(errorCode === 'auth/invalid-custom-token') {
					alert('the token you provided is invalid');
				}
				else{
					console.error("custom auth error", errorCode, errorMessage);
				}
			});

		});

	}
	signOut() {
		firebase.auth().signOut().catch((error) => {
			console.log("sign out error");
		})
	}
	get isSignedIn() {
		return !!this._user;
	}
	get uid() {
		return this._user.uid;
	}
}

rhit.checkForRedirects = function(){
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/list.html";
	}
	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/";
	}
}

rhit.initializePage = function(){
	const urlParams = new URLSearchParams(window.location.search);
	if (document.querySelector("#listPage")) {
		console.log("list page");

		
		const uid = urlParams.get('uid');

		rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager(uid);
		new rhit.ListPageController();
	}

	if (document.querySelector("#detailPage")) {
		
		
		const movieQuoteId = urlParams.get('id');


		if (!movieQuoteId) {
			window.location.href = "/";
		}
		rhit.fbSingleQuoteManager = new rhit.FbSingleQuoteManager(movieQuoteId);
		new rhit.DetailPageController();
	}

	if (document.querySelector("#loginPage")) {
		console.log("login page");
		new rhit.LoginPageController();
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		console.log("isSignedIn = ", rhit.fbAuthManager.isSignedIn);

		rhit.checkForRedirects();

		rhit.initializePage();

	});


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