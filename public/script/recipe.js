function add_review(user, rating, text){
	var card =  '<div class="review-card">'+
                    '<div class="header">'+user+' <span class="review-rating"> gave rating: '+rating+'</span></div>'+
                    '<div class="text">'+text+'</div>'+
                '</div>';
	$("#otherreviews").append(card);
}

function set_recipe(title, cost, time, difficulty, rating, img_url, instructions, ingredients){
	var recipe = '<div style="text-align: left">'+
                        '<span class="food-title">'+title+'</span>'+
                        '<span class="food-meta"> Cost: '+cost+' won, Time: '+time+' min, Difficulty: '+difficulty+', Rating: '+rating+'</span>'+
                    '</div>'+
                    '<img class="food-img" src="'+img_url+'">'+
                    '<div id="ingredient-tab"></div>'+
                    '<div class="food-instruction">'+
                        '<div class="instruction-header">Instruction</div>'+
                        '<ol>';
                        	for(var i in instructions){
        recipe +=              '<li>'+instructions[i]+'</li>'
    						}
        recipe +=       '</ol>'+
                    '</div>';
    $(".recipe").html(recipe);
    for(var i in ingredients){
		add_ingredient(ingredients[i]);
	}
}

function get_review(){
	var text = $(".review-text").val();
	var rating = $("input[type=number]").val();
	var user = localStorage.getItem("userId");
	var title = $(".food-title").text();

	return {Content: text, Rating: rating, USER_Username: user, RECI_Title: title};
}

$(document).on('click', "button.redBtn", function(){
	$.post('/write_review', get_review(), function(res){
		add_review(localStorage.getItem("userId"), $("input[type=number]").val(), $(".review-text").val());
		alert("Your review is successfully submitted!");
	})
})

function init(){
	login_state();
	var url = window.location.href.split("/");
	var recipe = decodeURI(url[url.length - 1]);
	$.post('/search_recipe3', {title: recipe}, function(res){
        set_recipe(res[0].Title, res[0].Total_cost, res[0].Time, res[0].Difficulty, res[0].Rating, res[0].Picture_url, res[0].Instruction.split("<NEXT>"), res[0].Ingredients.map(function(ele){return ele.INGR_Name}));
        $.post('/recipe_reviews', {Title: recipe}, function(res){
        	for(var review of res){
        		add_review(review.USER_Username, review.Rating, review.Content);
        	}
        })
    })
}

init()