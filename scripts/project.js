// YOUR NAME HERE

// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";
const basketIdKey = "achat";
const deleteIdKey = "remove";
const updateIdKey = "update";

// === global variables  ===
// the total cost of selected products 
var total = 0;

// variable to control what catalog to use
var choice = parseInt(localStorage.getItem("choice"));

// global variable catalog used
var catalog = [];

// function called when page is loaded, it performs initializations 
var init = function () {
	//localStorage.clear();
	var searchBar = document.getElementById("filter"); // get filter input
	console.log(localStorage); // 
	searchBar.title = "Saisir du text"; // add title
	//add keyup event on the search bar which call search function
	searchBar.onkeyup = function(){search();}; // search function from the line 545
	// if choice is defined, call create shop function with the corresponding catalog
	if (choice) {
		createShop(choice);	// from line 60
	} else {					//else call createshop function with the catalog 1
		choice = 1;
		localStorage.setItem("choice",choice); // define choice value in localStorage
		createShop(choice); console.log(localStorage);
	}
	addChangeCatalogButton(); // from line 181. A button to switch catalogs
	addDeleteAllButton(); // from the line 247. A button to delete in one time all the basket content

	// if the basket is not previously empty
	if (localStorage.length>1) { // we start from 1 because the first index of localStorage is for catalog choice value
		chargeBasket(); // charge it. From line 581
	}
	
	// TODO : add other initializations to achieve if you think it is required
}
window.addEventListener("load", init);



// usefull functions

/*
*@param choix (integer 1 or 0) if choix equals to 0 we use catalog1 else (equals to 0) we use catalog2
* create and add all the div.produit elements to the div#boutique element
* according to the product objects that exist in 'catalog' variable
* Depending to choice value, we affect corresponding catalog to global variable catalog
*/
var createShop = function (choix) {
	var shop = document.getElementById("boutique");
	if (choix == 1) {
		catalog = catalog1;
	} else {
		catalog = catalog2;
	}
	for(var i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i)); // createProduct is from line 78
	}
}

/*
* create the div.produit elment corresponding to the given product
* The created element receives the id "index-product" where index is replaced by param's value
* @param product (product object) = the product for which the element is created
* @param index (int) = the index of the product in catalog, used to set the id of the created element
*/
var createProduct = function (product, index) {
	// build the div element for product
	var block = document.createElement("div");
	block.className = "produit";
	// set the id for this product
	block.id = index + "-" + productIdKey;
	// build the h4 part of 'block'
	block.appendChild(createBlock("h4", product.name));
	
	// /!\ should add the figure of the product... does not work yet... /!\ 
	block.appendChild(createFigureBlock(product));

	// build and add the div.description part of 'block' 
	block.appendChild(createBlock("div", product.description, "description"));
	// build and add the div.price part of 'block'
	block.appendChild(createBlock("div", product.price, "prix"));
	// build and add control div block to product element
	block.appendChild(createOrderControlBlock(index));
	return block;
}


/* return a new element of tag 'tag' with content 'content' and class 'cssClass'
 * @param tag (string) = the type of the created element (example : "p")
 * @param content (string) (optional) = the html wontent of the created element (example : "bla bla") i've make it optional
 * @param cssClass (string) (optional) = the value of the 'class' attribute for the created element
 */
var createBlock = function (tag, content, cssClass) {
	var element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
	}
	if (content != undefined) {
		element.innerHTML = content;
	}
	return element;
}

/*
* builds the control element (div.controle) for a product
* @param index = the index of the considered product
*
* TODO : add the event handling, 
*   /!\  in this version button and input do nothing  /!\  
*/
var createOrderControlBlock = function (index) {
	var control = document.createElement("div");
	control.className = "controle";

	// create input quantity element
	var input = document.createElement("input");
	input.id = index + '-' + inputIdKey;
	input.type = "number";
	input.step = "1";
	input.value = "0";
	input.min = "0";
	input.max = MAX_QTY.toString();
	// add input to control as its child
	control.appendChild(input);
	
	// create order button
	var button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-" + orderIdKey;
	button.title = "choisir d'abord le nombre souhaité pour cet article";
	// add control to control as its child
	control.appendChild(button);

	// add eventlistener to input for handling a value change
	input.addEventListener('input', updateValue);

	// add eventlistener on button for handling a click
	button.addEventListener('click', addtobasket);
	
	// the built control div node is returned
	return control;
}


/*
* create and return the figure block for this product
* see the static version of the project to know what the <figure> should be
* @param product (product object) = the product for which the figure block is created
*
* TODO : write the correct code
*/
var createFigureBlock = function (product) {
	// TODO <figure><img src="images/bulbizarre.jpg" alt="Pokemon Bulbizarre"></figure>
	// Create figure tag
	let figure = createBlock("figure"); //document.createElement("figure");
	// Create image tag
	let img = createBlock("img"); //document.createElement("img");
	// add image source and alt attribut to img tag
	img.src = product.image;
	img.alt = product.name;
	//add image tag to figure tag
	figure.appendChild(img);
	return figure;
}

/*
* Create and add a button which will permit to change the catalog
*/
function addChangeCatalogButton() {
	h1 = document.getElementsByTagName("h1")[0]; // get total h1
	//body = h1.parentElement;
	//divBoutique = document.getElementById("boutique");
	button = document.createElement("button"); // create catalog change button
	button.innerHTML = "<b>Changer de catalogue</b>";
	button.id = "changeCatalog";			//add id
	// button style configuration
	button.style.backgroundColor = "rgb(43, 0, 200);";
	button.style.borderRaidius = "4px";
	button.style.color = "black";
	button.style.margin = "6px 2px";
	button.style.padding = "4px";
	button.style.cursor = "pointer";
	// add eventlistener on button for handling a click with changeCatalog function from line 209
	button.addEventListener('click', changeCatalog);
	div = document.createElement("div"); //create a div
	div.style.width = "100%";
	//div.appendChild(h1);
	div.appendChild(button); // put the button in the div
	//body.insertBefore(div, divBoutique);
	h1.after(div); // add delete all button after total div
}

/*
* Remove all products from current catalog et call createShop function to build the other catalog
* ask confirmation before
*/
function changeCatalog() {

	if (confirm("Attention !! vous perdrez votre panier actuel. \n Voulez vous continuer ?")) {
		let boutique = document.getElementById("boutique"); // get div#boutique element
		let block_achats = document.getElementsByClassName("achats")[0]; //get basket tag
		let children = boutique.childNodes; // get all children of div#boutique
		let basketChildren = block_achats.childNodes; // get all children of the basket

		//delete all the products
		for (let index = 0; index < children.length; index+1) { //loop through
			children[index].remove();
		}

		//delete all the products in the basket
		for (let index = 0; index < basketChildren.length; index+1) { //loop through
			basketChildren[index].remove();
		}
		total = 0; // reset basket amount to 0
		document.getElementById("montant").innerHTML = total; // write the new total value
		localStorage.clear(); // clear all local storage items
		console.log(choice, localStorage);
		//change the catalog content
		if (choice == 1) {
			choice++; // put choice to 2 for next change
			createShop(choice); // create shop with the catalog 2
			localStorage.setItem("choice",choice); //set the first index of localStorage with choice value
		} else {
			choice--; // reset choice to 1 for next change
			createShop(choice); // create shop with catalog 1
			localStorage.setItem("choice",choice);//set the first index of localStorage with choice value
		}
	}
	
}

/*
* Create and add a button which will permit to delete all products in basket in one time
*/
function addDeleteAllButton() {
	div = document.getElementById("total"); // get total div
	button = document.createElement("button"); // create delete all button
	button.innerHTML = "Tout supprimer";
	button.id = "delAll";				//add id
	// deleteAll button style configuration
	button.style.backgroundColor = "rgb(200,0,0)";
	button.style.borderRaidius = "4px";
	button.style.color = "white";
	button.style.margin = "6px 2px";
	button.style.padding = "4px";
	button.style.cursor = "pointer";
	// add eventlistener on button for handling a click with deleteAll function wrote from line 460
	button.addEventListener('click', deleteAll);
	div.after(button); // add delete all button after total div
}

/*
* receive an event and make active or not the associated button
* @param e (event caught) 
*/
function updateValue(e) {
	//assure the input value is an integer
	inputvalue = parseInt(e.target.value);
	//get the input id
	input_id = e.target.id;
	//get the button associate to the input by deducing its id with the 1st character of the input id
	button = document.getElementById(input_id.split("-", 1) + "-" + orderIdKey);
	//Change button opacity depending to the input value
	if (!Number.isInteger(inputvalue) || inputvalue >=10 || inputvalue < 0) {
		//notice user wrong entered data
		alert("Veuillez entrer un nombre entier inférieur à 10");
		e.target.value = "0"; //put back input value to 0
		//indicate user what to do using button tittle property
		button.title = "choisir d'abord le nombre souhaité pour cet article";
		button.style.opacity = 0.25; // let button opacity in 0.25
	} else if (inputvalue > 0){ // when input value is correct
		//put button opacity to 1
		button.style.opacity = 1;
		//indicate user what to do next with button tittle
		button.title = "Ajouter au panier";
	} else { // when input value does not match to any condition
		// let button opacity in 0.25
		button.style.opacity = 0.25;
		//indicate user what to do
		button.title = "choisir d'abord le nombre souhaité pour cet article";
	}
}

/*
* receive the button click event and add the associated product to the basket
* @param e (event caught) 
*
*/
function addtobasket(e) {

	//get the tag div which contains the basket list
	let block_achats = document.getElementsByClassName("achats")[0];
	// First check if block_achats has child nodes
	if (block_achats.hasChildNodes()) {

		let children = block_achats.childNodes; // get all children
		let find = 0; // variable used to know if the chosed product is already in the basket or not after the loop "for"

		for (let index = 0; index < children.length; index++) { //loop through
			
			if (children[index].id.split("-", 1)[0] == e.target.id.split("-", 1)[0]) { // compare the child index and the button index
				
				//increment find value to notice that the product is already in the basket list
				find += 1;
				//get corresponding index
				let idx = e.target.id.split("-", 1)[0];
				console.log(catalog[idx], index, children[index].id.split("-", 1)[0], e.target.id.split("-", 1)[0]);
				// get the div tag of the matching child with the class "quantite" 
				let quantity_div = children[index].querySelector('.quantite');
				//get quantity_div content
				let old_quantite = parseInt(quantity_div.textContent);
				//get the input tag of the matching child
				let input = document.getElementById(e.target.id.split("-", 1)[0] + "-" + inputIdKey);
				//get the input value
				let input_value = parseInt(input.value);
				//calculate the new quantity which will be displayed in the basket
				let quantity = old_quantite + input_value;

				//verify if the new quantity after adding the product is over 9
				if (quantity > MAX_QTY) {
					//notice the user that he can't put in more than 9
					alert("Désolé!! Vous ne pouvez pas commander plus de "+MAX_QTY+" "+ catalog[idx].name);
				} else {
					//write the new quantity in the quantity div
					quantity_div.innerHTML = quantity;
					//call total update function
					basketAmount(input_value, catalog[idx].price);
					//update the quantity in the local storage
					localStorage.setItem(idx, quantity);
					console.log(localStorage);
				}

				//put back the button opacity to 0.25 and input value to 0
				e.target.style.opacity = 0.25;
				input.value = "0";
			}
		}
		//when there's no matching child, add the corresponding product in the basket
		if (e.target.style.opacity == 1 && find == 0) {
			//call function which add chosed product to the basket
			createBasketBlock(e, block_achats);
		}

	} else { // if it has no child, that means the busket is empty. So we create new block corresponding to the product chosed
		
		//verify that the opacity of the button is at 1 to be reassured that right quantity is entered
		if (e.target.style.opacity == 1) {
			// call function which add chosed product to the basket
			createBasketBlock(e, block_achats);
		}
	}
}

/*
* receive an event and create new basket element to put in the basket
* @param e (event caught) 
* @param achatBlock (tag object) = the div tag where basket elements are listed
*The block is created following the mini-projet-js-static.html
*/
function createBasketBlock(e, achatBlock) {
	// create element div with class "achat"
	let element = createBlock("div", undefined, "achat");
	//add to the element an id macthing the product linked to the source of the event
	element.id = e.target.id.split("-", 1) + "-" + basketIdKey;
	//build the id of the product corresponding to the event source
	let product_index = parseInt(e.target.id.split("-", 1)[0]);
	// get the product by the id builded
	let product = catalog[product_index];
	console.log(product);
	//create figure element to display the product image
	let figure = createFigureBlock(product);
	//add figure to the div
	element.appendChild(figure);
	//add h4 tag to the div
	element.appendChild(createBlock("h4", product.description));
	//get the input tag of the matching to the product
	let input = document.getElementById(e.target.id.split("-", 1)[0] + "-" + inputIdKey);
	//build its value depending whether it exists basket charging event
	let input_value = parseInt(input.value);
	/*if (e.detail) {
		console.log(input_value);
		//input_value = e.detail;
		console.log(input_value, e.detail);
		e.stopPropagation();
	}*/
	console.log(input_value);
	//add div with class "quantite" and write in the input value
	element.appendChild(createBlock("div", input_value, "quantite"));
	//add div with class "prix" and write in the product price
	element.appendChild(createBlock("div", product.price, "prix"));
	//add div with class "controle" and get it
	let update_div = element.appendChild(createBlock("div", undefined, "controle"));
	let div = element.appendChild(createBlock("div", undefined, "controle"));
	//add button with class "modifier" in the update div controle
	update_button = update_div.appendChild(createBlock("button", undefined, "modifier"));
	//add button with class "retirer" in the div controle
	button = div.appendChild(createBlock("button", undefined, "retirer"));
	//indicate user what the button do using  tittle property
	update_button.title = "modifier le nombre d'articles";
	button.title = "supprimer cet article";
	//add corresponding id to the button
	button.id = e.target.id.split("-", 1) + "-" + deleteIdKey;
	update_button.id = e.target.id.split("-", 1) + "-" + updateIdKey;
	// add eventlistener on button for handling a click
	button.addEventListener('click', deleteproduct);
	update_button.addEventListener('click', updatequantite);
	//add element to the basket list
	achatBlock.appendChild(element);
	//put back the button opacity to 0.25 and input value to 0
	e.target.style.opacity = 0.25;
	input.value = "0";
	//call total update function
	basketAmount(input_value, product.price);
	// save the product in local storage
	localStorage.setItem(product_index, input_value);
	console.log(localStorage);
}

/*
* receive an event and delete the corresponding product from the basket 
* @param e (event catched) 
* @param achatBlock (tag object) = the div tag where basket elements are listed
*The block is created following the mini-projet-js-static.html
*/
function deleteproduct(e) {
	//get the product div tag we want to delete from basket
	element_to_delete = document.getElementById(e.target.id).parentElement.parentElement;
	console.log(element_to_delete);

	//get the quantity of the product we want to delete
	let qte = element_to_delete.querySelector('.quantite').textContent;
	//build the id of the product corresponding to the event source
	let product_index = parseInt(e.target.id.split("-", 1)[0]);
	// get the product by the id builded
	let product = catalog[product_index];
	console.log(product, qte);

	//call total update function
	basketAmount(qte, product.price, "del");
	//delete the product from the basket
	element_to_delete.remove();
	localStorage.removeItem(product_index);
}

/*
* loop through products and delete all them and then reset total to 0 after confirmation
*/
function deleteAll() {
	//get the tag div which contains the basket list
	let block_achats = document.getElementsByClassName("achats")[0];
	// First check if block has child nodes
	if (block_achats.hasChildNodes()) {

		let children = block_achats.childNodes; // get all children

		if (confirm("Etes vous sûr(e) de vouloir vider votre panier ?")) { // ask confirmation
			for (let index = 0; index < children.length; index+1) { //loop through
				//delete the product from the basket
				children[index].remove();
			}
			total = 0;
			document.getElementById("montant").innerHTML = total; // write the new total value
			localStorage.clear(); // clear all local storage items
			localStorage.setItem("choice",choice); //set the first index of localStorage with choice value
		}
		
	} else {
		alert("Votre panier est vide");
	}
}

/*
* receive an event and update the corresponding product quantite from the basket 
* @param e (event caught)
*/
function updatequantite(e) {
	//get current quantity in the basket
	let current_qte = document.getElementById(e.target.id).parentElement.parentElement.querySelector('.quantite').textContent;
	let product = catalog[parseInt(e.target.id.split("-", 1)[0])]; // get the corresponding product
	// ask user to enter the new quantity he wants
	let new_qte = prompt("Saisissez la nouvelle quantité",current_qte);
	let difference = parseInt(new_qte) - parseInt(current_qte);
	//let addition = parseInt(current_qte) + parseInt(new_qte);
	console.log(current_qte, product.price, new_qte);

	if (new_qte == null) { //if the user cancels, nothing to do
		console.log("rien a faire...");
	} else if (difference == 0) { // if the user put in the same quantity, nothing to do
		console.log("Rien a faire egalement...", difference);
	} else if (new_qte>MAX_QTY) { // check if the max qte allowed is respected 
		alert("Désolé!! Vous ne pouvez pas commander plus de "+MAX_QTY+" "+product.name);
	} else if (new_qte <= 0) { // if new qte entered equal to 0, we delete the corresponding product
		if (confirm("Cet article sera supprimé !!")) { // ask confirmation before
			deleteproduct(e);
		} else {
			console.log("Rien a faire...");
		}
	} else if (0 < new_qte && new_qte <= MAX_QTY) { // if new quantity is correctly entered, update data
		
		document.getElementById(e.target.id).parentElement.parentElement.querySelector('.quantite').innerHTML = new_qte;
		basketAmount(difference, product.price);
		console.log("propre propre");
	} else {
		alert("Mauvaise saisie !! Veuillez entrer des nombres!!");
	}
}

/*
*Update the total value of the basket
*@param quantite (number entered in input field) 
*@param price (corresponding product price) 
*@param action (value which permit to know if the total value have to increase or decrease)
*/
function basketAmount(quantite, price, action) {

	if (action == "del") {
		// decrease total value from amount of deleted product
		total -= parseInt(quantite) * parseInt(price);
		document.getElementById("montant").innerHTML = total; // write the new total value
	} else {
		// increase total value from amount of new product
		total += parseInt(quantite) * parseInt(price);
		document.getElementById("montant").innerHTML = total; // write the new total value
	}
}

/*
*Search product names which contain the characters string which are gradually entered 
* in the search bar and display them
*When any character is entered, all products are displayed
*
*/
function search() {
    let input, filter, boutique, products, product_index, i, product_name, result_counter; //declare variables
	console.log("recherche...");
    input = document.getElementById("filter"); //get input tag of the search bar
    filter = input.value.toUpperCase(); //get the value entered in the search bar
    //div_achats = document.getElementsByClassName("achats")[0]; // get the div where all ordered products are listed
	boutique = document.getElementById("boutique"); // get the div boutique where all products are listed
    //div_achat = div_achats.getElementsByClassName("achat"); // get all children of previous div (every div represent a ordered product) 
    products = boutique.getElementsByClassName("produit"); // get all children of boutique (every child is a product)
	result_counter = 0; // variable to count how many product match with the research

	for (i = 0; i < products.length; i++) { // for every product
        product_index = parseInt(products[i].id.split("-", 1)[0]); // get corresponding product index
		product_name = catalog[product_index].name; // get corresponding product name
		//verify if product name contains the entered text  
        if (product_name.toUpperCase().indexOf(filter) > -1) {
            products[i].style.display = ""; // display the product
			result_counter++;
		} else {
            products[i].style.display = "none"; // hide the product
		}
    }

	//Add a paragraph to indicate there is no macthing result
	let paragraph = document.getElementById("noresult");
	if (!paragraph && result_counter == 0 && input.value != "") { // check if paragraph already exist
		let p = createBlock("p", "AUCUN RESULTAT", "noresult"); // create paragraph with content and class
		p.id = "noresult"; // add id to the paragraph
		boutique.appendChild(p); // add the paragraph to the div which must contains products list
	} else if (paragraph && result_counter != 0) { // if paragraph exist and research has results
		paragraph.remove(); //remove the paragraph
	} else if (paragraph && input.value == "") { // if paragraph exist and nothing is entered in search bar
		paragraph.remove(); //remove the paragraph
	}
}

function chargeBasket() {
	for (let index = 1; index < localStorage.length; index++) { // we start with 1 because the 1st element of local storage is catalog choice value 
		let product_idx = localStorage.key(index);
		let quantite = localStorage.getItem(product_idx);
		//const element = array[index];
		/*const event = new CustomEvent("build", { 
			detail: quantite, 
			bubbles: false,
			cancelable: true,
			composed: false, 
		});
		document.getElementById(product_id.toString()+"-"+orderIdKey).dispatchEvent(event);
		createBasketBlock(event, document.getElementsByClassName("achats")[0]);
		console.log(product_id,quantite, event.detail);*/

		let basket = document.getElementsByClassName("achats")[0];
		let product = catalog[product_idx];
		// create element div with class "achat"
		let element = createBlock("div", undefined, "achat");
		//add to the element an id macthing the product linked to the source of the event
		element.id = product_idx.toString() + "-" + basketIdKey;
		//create figure element to display the product image
		let figure = createFigureBlock(product);
		//add figure to the div
		element.appendChild(figure);
		//add h4 tag to the div
		element.appendChild(createBlock("h4", product.description));
		//add div with class "quantite" and write in the input value
		element.appendChild(createBlock("div", quantite, "quantite"));
		//add div with class "prix" and write in the product price
		element.appendChild(createBlock("div", product.price, "prix"));
		//add div with class "controle" and get it
		let update_div = element.appendChild(createBlock("div", undefined, "controle"));
		let div = element.appendChild(createBlock("div", undefined, "controle"));
		//add button with class "modifier" in the update div controle
		update_button = update_div.appendChild(createBlock("button", undefined, "modifier"));
		//add button with class "retirer" in the div controle
		button = div.appendChild(createBlock("button", undefined, "retirer"));
		//indicate user what the button do using  tittle property
		update_button.title = "modifier le nombre d'articles";
		button.title = "supprimer cet article";
		//add corresponding id to the button
		button.id = product_idx.toString() + "-" + deleteIdKey;
		update_button.id = product_idx.toString() + "-" + updateIdKey;
		// add eventlistener on button for handling a click
		button.addEventListener('click', deleteproduct);
		update_button.addEventListener('click', updatequantite);
		//add element to the basket list
		basket.appendChild(element);
		//call total update function
		basketAmount(quantite, product.price);
	}
}