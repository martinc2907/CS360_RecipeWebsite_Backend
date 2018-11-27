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

$(document).on('click', '.card', function(){
    var name = $(this).find(".title").text();
    window.location.href = "./"+name;
})

$(document).on('click', '.ingredient-card', function(){
    if($(this).hasClass("checked"))
        $(this).removeClass('checked');
    else
        $(this).addClass('checked');
})

function init(){
	login_state();
	for(var i=0; i < 12; i++){
		add_card("Pasta", "./img/pasta.jpg", 10000, 5, 5, 3.5);
	}
	ingredient_fullset();
}

init()