const express = require('express');
const router = express.Router();

const todo_controller = require('../controller/todo.controller');

router.get('/', todo_controller.main);
router.post('/create', todo_controller.create);
router.post('/show', todo_controller.show);
router.post('/update_todo', todo_controller.update_todo);
router.get('/login', todo_controller.login);
router.post('/login', todo_controller.login_validate);
router.get('/logout', todo_controller.logout);
router.get('/register', todo_controller.signup);
router.post('/register', todo_controller.signup_process);
router.post('/delete', todo_controller.delete_todo);
router.get('*', todo_controller.main);

module.exports = router;