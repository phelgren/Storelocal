// Copyright 2016 by Pete Helgren
// MIT license
// https://opensource.org/licenses/MIT 

// Javascript for retaining field data in localstorage
// An HTML5 localstorage capable browser is required.  Basically you can fill out each field and it will persist,
// even if the browser is closed, until the data is committed and local storage is cleared.  No real
// magic, just the grunt work of retrieving the field properties and an values and stuffing them into a string
// array for later retrieval.  This would be a bit more compact if I had used jQuery but I was trying to avoid the 
// bulk.

// Right now the js will look for elements with class=storelocal and will automatically store and automatically
// load text, textarea, selects, checkboxes and hidden fields
// probably have more to come at some point
var storageObj = "storedData";

function getStorage(){
	
	// we'll need the object (this is easier to do with the JSON parser)
	var storageString = localStorage.getItem(storageObj);
	// could be empty
	if(storageString == null || storageString.length==0 )
		storageString ="[]";
	else
		if(storageString.indexOf("[")==-1) // only create and wrap the string as an array if needed
			storageString = "["+storageString+"]";
	
	
	var lsObjs = eval("("+storageString+")"); // JSON would be cleaner
	
	if (lsObjs == "undefined" ||  lsObjs == null ) {
		// create the storage
		localStorage.setItem(storageObj, []);
		// then set the variable
		lsObjs = [];
	}
	
	return lsObjs;
	
}

function storeFieldInfo(objPassedIn){

	
	// really all we want to store is just a name/value pair that is the ID of the object and the text value
	// so we need to make sure we have a text field (which we can expand to include other DOM objects later


	var workingObj = {};
	if(objPassedIn != undefined && objPassedIn != null)
		workingObj = objPassedIn;
	else
		workingObj = this;

		
		if (typeof localStorage  == 'undefined' ) {
				alert('Your browser does not support HTML5 localStorage. Try upgrading.');
				return false;
		} else {
			try {
				
				var arrayOfObjs = getStorage();
				
				// then find the object in the array
				// WM added str with regex on 10/30/2014 to remove unwanted characters such as RETURNs
				// PH Tweaked regex because was aggressively removing blanks as well
				// Need to start checking for types because of data format and storage differences
				var str;
				 if(workingObj.type == "checkbox")
					 str = workingObj.checked;
				 else{
					 str = workingObj.value;
					 if(str!=undefined)
						 
						str = str.replace(/[^a-zA-Z0-9_ ]/g, '');
				 }

				 if(str!=undefined){
					 
					    var newObj = "{\""+workingObj.id+"\":\""+ str +"\"}";
					    			    
						var idx = indexOfObjectIs(workingObj.id); // we are only looking for field id's 
						if(idx != undefined){
							if(idx == -1) { // isn't in the array so add it
								arrayOfObjs.push(newObj);
							}
							else{  // it IS in the array so replace it.
								// remove it
								arrayOfObjs.splice(idx,1);
								// add the replacement in
								arrayOfObjs.push(newObj);
							}
						    
							localStorage.setItem(storageObj, JSON.stringify(arrayOfObjs)); //saves to the database, 'key', 'value'
						}
						else
							return -1;
					}
				} catch (e) {

					alert(e.message); //data wasn't successfully saved due to an error
				
			}
		}
	}

function indexOfObjectIs(searchVal){
	
	// pull the array of objects from storage
	var arrayOfObjs = getStorage();
	
	if (arrayOfObjs != "undefined" && arrayOfObjs != null) {
		// iterate through the array and see if there is a match
	   for (var i=0;i<arrayOfObjs.length;i++) {
		   //return the index of the match
				if(arrayOfObjs[i] != null ){
					   var obj=eval("("+arrayOfObjs[i]+")");
					  
					   for(var key in obj){
						   if(key ==searchVal)
							   return i;
					   }
					
				}

		}
	}

	   return -1;
	
}

function loadSavedDataToForm(){
	
	// get the array of objects from local storage
	
	var arrayOfObjs = getStorage();
	
	if (arrayOfObjs != "undefined" ) { // must be there so load up any field data found
		
		// iterate through the array and see if there is a match
		   for (var i=0;i<arrayOfObjs.length;i++) {
			   var obj=eval("("+arrayOfObjs[i]+")");
			  // var obj = arrayOfObjs[i];
			   	for(var key in obj){
			   		
				 var te = document.getElementById(key);
				 
				 if(te != null && te.type == "checkbox"){
					 if(obj[key]=="true")	
						 te.checked = true;
					 else
						 te.checked = false;
					 
				 }
				 te.value =  obj[key];
			   	}
			}
		
		
	}
}

function clearStorage(){
	localStorage.removeItem(storageObj);
}

function hasClass(el, cls) {
	  return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
	}
	
// when the DOM has loaded we'll iterate through the elements we are interested in (elements containing data) and add 
// an event that will capture the data when it is modified (storeFieldInfo). 

window.onload = function()
{
   var slclasses = document.getElementsByClassName("storelocal"); // This should give us everything that has the storelocal class
   
   for (var i=0;i<slclasses.length;i++) {
	// Pick up text,textarea, hidden, checkbox fields
	if(slclasses[i].type == "text" || slclasses[i].type == "hidden" || slclasses[i].type == "textarea")

			slclasses[i].addEventListener('blur',storeFieldInfo,false);
	
	// Getting select *values* is as hard as returning them
	if(slclasses[i].type == "select"){
        var selelem = '#'+slclasses[i].id;
		document.querySelector(selelem).onchange = storeFieldInfo;
	}
	
	}
   
   loadSavedDataToForm();
   
   
}

function saveFormContents()
{

	var slclasses = document.getElementsByClassName("storelocal"); // This should give us everything that has the storelocal class

	   for (var i=0;i<slclasses.length;i++) {

		   if(slclasses[i].type == "text" || slclasses[i].type == "hidden" ||  slclasses[i].type == "textarea") 

			   storeFieldInfo(slclasses[i]);
		   
		   if(slclasses[i].type == "select"){
			   
		        var selelem = '#'+slclasses[i].id;
		        storeFieldInfo(document.querySelector(selelem));
			   
		   }
			   
	}

  
}

// Utility to clean all the storelocal fields if necessary

function clearFormContents()
{

	var slclasses = document.getElementsByClassName("storelocal"); // This should give us everything that has the storelocal class

	   for (var i=0;i<slclasses.length;i++) {

		   if(slclasses[i].type == "text" || slclasses[i].type == "hidden" ||  slclasses[i].type == "textarea") 

			   slclasses[i].value="";
		   
		   if(slclasses[i].type == "select"){
			   
		        var selelem = '#'+slclasses[i].id;
		       
		        selelem.value='';
			   
		   }
			   
	}

  
}
