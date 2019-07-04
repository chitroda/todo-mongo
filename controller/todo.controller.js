const model = require('../model/todo.model');
const rand = require('rand-token');
const crypto = require('crypto');

exports.main = function(req, res){
    if(req.session.uid){
        res.render('index.ejs', {
            current_url: '/',
            name: req.session.uname
        });
    }
    else{
        res.redirect('/login');
    }
};

exports.create = function(req, res){
    let date = new Date().toJSON().split('T')[0];
    let todo_name = req.body.todo;
    let todo_token = rand.generate(4);
    if(todo_name !== ''){
        model.updateOne({_id: req.session.uid}, {$push: {user_todo:  {
            todo_id : todo_token,
            todo_name : todo_name,
            old_todo : 0,
            time_stamp : date
        }}}, function(err, doc){
            if(err) throw err;
            let json =  {"success":"Inserted successfully"}; 
            return res.send(json);
        });
    }
    else{
        let json =  {"error":"Write some todo first!"};
        return res.send(json);
    }
};

exports.show = function(req, res){
    model.find({'_id': req.session.uid}).exec(function(err, data){
        if(err) throw err;
        return res.json(data[0]['user_todo']);
    });
};

exports.update_todo = function(req, res){
    let response = res;
    let todo_id = req.body.todo_id;
    model.findOne({'_id': req.session.uid, 'user_todo.todo_id': todo_id}, {'user_todo.$': 1}).exec(function(err, data){
        if(err) throw err;

        if(data.user_todo['0']['old_todo']){
			model.updateOne({'_id': req.session.uid, 'user_todo': {$elemMatch: {'todo_id': todo_id}}}, {$set: {"user_todo.$.old_todo": 0}}, function(err, res){
            //model.updateOne({'_id': req.session.uid}, {$set: {"user_todo.$[elem].old_todo": 0}}, {arrayFilters: [{"elem.todo_id": todo_id}], multi: false}, function(err, res){
                if(err) throw err;
                return response.send(false);
            });
        }
        else{
			model.updateOne({'_id': req.session.uid, 'user_todo': {$elemMatch: {'todo_id': todo_id}}}, {$set: {"user_todo.$.old_todo": 1}}, function(err, res){
            //model.updateOne({'_id': req.session.uid}, {$set: {"user_todo.$[elem].old_todo": 1}}, {arrayFilters: [{"elem.todo_id": todo_id}], multi: false}, function(err, res){
                if(err) throw err;
                return response.send(true);
            });
        }
    });
};

exports.login = function(req, res){
    if(req.session.uid){
        req.session.uid = false;
        req.session.uname = false;
        res.redirect('/login');
    }
    res.render('login.ejs', {
        error: '',
        email: '',
        current_url: '/login'
    });
};

exports.login_validate = function(req, res){
    let email = req.body.email;
    let pwd = req.body.password;
    let inserted_pwd = crypto.createHash('md5').update(pwd).digest('base64');
    if(email === '' && pwd !== ''){
        res.render('login.ejs', {
            current_url: '/login',
            error: 'Email is mandatory to login!',
            email: ''
        });
    }
    else if(pwd === '' && email !== ''){
        res.render('login.ejs', {
            current_url: '/login',
            error: 'Password can not be empty!',
            email: email
        });
    }
    else if(pwd === '' && email === ''){
        res.render('login.ejs', {
            current_url: '/login',
            error: 'Email & Password are mandatory to login!',
            email: ''
        });
    }
    else{
        model.find({email: email, pwd: inserted_pwd},{user_todo: 0}).exec(function(err,data){
            if(err) throw err;
            //console.log(data.length);
            //console.log(data);
            if(data.length > 0){
                req.session.uid = data[0]['_id'];
                req.session.uname = data[0]['name'];
                res.redirect('/');
            }
            else{
                res.render('login.ejs', {
                    current_url: '/login',
                    error: 'Please enter valid email or password',
                    email: email
                });
            }
        });
    }
};

exports.logout = function(req, res){
    if(req.session.uid){
        req.session.uid = false;
        req.session.uname = false;
        res.redirect('/login');
    }
    else{
        res.redirect('/login');
    }
};

exports.signup = function(req,res){
    if(req.session.uid){
        req.session.uid = false;
        req.session.uname = false;
        res.redirect('/register');
    }
    res.render('signup.ejs', {
        current_url: '/register',
        error: ''
    });
};

exports.signup_process = function(req,res){
    let name = req.body.name;
    let email = req.body.email;
    let pwd = req.body.password;
    let new_pwd = crypto.createHash('md5').update(pwd).digest('base64');
    let date = new Date().toJSON().split('T')[0];
    if(name === '' || email === '' || pwd === ''){
        res.render('signup.ejs', {
            current_url: '/register',
            error: 'Please fill all necessary field'
        });
        return;
    }
    else{
        var user_fresh = new model({
            _id: rand.generate(10),
            name: name,
            email: email,
            pwd: new_pwd,
            user_todo: []
        });
        user_fresh.save();
        res.redirect('/login');
    }
};

exports.delete_todo = function(req,res){
	var todo_id = req.body.id;
	model.updateOne({}, {$pull: {user_todo: {todo_id: todo_id}}}, {mutli: false}, function(err, doc){
		if(err) throw err;
		return res.send(true);
	});
};