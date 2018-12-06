function set_recipe(title, cost, time, difficulty, rating, img_url, instructions, ingredients){
	var recipe = '<div style="text-align: left">'+
                    '<div class="food-title">'+
                    	'<input value="'+title+'" placeholder="Title of Your Recipe"></input>'+
                    '</div>'+
                    '<div class="food-meta">'+
                    	'Time: <input value='+time+'></input> min<br>'+
                    	'Difficulty: <input value="'+difficulty+'" placeholder="1 to 5"></input><br>'+
                    	'Image: <input id="food-img" value="'+img_url+'" style="width: 200px" placeholder="Image URL"></input><br>'+
                    '</div>'+
                  '</div>'+
                  '<img class="food-img" src="'+img_url+'" onerror="this.src=\'img/default.png\'">'+
                  '<div class="instruction-header">Ingredients</div>'+
                  '<div id="ingredient-tab"></div>'+
                  '<div class="food-instruction">'+
                    '<div class="instruction-header">Instruction</div>'+
                    '<ol>';
                    for(var i in instructions){
        recipe +=       '<li><div contenteditable>'+instructions[i]+'</div><button class="delete">Delete</button></li>';
    				}
    	recipe +=		'<li><button class="addLineBtn">Add New Line</button></li>'+
        		   '</ol>'+
        		  '<button class="redBtn" id="SaveChangeBtn" style="margin-top: 14px">Save Changes</button>'+
                  '</div>';
    $(".recipe").html(recipe);
    ingredient_fullset();
    for(var i in ingredients){
    	check_ingredient(ingredients[i]);
    }
}

function add_recipe_stack(title, cost, time, difficulty, rating, img_url){
	var stack = '<div class="recipe-stack">'+
					'<img src="'+img_url+'">'+
					'<div>'+
                    	'<span class="title">'+title+'</span><br>'+
                    	'<span class="meta">Cost: '+cost+', Time: '+time+', Difficulty: '+difficulty+', Rating: '+rating+'</span>'+
                    '</div>'+
                    '<button>Delete</button>'+
                '</div>';
    $(".side-tab").prepend(stack);
}

function set_recipe_stacks(recipes){
	for(var idx in recipes){
		add_recipe_stack(recipes[idx].title, 
						 recipes[idx].cost, 
						 recipes[idx].time, 
						 recipes[idx].difficulty, 
						 recipes[idx].rating, 
						 recipes[idx].img_url);
	}
}

function save_changes(){
	var title = $(".food-title > input").val();
	var time = $(".food-meta > input:eq(0)").val();
	var difficulty = $(".food-meta > input:eq(1)").val();
	var img_url = $(".food-meta > input:eq(2)").val();

	var instructions = extract_instructions();
	var ingredients = extract_selected_ingredients();
	var quantity = [];
	for(var i=0; i < ingredients.length; i++)
		quantity.push(1);

	return {Title: title, Time: time, Difficulty: difficulty, Picture_url: img_url, 
			Instruction: instructions, Ingredients: ingredients, User: localStorage.getItem("userId"), Ingredients_quantity: quantity};
}

$(document).on('click', ".recipe-add", function(){
	set_recipe("", "", "", "", "", "", ["", "", ""], []);
})

$(document).on('change', "#food-img", function(){
	var img_url = $(".food-meta > input:eq(2)").val();
	$(".food-img").prop("src", img_url);
})

$(document).on('click', '.ingredient-card', function(){
	if($(this).hasClass("checked"))
		$(this).removeClass('checked');
	else
		$(this).addClass('checked');
})

$(document).on('click', '#SaveChangeBtn', function(){
	$.post('/write_recipe', save_changes(), function(res){
		if(res.success)
			alert("Your recipe is successfully uploaded.");
		else
			alert("Failed to upload your recipe.");
	})
})

$(document).on('click', ".delete", function(){
	$(this).parent().remove();
})

$(document).on('click', ".addLineBtn", function(){
	$('<li><div contenteditable></div><button class="delete">Delete</button></li>').insertBefore($(this).parent());
})

function init(){
	if(!login_state()){
		window.location = "/";
		return;
	}
	$.post('/my_page', {Username: localStorage.getItem("userId")}, function(res){
		console.log(res);
	})
	/*set_recipe_stacks([{title: "Pasta", cost: 10000, time: 5, difficulty: 5, rating: 4.5, img_url: "img/pasta.jpg"},
					   {title: "Pasta", cost: 10000, time: 5, difficulty: 5, rating: 4.5, img_url: "img/pasta.jpg"},
					   {title: "Pasta", cost: 10000, time: 5, difficulty: 5, rating: 4.5, img_url: "img/pasta.jpg"},]);*/
	set_recipe("Pasta", 10000,  5, 5, 4.5, 'img/pasta.jpg', [
		'Heat 1 tbsp olive oil in a non-stick frying pan then add 1 sliced onion and cook on a medium heat until completely softened, around 15 mins, adding a little splash of water if it starts to stick.', 
		'Crush in 1 garlic clove and cook for 2-3 mins more, then add 1 tbsp butter.',
		'Once the butter is foaming a little, add 250g sliced mushrooms and cook for around 5 mins until completely softened.',
		'Season everything well, then tip onto a plate.',
		'Tip 1 tbsp plain flour into a bowl with a big pinch of salt and pepper, then toss 500g sliced fillet steak in the seasoned flour.',
		'Add the steak pieces to the pan, splashing in a little oil if the pan looks dry, and fry for 3-4 mins, until well coloured.',
		'Tip the onions and mushrooms back into the pan. Whisk 150g crème fraîche, 1 tsp English mustard and 100ml beef stock together, then stir into the pan.',
		'Cook over a medium heat for around 5 mins.',
		'Scatter with some chopped parsley, and serve with pappardelle or rice.'],
		["Carrot", "Pork"]);
}

init();