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

$(document).on('click', '#filter1', function(){
    var filter = filter1();
    if(filter != -1){
        $.post('/search_recipe1', filter1(), function(res){
            for(var i in res)
                add_card(res[i].Title, res[i].Picture_url, res[i].Total_cost, res[i].Time, res[i].Difficulty, res[i].Rating);
        })
    }
})

$(document).on('click', '#filter2', function(){
    var filter = filter2();
    if(filter != -1){
        $.post('/search_recipe2', filter2(), function(res){
            for(var i in res)
                add_card(res[i].Title, res[i].Picture_url, res[i].Total_cost, res[i].Time, res[i].Difficulty, res[i].Rating);
        })
    }
})

function filter1(){
    var min_cost = $(".side-content:eq(0) > input:eq(0)").val();
    var max_cost = $(".side-content:eq(0) > input:eq(1)").val();
    var min_time = $(".side-content:eq(1) > input:eq(0)").val();
    var max_time = $(".side-content:eq(1) > input:eq(1)").val();
    var min_difficulty = $(".side-content:eq(2) > input:eq(0)").val();
    var max_difficulty = $(".side-content:eq(2) > input:eq(1)").val();
    var min_rating = $(".side-content:eq(3) > input:eq(0)").val();
    var max_rating = $(".side-content:eq(3) > input:eq(1)").val();
    if(min_cost.length && max_cost.length && min_time.length && max_time.length &&
        min_difficulty.length && max_difficulty.length && min_rating.length && max_rating.length){
        return {min_difficulty: min_difficulty, max_difficulty: min_difficulty, 
            min_cost: min_cost, max_cost: max_cost, 
            min_time: min_time, max_time: max_time, 
            min_rating: min_rating, max_rating: max_rating};
    }
    alert("Please fill out all the input boxes.");
    return -1;
}

function filter2(){
    var selection = extract_selected_ingredients();
    if(selection.length == 3)
        return {Ingredient1: selection[0], Ingredient2: selection[1], Ingredient3: selection[2]};
    else{
        alert("Please select exactly three ingredients.");
        return -1;
    }
}

function init(){
	login_state();
    $.post('/search_recipe1', filter1(), function(res){
        for(var i in res){
            add_card(res[i].Title, res[i].Picture_url, res[i].Total_cost, res[i].Time, res[i].Difficulty, res[i].Rating);
        } 
    })
    ingredient_fullset();
}

init();

