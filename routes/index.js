var express = require('express');
var multer = require('multer');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');
var estadisticaController = require('../controllers/estadistica_controller');
var favouritesController = require('../controllers/favourites_controller');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});
// Pagina de creditos
router.get('/author', function(req, res) {
  res.render('author', { errors: []});
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizId
router.param('commentId', commentController.load); // autoload :commentId
router.param('userId', userController.load);  //autoload :userId
router.param('favouritesId', favouritesController.load); //autoload favourites

// Definición de rutas de sesion
router.get('/login', sessionController.new); //formulario login
router.post('/login', sessionController.create); //crear sesión
router.get('/logout', sessionController.destroy); //destruir sesión

// Definicion de rutas de cuenta
router.get('/user', userController.new); //formulario sign un
router.post('/user', userController.create);  // formulario usuasio
router.get('/user/:userId(\\d+)/edit', sessionController.loginRequired, userController.ownershipRequired, userController.edit);
router.put('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.update);
router.delete('/user/:userId(\\d+)',sessionController.loginRequired, userController.ownershipRequired, userController.destroy);
router.get('/user/:userId(\\d+)/quizes', quizController.index); // ver las preguntas de cada usuario

//Definicion de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
// Ruta para la estadistica /GET /quizes/statistics
router.get('/quizes/statistics', estadisticaController.estadistica);
//Rutas de /quizes con autorización
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create',sessionController.loginRequired, multer({dest: './public/media/'}), quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',sessionController.loginRequired, userController.ownershipRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',sessionController.loginRequired, userController.ownershipRequired, multer({dest: './public/media/'}), quizController.update);
router.delete('/quizes/:quizId(\\d+)',sessionController.loginRequired, userController.ownershipRequired, quizController.destroy);
// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
	                                          sessionController.loginRequired, userController.ownershipRequired, commentController.publish);


// Definicion de rutas de favoritod
router.get('/user/:userId/favourites', favouritesController.index);
router.put('/user/:userId/favourites/:quizId', sessionController.loginRequired, favouritesController.add);
router.delete('/user/:userId/favourites/:quizId', sessionController.loginRequired, favouritesController.destroy);


module.exports = router;
