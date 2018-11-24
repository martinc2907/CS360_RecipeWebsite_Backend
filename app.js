const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

//create connection
const db = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'password',
	database: 'recipe'
});

//connect to mysql
db.connect((err) => {
	if(err){
		throw err;
	}
	console.log("mysql connection");
});

//set up app
const app = express();
app.use(bodyParser.json());	//json object in req.body



/*----- Supported queries -----*/
//Create user
app.post('/create_user', (req,res) =>{
	console.log(req.body);

	var Username = db.escape(req.body.Username);	//escape to keep the quote.
	var Password = db.escape(req.body.Password);
	var sql = `INSERT INTO USER (Username, Password) VALUES (${Username}, ${Password})`;
	db.query(sql, (err,result)=>{
		if(err){
			console.log(err);
			res.send({success: false});//choose another combination
			return;
		}
		res.send({success:true});
	});
});


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

	//must add recipe first(with total cost 0)
	var sql_insert2 = `INSERT INTO RECIPE 
						VALUES (${Title}, ${Instruction},${Time},${Difficulty},${Total_cost},${Picture_url},${User})`;
	db.query(sql_insert2, (err,result)=>{
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
		var sql_insert = `INSERT INTO USES VALUES (${db.escape(Ingredients[i])}, ${Title},${Ingredients_quantity[i]})`;
		db.query(sql_insert, (err,result)=>{
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
					WHERE U.RECI_Title = ${Title} AND U.INGR_Name = I.Name`;
	db.query(sql_sum, (err,result)=>{
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
						SET Total_cost = ${Total_cost}
						WHERE Title = ${Title}`;
		db.query(sql_update, (err,result)=>{
			if(err){
				console.log(err);
				db.query(sql_rollback, (err,result)=>{});
				res.send({success:false});
				return;
			}
			//everything success
			db.query(sql_commit, (err,result)=>{});
			res.send({success:true});
		});
	});
	
});





/*------ Other stuff -----*/
//create db
app.get('/createdb',(req,res) =>{
	let sql = 'CREATE DATABASE nodemysql';
	db.query(sql, (err,result) =>{
		if(err) throw err;
		console.log(res);
		res.send('database created');
	});
});

//create table
app.get('/create',()=>{
	let sql = 'CREATE TABLE ' 
});


app.listen('3000', ()=> {
	console.log("server started on 3000");
});