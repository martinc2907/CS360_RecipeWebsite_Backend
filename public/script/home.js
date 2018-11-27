function add_card(title, img_url, cost, time, difficulty, rating){
	var card = '<div class="card">'+
                    '<div class="title">'+title+'</div>'+
                    '<img src="'+img_url+'"/>'+
                    '<div class="footer">'+
                        '<div class="cost">'+cost+'</div>'+
                        '<div class="time">'+time+'</div>'+
                        '<div class="difficulty">'+difficulty+'</div>'+
                        '<div class="rating">'+rating+'</div>'+
                    '</div>'+
                '</div>';
	$(".main-tab").append(card);
}

function add_ingredient(name){
	var ingre = '<div class="ingredient-card">'+
                    '<img src="img/ingredients/'+name+'.jpg">'+
                    '<div class="footer">'+name+'</div>'+
                '</div>';
    $("#ingredient-tab").append(ingre);
}

function init(){
	if(!localStorage.getItem("userId")){
		console.log("not logged in");
		$(".menu-btn").eq(0).hide();
	}
	for(var i=0; i < 12; i++){
		add_card("Pasta", "./img/pasta.jpg", 10000, 5, 5, 3.5);
		add_ingredient("Carrot");
	}
}

init()