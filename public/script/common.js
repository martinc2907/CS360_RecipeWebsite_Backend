$(document).on('click', '.close', function(){
	$("#signModal").hide();
});

$(document).on('click', '#sign-in', function(){
	$("#signModal").show();
	console.log("!");
});

window.onclick = function(event) {
    if (event.target == $("#signModal")[0])
        $("#signModal").hide();
}

function add_ingredient(name){
	var ingre = '<div class="ingredient-card">'+
                    '<img src="img/ingredients/'+name+'.jpg">'+
                    '<div class="footer">'+name+'</div>'+
                '</div>';
    $("#ingredient-tab").append(ingre);
}

function ingredient_fullset(){
    var ingredients = ["Carrot", "Egg", "Beef", "Spinach", "Pork", "Chicken", "Lemon", "Onion", "Tomato", "Salmon", 
                        "Milk", "Butter", "Rice"];
    for(var i in ingredients){
        add_ingredient(ingredients[i]);
    }
}

function check_ingredient(title){
    $(".ingredient-card").each(function(idx, value){
        if($(this).find(".footer").text() == title)
            $(this).addClass("checked");
    })
}

function extract_selected_ingredients(){
    var selected = [];
    $(".ingredient-card").each(function(idx, value){
        if($(this).hasClass("checked"))
            selected.push($(this).find(".footer").text())
    })
    return selected;
}

function extract_instructions(){
    var instructions = [];
    $(".food-instruction > ol > li").each(function(idx, value){
        if($(this).find("div").text().trim().length > 0)
            instructions.push($(this).find("div").text().trim());
    })
    return instructions;
}

function login_state(){
    if(!localStorage.getItem("userId")){
        console.log("not logged in");
        $("#my-recipes").hide();
        $("#sign-out").hide();
    }else{
        $("#sign-in").hide();
        $("#sign-up").hide();
    }
}

$(document).on('click', "#sign-out", function(){
    localStorage.removeItem("userId");
    location.reload();
})

$(document).on('click', "#my-recipes", function(){
    window.location = "/myrecipes";
})

$(document).on('click', ".page-title", function(){
    window.location = "/";
})

$(document).on('click', "#SignInBtn", function(){
    var name = $(".modal-body").find("input:eq(0)").val();
    var password = $(".modal-body").find("input:eq(1)").val();;

    localStorage.setItem("userId", name);
    location.reload();
})