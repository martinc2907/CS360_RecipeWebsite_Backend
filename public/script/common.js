$(document).on('click', '.close', function(){
	$("#signModal").hide();
});

$(document).on('click', '#sign-in', function(){
	$("#signModal").show();
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
    }
}

$(document).on('click', "#sign-out", function(){
    localStorage.removeItem("userId");
    location.reload();
})

$(document).on('click', "#sign-up", function(){
    if($("#SignUpBtn").length == 0 ){
        $('<input type="password" placeholder="Confirm Password"></input>').insertAfter($(this).parent().find("input:eq(1)"));
        $(this).parent().find("#SignInBtn").replaceWith('<button id="SignUpBtn">Sign Up</button>');
        $(this).remove();
    }
})


$(document).on('click', "#my-recipes", function(){
    window.location = "/myrecipes";
})

$(document).on('click', ".page-title", function(){
    window.location = "/";
})

$(document).on('click', "#SignUpBtn", function(){
    var name = $(".modal-body").find("input:eq(0)").val();
    var password = $(".modal-body").find("input:eq(1)").val();
    var password2 = $(".modal-body").find("input:eq(2)").val();

    if(password != password2){
        alert("Please confirm your password again.");
        return;
    }else{
        $.post('/create_user', {Username: name, Password: password}, function(res){
            if(res.success)
                alert("You are signed up successfully.");
            else
                alert("Please use another user name.");
        })
    }
})

$(document).on('click', "#SignInBtn", function(){
    var name = $(".modal-body").find("input:eq(0)").val();
    var password = $(".modal-body").find("input:eq(1)").val();

    $.post('/sign_in', {Username: name, Password: password}, function(res){
        if(res.success){
            localStorage.setItem("userId", name);
            location.reload();
        }else
            alert("Please check if you typed correct username and password.");
    })
})