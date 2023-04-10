var rhit = rhit || {};

rhit.FB_COLLECTION_PHOTO = "PhotoBucket";
rhit.FB_KEY_IMAGEURL = "imageurl";
rhit.FB_KEY_CAPTION = "caption";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbPhotosManager = null;
rhit.fbPhotoManager = null;

//from stackoverflow
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.ListPageController = class {
	constructor() {
		document.querySelector("#submitAddPhoto").addEventListener("click", (event) => {
			const imageURL = document.querySelector("#inputImageURL").value;
			const caption = document.querySelector("#inputCaption").value;
			
			rhit.fbPhotosManager.add(imageURL, caption);
		});

		$('#addPhotoDialog').on('show.bs.modal', function (event) {
			document.querySelector("#inputImageURL").value = "";
			document.querySelector("#inputCaption").value = "";
		});
		$('#addPhotoDialog').on('shown.bs.modal', function (event) {
			document.querySelector("#inputImageURL").focus();
		});

		rhit.fbPhotosManager.beginListening(this.updateList.bind(this));
	}

	updateList() {
		const newList = htmlToElement('<div id="columns"></div>');

		for (let i = 0; i < rhit.fbPhotosManager.length; i++) {
			const ph = rhit.fbPhotosManager.getPhotoAtIndex(i);
			const newCard = this._createCard(ph);

			newCard.onclick = (event) => {
				window.location.href = `/photo.html?id=${ph.id}`;
			}

			newList.appendChild(newCard);

		}

		const oldList = document.querySelector("#columns");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		oldList.parentElement.appendChild(newList);
	}

	_createCard(Photo) {
		return htmlToElement(
			`<div class="pin">
			<img src="${Photo.imageURL}" alt="${Photo.caption}">
			<p class="caption">${Photo.caption}</p>
			</div>`
		)
	}
}






rhit.Photo = class {
	constructor(id, imageURL, caption) {
		this.id = id;
		this.imageURL = imageURL;
		this.caption = caption;
	}


}





rhit.FbPhotosManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PHOTO);
		this._unsubscribe = null;
	}

	add(imageURL, caption) {
		this._ref.add({
			[rhit.FB_KEY_IMAGEURL]: imageURL,
			[rhit.FB_KEY_CAPTION]: caption,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function (docRef) {
			console.log("doc written with id: ", docRef.id);
		})
		.catch(function (error) {
			console.error("error adding doc: ", error);
		});
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50).onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}
	stopListening() {
		this._unsubscribe();
	}
	
	get length() {
		return this._documentSnapshots.length;
	}
	getPhotoAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const ph = new rhit.Photo(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_IMAGEURL),
			docSnapshot.get(rhit.FB_KEY_CAPTION)
		);

		return ph;
	}
}





rhit.FbPhotoManager = class {
	constructor(photoID) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PHOTO).doc(photoID);
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
	update(caption) {
		this._ref.update({
				[rhit.FB_KEY_CAPTION]: caption,
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

	get imageURL() {
		return this._documentSnapshot.get(rhit.FB_KEY_IMAGEURL);
	}

	get caption() {
		return this._documentSnapshot.get(rhit.FB_KEY_CAPTION);
	}

}






rhit.DetailPageController = class {
	constructor() {
		document.querySelector("#submitEditCaption").addEventListener("click", (event) => {
			const caption = document.querySelector("#inputCaption").value;
			rhit.fbPhotoManager.update(caption);
		});

		$('#editCaptionDialog').on('show.bs.modal', function (event) {
			document.querySelector("#inputCaption").value = rhit.fbPhotoManager.caption;
		});
		$('#editCaptionDialog').on('shown.bs.modal', function (event) {
			document.querySelector("#inputCaption").focus();
		});

		document.querySelector("#submitDeletePhoto").addEventListener("click", (event) => {
			rhit.fbPhotoManager.delete().then(function () {
				console.log("document deleted");
				window.location.href="/";
			}).catch(function (error) {
				console.log("error removing doc: ", error);
			})
		});


		rhit.fbPhotoManager.beginListening(this.updateView.bind(this));
	}
	updateView() {
		document.querySelector("#cardCaption").innerHTML = rhit.fbPhotoManager.caption;
		document.querySelector("#cardImage").alt = rhit.fbPhotoManager.caption;
		document.querySelector("#cardImage").src = rhit.fbPhotoManager.imageURL;
	}
}







/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	if (document.querySelector("#listPage")) {
		rhit.fbPhotosManager = new rhit.FbPhotosManager();
		new rhit.ListPageController();
	}

	if (document.querySelector("#detailPage")) {
		const queryString = window.location.search;
		console.log(queryString);
		const urlParams = new URLSearchParams(queryString);
		const photoID = urlParams.get('id');


		if (!photoID) {
			window.location.href = "/";
		}
		rhit.fbPhotoManager = new rhit.FbPhotoManager(photoID);
		new rhit.DetailPageController();
	}


};

rhit.main();