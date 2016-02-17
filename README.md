# Storelocal
This basically came about because we had users that would begin to type in form data and then navigate away or leave their computer long enough that the form or session data wasn't retained.  Saving each elements value while they typed seemed a safe, easy solution so that is how the storedata.js library was born.  I am not a JS genius by any stretch so use it at your own risk.  My classic answer "Works for me",  You use case may not be the same.

Javascript library for retaining field data in localstorage.

An HTML5 localstorage capable browser is required.  Basically you can fill out each field and it will persist,even if the browser is closed, until the data is committed and local storage is cleared.  No real magic, just the grunt work of retrieving the field properties and an values and stuffing them into a string array for later retrieval.  This would be a bit more compact if I had used jQuery but I was trying to avoid the bulk.

Right now the js will look for elements with class=storelocal and will automatically store and automatically load text, textarea, selects, checkboxes and hidden fields probably have more to come at some point.

So, the way I use this is in my HTML:  I designate the element with a "storelocal" class and then when the page loads the code walks the DOM looking for those elements and adds listeners to them so that as changes are made, the contents are automatically saved.  Blur is used the the event for text, textarea.  Change is used for selects.  There are probably a bunch of other elements types to add.

HTML example:
```html
Text element: <input class=storelocal  type="text" id="fname" size="40" maxlength="64">

Textarea: <textarea class=storelocal rows="4" cols="50"></textarea>

Checkbox: <fieldset data-role="controlgroup">
    		<input  type="checkbox" id=savedata  class=storelocal >
    		<label for=savedata>Check this box.</label>
    	   </fieldset>
    	   
  Select:     <select id=choices class=storelocal>
  		<option value="eeny">Eeny</option>
  		<option value="meeny">Meeny</option>
  		<option value="miny">Miny</option>
  		<option value="moe">Moe</option>
	</select>
```
as long as class=storelocal is added to text,textbox,checkbox and selects, the script should capture and store the data.


This basic, hacky stuff that might be of some help.  I hope so.
