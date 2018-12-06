$(document).on('click', '.close', function(){
    $("#signModal").hide();
    $(".modal-body").find("input:eq(2)").remove();
    $('<div id="sign-up">Sign Up</div>').insertAfter($("#SignUpBtn"));
    $("#SignUpBtn").replaceWith('<button id="SignInBtn">Sign In</button>');
});

$(document).on('click', '#sign-in', function(){
    $("#signModal").show();
});

window.onclick = function(event) {
    if (event.target == $("#signModal")[0]){
        $("#signModal").hide();
        $(".modal-body").find("input:eq(2)").remove();
        $('<div id="sign-up">Sign Up</div>').insertAfter($("#SignUpBtn"));
        $("#SignUpBtn").replaceWith('<button id="SignInBtn">Sign In</button>');
    }
}

function add_ingredient(name){
    var ingre = '<div class="ingredient-card">'+
                    '<img src="img/ingredients/'+name+'.jpg">'+
                    '<div class="footer">'+name+'</div>'+
                '</div>';
    $("#ingredient-tab").append(ingre);
}

function ingredient_fullset(){
    var ingredients = ["Carrot", "Egg", "Beef", "Spinach", "Pork", "Chicken", "Lemon", "Tomato", "Salmon", 
                        "Milk", "Butter", "Rice", "Tofu", "Sausage", "Shrimp", "Spaghetti", "Potato", "Onion", "Honey", 
                        "Garlic", "Chilli", "Beans", "Mushroom", "Cheese"];
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
        return false;
    }else{
        $("#sign-in").hide();
        return true;
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

    if(password == password2){
        if(!name.includes(",")){
            $.post('/create_user', {Username: name, Password: password}, function(res){
                if(res.success){
                    alert("You are signed up successfully.");
                    localStorage.setItem("userId", name);
                    location.reload();
                }
                else
                    alert("Please use another user name.");
            })
        }else
           alert("You cannot use \",\" in your username."); 
    }else{
        alert("Please confirm your password again.");
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