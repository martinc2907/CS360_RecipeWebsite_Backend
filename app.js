const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

//create connection
const db = mysql.createConnection({
	host : 'jihye-mysql.cmlpaiveb1r5.us-east-2.rds.amazonaws.com',
	user : 'jihye',
	password : 'makefood',
	database: 'recipe'
});

//connect to mysql
/*db.connect((err) => {
	if(err){
		throw err;
	}
	console.log("mysql connection");
});*/

//set up app
const app = express();
app.use(bodyParser.json());	//json object in req.body
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
	secret: 'alfalw;l12#!@312#!',
	resave: false,
	saveUninitialized: true
}));

/*------- Frontend pages ------*/
app.get('/', (req, res) => {
	res.render('home');
});

app.get('/myrecipes', (req, res) => {
	res.render('myrecipes');
});

app.get('/:recipe', (req, res) => {
	res.render('recipe');
});

/*----- Supported queries -----*/
//Create user
app.post('/create_user', (req,res) =>{
	console.log(req.body);

	var Username = db.escape(req.body.Username);	//escape to keep the quote.
	var Password = db.escape(req.body.Password);
	var sql = `INSERT INTO USER (Username, Password) VALUES (?, ?)`;
	db.query(sql, [Username.slice(1, -1), Password.slice(-1, 1)], (err,result)=>{
		if(err){
			console.log(err);
			res.send({success: false});//choose another combination
			return;
		}
		res.send({success:true});
	});
});

// Sign in
app.post('/sign_in', (req, res) =>{
	console.log(req.body);

	var Username = db.escape(req.body.Username);
	var Password = db.escape(req.body.Password);
	var sql = `SELECT Password FROM USER WHERE Username=?`;
	db.query(sql, [Username.slice(1,-1)], (err, result)=>{
		if(err){
			console.log(err);
			res.send({success: false});
			return;
		}
		console.log(typeof(Password), typeof(result[0].Password));
		if(Password.slice(1, -1) == result[0].Password) {
			res.send({success: true});
			return;
		}
		else {
			res.send({success: false});
		}
	})
})


//Write Recipe
app.post('/write_recipe', (req,res)=>{
	console.log(req.body);

	var Title = db.escape(req.body.Title);
	var Instruction = db.escape(req.body.Instruction);
	var Time = req.body.Time;
	var Difficulty = req.body.Difficulty;
	var Picture_url = db.escape(req.body.Picture_url);
	var Ingredients = req.body.Ingredients;	//array of ingredient names
	var Ingredients_quantity = req.body.Ingredients_quantity; //array of ingredient quantities
	var User = db.escape(req.body.User);
	var Total_cost = 0;
	var Rating = 0;

	//start transaction
	var sql_start = `START TRANSACTION`;
	var sql_rollback = `ROLLBACK`;
	var sql_commit = `COMMIT`;
	db.query(sql_start, (err,result)=>{
		if(err){
			console.log(err);
			res.send({success:false});
			return;
		}
	});
	console.log(Instruction);
	Instruction = Instruction.replace(", ","<NEXT>");
	
	//must add recipe first(with total cost 0)
	var sql_insert2 = `INSERT INTO RECIPE 
						VALUES (?,?,?,?,?,?,?,?)`;
	db.query(sql_insert2, [Title.slice(1,-1), Instruction.slice(1,-1), Time, Difficulty, Total_cost, Picture_url.slice(1,-1), User.slice(1,-1), Rating], (err,result)=>{
		if(err){
			console.log(err);
			//SHOULD ROLL BACK. do start/commit/end transaction?
			db.query(sql_rollback, (err,result)=>{});
			res.send({success:false});
			return;
		}
	});


	//add to USES
	var length = Ingredients.length;
	for(var i = 0; i < length; i++){
		var sql_insert = `INSERT INTO USES VALUES (?, ?, ?)`;
		db.query(sql_insert, [db.escape(Ingredients[i]).slice(1,-1), Title.slice(1,-1), Ingredients_quantity[i]], (err,result)=>{
			if(err){
				console.log(err);
				//SHOULD ROLL BACK. do start/commit/end transaction?
				db.query(sql_rollback, (err,result)=>{});
				res.send({success:false});
				return;
			}
		});
	}

	//calculate total cost
	var sql_sum = `SELECT SUM(I.Cost*U.Ingredient_quantity) AS SUM
					FROM INGREDIENT AS I,USES AS U 
					WHERE U.RECI_Title = ? AND U.INGR_Name = I.Name`;
	db.query(sql_sum, [Title.slice(1,-1)], (err,result)=>{
		if(err){
			console.log(err);
			//SHOULD ROLL BACK. do start/commit/end transaction?
			db.query(sql_rollback, (err,result)=>{});
			res.send({success:false});
			return;
		}
		console.log(result);
		console.log(result[0].SUM);
		Total_cost = result[0].SUM;
		console.log(Total_cost);


		//Update recipe for total cost- do inside of callback for no async problem.
		var sql_update = `UPDATE RECIPE
						SET Total_cost = ?
						WHERE Title = ?`;
		db.query(sql_update, [Total_cost, Title.slice(1,-1)], (err,result)=>{
			if(err){
				console.log(err);
				db.query(sql_rollback, (err,result)=>{});
				res.send({success:false});
				return;
			}
			//everything success
			console.log("Recipe written");
			db.query(sql_commit, (err,result)=>{});
			res.send({success:true});
		});
	});
});


//write review
app.post('/write_review', (req,res)=>{
	console.log(req.body);

	var Id = req.body.Id;
	var Content = db.escape(req.body.Content);
	var Rating = req.body.Rating;
	var USER_Username = db.escape(req.body.USER_Username);
	var RECI_Title = db.escape(req.body.RECI_Title);

	var sql = `INSERT INTO REVIEW 
				VALUES (?, ?, ?, ?, ?)`
	db.query(sql, [Id, Content.slice(1,-1), Rating, USER_Username.slice(1,-1), RECI_Title.slice(1,-1)], (err,result)=>{
		if(err){
			console.log(err);
			res.send({success:false});
			return;
		}
		console.log("Review written");
		res.send({success:true});
	});
});


//search for recipe method 1
app.get("/search_recipe1", (req,res)=>{
	console.log(req.body);

	var min_difficulty = req.body.min_difficulty;
	var max_difficulty = req.body.max_difficulty;
	var min_cost = req.body.min_cost;
	var max_cost = req.body.max_cost;
	var min_time = req.body.min_time;
	var max_time = req.body.max_time;
	var min_rating = req.body.min_rating;
	var max_rating = req.body.max_rating;

	var sql = `SELECT *
				FROM RECIPE
				WHERE (Difficulty BETWEEN ? AND ?) AND 
						(Total_cost BETWEEN ? AND ?) AND
						(Total_cost BETWEEN ? AND ?) AND
						(Time BETWEEN ? AND ?))`
	db.query(sql, [min_difficulty, max_difficulty, min_cost, max_cost, min_rating, max_rating, min_time, max_time], (err,result)=>{
		if(err){
			console.log(err);
			res.send({success:false});
			return;
		}
		//create json array
		var array = [];
		result.map(function(item){
			array.push({
				"Title": item.Title,
				"Instruction": item.Instruction,
				"Time": item.Time,
				"Difficulty": item.Difficulty,
				"Total_cost": item.Total_cost,
				"Picture_url": item.Picture_url,
				"Rating": item.Rating,
				"USER_Username": item.USER_Username
			});
		});
		console.log(array);
		console.log("Recipes retrieved");
		res.send(array);
	});
});


//search for recipe method 2(3 ingredients)
app.get("/search_recipe2", (req,res)=>{
	console.log(req.body);

	var Ingredient1 = db.escape(req.body.Ingredient1);
	var Ingredient2 = db.escape(req.body.Ingredient2);
	var Ingredient3 = db.escape(req.body.Ingredient3);

	var sql = `SELECT *
				FROM RECIPE
				WHERE Title IN (SELECT RECI_Title
								FROM USES
								WHERE INGR_Name = ?)
								AND
					  Title IN (SELECT RECI_Title
								FROM USES
								WHERE INGR_Name = ?)
								AND
					  Title IN (SELECT RECI_Title
								FROM USES
								WHERE INGR_Name = ?)
				`
	db.query(sql, [Ingredient1.slice(1,-1), Ingredient2.slice(1,-1), Ingredient3.slice(1,-1)], (err,result)=>{
		if(err){
			console.log(err);
			res.send({"success": false});
			return;
		}
		console.log(result);
		//create json array
		var array = [];
		result.map(function(item){
			array.push({
				"Title": item.Title,
				"Instruction": item.Instruction,
				"Time": item.Time,
				"Difficulty": item.Difficulty,
				"Total_cost": item.Total_cost,
				"Picture_url": item.Picture_url,
				"USER_Username": item.USER_Username
			});
		});
		console.log(array);
		console.log("Recipes retrieved");
		res.send(array);
	});
});

// search recipe with name
app.get("/search_recipe3", (req,res)=>{
	console.log(req.body);

	var title = db.escape(req.body.title);

	var sql = `SELECT *
				FROM RECIPE
				WHERE Title = ?
				`
	db.query(sql, [title.slice(1,-1)], (err,result)=>{
		if(err){
			console.log(err);
			res.send({"success": false});
			return;
		}
		console.log(result);
		//create json array
		var array = [];
		result.map(function(item){
			array.push({
				"Title": item.Title,
				"Instruction": item.Instruction,
				"Time": item.Time,
				"Difficulty": item.Difficulty,
				"Total_cost": item.Total_cost,
				"Picture_url": item.Picture_url,
				"USER_Username": item.USER_Username
			});
		});
		console.log(array);
		console.log("Recipes retrieved");
		res.send(array);
	});
});

//update review(Id, Content, Rating)
app.post("/update_review", (req,res)=>{
	console.log(req.body);

	var Id = req.body.Id;
	var Content = db.escape(req.body.Content);
	var Rating = req.body.Rating;

	var sql = `UPDATE REVIEW SET Content = ?, Rating = ? WHERE Id = ?`;
	db.query(sql, [Content.slice(1,-1), Rating, Id], (err,result)=>{
		if(err){
			console.log(err);
			res.send({"success":false});
			return;
		}
		console.log("updated successful");
		res.send({"success":true});
	});
});

//delete recipe(Title)
app.post("/delete_recipe", (req,res)=>{
	console.log(req.body);

	var Title = db.escape(req.body.Title);

	var sql = `DELETE FROM RECIPE
				WHERE Title = ?
				`;
	db.query(sql, [Title.slice(1,-1)], (err,result)=>{
		if(err){
			console.log(err);
			res.send({"success":false});
			return;
		}
		console.log("delete successful");
		res.send({"success":true});
	});
});

/*------ Other stuff -----*/
app.listen('3000', ()=> {
	console.log("server started on 3000");
});
