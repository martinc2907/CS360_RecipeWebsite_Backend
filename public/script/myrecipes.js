function init(){
	if(!localStorage.getItem("userId")){
		console.log("not logged in");
		$(".menu-btn").eq(0).hide();
	}
}

init()