function add_review(user, rating, text){
	var card =  '<div class="review-card">'+
                    '<div class="header">'+user+' <span class="review-rating"> gave rating: '+rating+'</span></div>'+
                    '<div class="text">'+text+'</div>'+
                '</div>';
	$("#otherreviews").append(card);
}

function set_recipe(title, cost, time, difficulty, rating, img_url, instructions){
	var recipe = '<div style="text-align: left">'+
                        '<span class="food-title">'+title+'</span>'+
                        '<span class="food-meta"> Cost: '+cost+' won, Time: '+time+' min, Difficulty: '+difficulty+', Rating: '+rating+'</span>'+
                    '</div>'+
                    '<img class="food-img" src="'+img_url+'">'+
                    '<div class="food-instruction">'+
                        '<div class="instruction-header">Instruction</div>'+
                        '<ol>';
                        	for(var i in instructions){
        recipe +=              '<li>'+instructions[i]+'</li>'
    						}
        recipe +=       '</ol>'+
                    '</div>';
    $(".recipe").append(recipe);
}

function init(){
	if(!localStorage.getItem("userId")){
		console.log("not logged in");
		$(".menu-btn").eq(0).hide();
	}
	for(var i = 0; i < 10; i++){
		add_review("DBmaster", 4.5, "This was really good. This was really good. This was really good.")
	}
	set_recipe("Pasta", 10000,  5, 5, 4.5, 'pasta.jpg', [
		'Heat 1 tbsp olive oil in a non-stick frying pan then add 1 sliced onion and cook on a medium heat until completely softened, around 15 mins, adding a little splash of water if it starts to stick.', 
		'Crush in 1 garlic clove and cook for 2-3 mins more, then add 1 tbsp butter.',
		'Once the butter is foaming a little, add 250g sliced mushrooms and cook for around 5 mins until completely softened.',
		'Season everything well, then tip onto a plate.',
		'Tip 1 tbsp plain flour into a bowl with a big pinch of salt and pepper, then toss 500g sliced fillet steak in the seasoned flour.',
		'Add the steak pieces to the pan, splashing in a little oil if the pan looks dry, and fry for 3-4 mins, until well coloured.',
		'Tip the onions and mushrooms back into the pan. Whisk 150g crème fraîche, 1 tsp English mustard and 100ml beef stock together, then stir into the pan.',
		'Cook over a medium heat for around 5 mins.',
		'Scatter with some chopped parsley, and serve with pappardelle or rice.']);
}

init()