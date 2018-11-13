function p2ring(){

		var json = new XMLHttpRequest(); // start a new variable to store the JSON in
		json.onreadystatechange = function() {
		  	if (this.readyState == 4 && this.status == 200) { // if HTTP header 200 - ok
		    var object = JSON.parse(this.responseText); // set the variable 'object' to whatever we get back, in our case it is an array of 10 different arrays

			    object.forEach(function(currency) { // for each of those arrays, split it into chunks called 'currency'
			      	document.write(
			        	currency.name +
			        	" is currently worth €" +
			        	currency.price_eur +
			        	" EUR<br>"
			      	); // get the array keys from the API
			    });
		  	}
		};
		json.open(
		  	"GET",
		  	"https://api.coinmarketcap.com/v1/ticker/?convert=EUR", // url
		  	true // async
		); // initialise the request
		json.send(); //send request
}
