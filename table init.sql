CREATE TABLE USER(
	Username VARCHAR(15) NOT NULL,
	Password CHAR(8),
	PRIMARY KEY(Username)
);

CREATE TABLE RECIPE(
	Title VARCHAR(30) NOT NULL,
	Instruction TEXT(2000),
	Time INT,
	Difficulty INT,
	Total_cost INT,
	Picture_url VARCHAR(1000), 
	Rating FLOAT,
	USER_Username VARCHAR(15) NOT NULL,
	PRIMARY KEY(Title),
	FOREIGN KEY(USER_Username) REFERENCES USER(Username)
);

CREATE TABLE REVIEW(
	Id INT NOT NULL,
	Content TEXT(2000),
	Rating INT,
	USER_Username VARCHAR(15) NOT NULL,
	RECI_Title VARCHAR(30) NOT NULL,
	PRIMARY KEY(Id),
	FOREIGN KEY(USER_Username) REFERENCES USER(Username),
	FOREIGN KEY(RECI_Title) REFERENCES RECIPE(Title) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE INGREDIENT(
	Name VARCHAR(15) NOT NULL,
	Cost INT,
	PRIMARY KEY(Name)
);

CREATE TABLE USES(
	INGR_Name VARCHAR(15) NOT NULL,
	RECI_Title VARCHAR(30) NOT NULL,
	Ingredient_quantity INT,
	PRIMARY KEY(INGR_Name, RECI_Title),
	FOREIGN KEY(INGR_Name) REFERENCES INGREDIENT(Name),
	FOREIGN KEY(RECI_Title) REFERENCES RECIPE(Title) ON DELETE CASCADE ON UPDATE CASCADE
);
