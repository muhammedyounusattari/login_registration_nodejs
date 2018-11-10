
var express = require('express');

var db = require('./database-details.js');
var app = express();
app.use(express.static(__dirname + '/'));
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
app.engine('html', require('ejs').renderFile);

/*app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extend:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname); */

//mysql connection
/*var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mysql@5039",
    database: "sys"
});
*/


app.route('/').get(function(request,response){
	response.render(__dirname+'/login.html',{message:''});
})

app.post('/validate',urlencodedParser,function(request,response){
	
	var sql ="select *From registration where username=? and password =? ";
	db.con.query(sql,[request.body.username,request.body.password],
			function(err,result,fields){
	
	if(JSON.stringify(result).length>2){
		response.write('<h1>Valid user <a float="right" href="userlist">UserList</a></h1>');
	}else{
		response.render(__dirname+'/login.html',{message:'invalid username/password'});
	}			
});

})

app.route('/registration').get(function(request,response){
	response.render(__dirname+'/register.html');
})

app.post('/submission',urlencodedParser,function(request,response){
	
	var sql ="insert into registration(email,username,password,confpassword) values(?,?,?,?)";

	db.con.query(sql,[request.body.email,request.body.username,request.body.password,request.body.confpassword],
		function(error,result,fields){
			console.log('data inserted successfully');
			
		});
	response.render(__dirname+'/login.html',{message:'data inserted successfully,please login'});
})


app.route('/userList').get(function(request,response){
	var sql ="select *From registration";

	db.con.query(sql,function(err,result,fields){
		console.log(JSON.parse(JSON.stringify(result)));
		response.render(__dirname+"/list.html",{data:JSON.stringify(result)})
	})
})

app.listen('3000');
