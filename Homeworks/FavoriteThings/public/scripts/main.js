
var rhit = rhit || {};

/** globals */
rhit.counter = 0;

rhit.updateCounter = (amount, isMult) => {
	if(isMult){
		rhit.counter *= amount;
	}
	else{
		rhit.counter += amount;
	}
	$("#counter").html(rhit.counter);
}

rhit.updateColor = (color) => {
	$("#favoriteColorBox").html(color)
	document.getElementById("favoriteColorBox").style.backgroundColor = color;
}

rhit.main = function () {
	console.log("Ready");
	
	$("#counterButtons button").click((event) => {

		const dataAmount = $(event.target).data("amount");
		const dataIsMultiplication = !!$(event.target).data("isMultiplication");

		rhit.updateCounter(dataAmount, dataIsMultiplication);
	});

	$("#colorButtons button").click((event) => {
		
		const dataColor = $(event.target).data("color");

		rhit.updateColor(dataColor);

	})

};

rhit.main();
