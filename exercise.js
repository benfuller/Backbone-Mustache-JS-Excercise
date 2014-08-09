/*
Thanks for your interest in our job opening. Before moving forward we'd like you to complete the
following programming exercise to ensure your technical skills meet our requirements. Feel free
to contact us if you have any questions with the task.

For this exercise you'll need to implement a Backbone view that displays the data associated with
a model and enables a user to edit the associated information. You can use twitter bootstrap for
styling and Mustache.js for templating.

Your view will need to support two states, one to present model information and another to support
the editing of model properties. View the attached images to see examples of what these states
should look like.

In general the information in the model will map directly to the information being presented in
the view. The sample size property is one exception. The model will save three different possible
sample sizes which correspond to three different methods of computing the sample size. The
currently selected method is stored as a string key in the sample_size_method property. Possible
values are 'presentations', 'participants', and 'responses', which should map to the sample sizes
stored in the 'num_presentations', 'num_participants', and 'num_responses' properties,
respectively.

The type attribute is another exception. You can use the following hashmap to translate type_id
values into actual types:
{
	1: Categorical,
	2: Rating Scale,
	3: Time,
	4: Open Ended
}
*/

// You may edit the model (add methods, etc.) if you wish, but it's not strictly necessary for this
// exercise.
var ExerciseModel = Backbone.Model.extend({});

// You may modify this view however you wish, overriding the initialize and render methods,
// adding methods and properties, etc.
var ExerciseView = Backbone.View.extend({
	tagName: 'div',
	//events include editing the item, saving the item, and we update the model on each form control input change
	events: {
      "click #save":  "save", //the save button press, save to persistent storage
	  "click #edit": "edit", //the edit button press, shows the edit view, allows model edit
	  "change .form-control": "update", //triggered on model attribute change, updates the model attribute(s) appropriately
	},
	//added a 'template' parameter, defaults to the normal view, optionally can be set to 'edit' to show the edit template
	render: function(template) {
		//set the template if it is missing, if set at all show set to edit
		if (!template || template == ''){
			template = "view";
		}
		else {
			template = "edit";
		}
		//get the model
		var m = this.model; 
		//get the template
		var template = $("#"+template+"_template").html();
		//function to set selected values appropriately
		var selected = function(attr,val){return (m.get(attr)==val);}
		//set types & sample size methods 
		m.set({"types":[{"type_id":1,"type":"Categorical","sel":selected("type_id",1)},{"type_id":2,"type":"Rating Scale","sel":selected("type_id",2)},{"type_id":3,"type":"Time","sel":selected("type_id",3)},{"type_id":4,"type":"Open Ended","sel":selected("type_id",4)}],"sample_size_methods":[{"method":"Participants","value":"participants","sel":selected("sample_size_method","participants")},{"method":"Responses","value":"responses","sel":selected("sample_size_method","responses")},{"method":"Presentations","value":"presentations","sel":selected("sample_size_method","presentations")}],"sample_size":this.sample_size()});
		//Mustache it
		var output = Mustache.render(template,m.toJSON());	
		this.$el.html(output);
		return this;
	},
	//save functionality
	//would start RESTful call, right now it throws an alert, console log, and shows the regular view again
	save: function() {
		console.log("REST POST Call");
		alert("REST POST Call");
		this.render();
	},
	//edit functionality
	//loads the edit view
	edit: function() {
		this.render('edit');
	},
	//returns the proper sample size based upon the sample_size_method
	sample_size: function(){
		return this.model.get("num_"+this.model.get("sample_size_method"));
	},
	//the update function updates the model as the user "change"s them
	update: function(e){
		//hash map of id's to model attributes, XSS prevention
		var h = {"inputName":"name","textPrompt":"prompt","selectType":"type_id","selectSampleSize":"sample_size_method"};
		//check a value is set based upon the target's id or name
		if ($(e.target).val() != undefined){
			var val = h[$(e.target).attr("id")]; //set based upon id
			if (val == undefined){ //value wasn't found based upon id so use name
				val = h[$(e.target).attr("name")];
			}
			//a value exists so set the model
			if (val != undefined){
				this.model.set(val,$(e.target).val());
			}
		}
	}
});

/***** Do not modify code below this line *****/
$(function() {
	var testModel = new ExerciseModel({
		name               : 'Example question',
		prompt             : 'How would you categorize this question?',
		source             : 'uz',
		type_id            : 1,
		num_responses      : 36,
		num_participants   : 98,
		num_presentations  : 36,
		sample_size_method : 'presentations'
	});
	var testView = new ExerciseView({model: testModel});
	$('#container').html(testView.render().el);
});