var express = require('express');
var router = express.Router();
var models = require('../db/models/index');
var helperware = require('./helperware');

/* GET users listing. */
router.get('/', helperware.indexRedirect, helperware.fetchFavs, function(req, res, next) {
    res.render('user/favs', {
        user: req.user.dataValues,
        favs: res.locals.favs,
        onTrains: false,
        title: 'subwaze profile'
    });
    console.log(favs)
});

router.get('/trains', function(req, res, next) {
    models.Train.findAll({}).then((trains) => {
        res.render('trainLines', {
            title: 'Select A Train',
            trains: trains,
            user: req.user.dataValues,
            onTrains: true,
            title: 'subwaze trains'
        });
    })
});

router.get('/trains/:id', helperware.indexRedirect, helperware.fetchComments, helperware.fetchFavsArray, function(req, res, next) {
    models.Train.findById(req.params.id).then((trains) => {
        res.render('trainInfo', {
            title: 'Subwaze | Line',
            trains: trains,
            comments: res.locals.comments,
            user: req.user.dataValues,
            favsArr: res.locals.favsArray,
            onTrains: false,
            title: 'subwaze trains'
        });
    })
});

router.post('/trains/:id/comment', function(req, res, next) {
    models.Comment.create({
        user_id: req.user.dataValues.id,
        train_id: req.params.id,
        comment: req.body.comment,
    }).then(function() {
        res.redirect(`/trains/${req.params.id}`)
    });
});

router.delete('/:id/comment/:cid/delete', function(req, res, next) {
    // delete from comments where comment.id = :cid && train_id=:id && user_id = req.user
    models.Comment.destroy({
        where: { id: req.params.cid, train_id: req.params.id, user_id: req.user.dataValues.id }
    }).then(function() {
        res.redirect(`/trains/${req.params.id}`)
    });
});

router.put('/:id/comment/:cid/edit', function(req, res, next) {
    // update comments where comment.id = :cid && train_id=:id && user_id = req.user
    console.log(`workplease ${req.body.comment}`);
    models.Comment.update({
        comment: req.body.comment
    }, { where: { id: req.params.cid } }).then(function() {
        res.redirect(`/trains/${req.params.id}`)
    });
});

router.post('/favorites/:id', function(req, res, next) {
    models.Favorite.create({
        user_id: req.user.dataValues.id,
        train_id: req.params.id
    }).then(function() {
        res.redirect(`/trains/${req.params.id}`)
    });
});

router.delete('/delete/:id', function(req, res, next) {
    models.Favorite.destroy({
        where: { train_id: req.params.id }
    }).then(function() {
        res.redirect('/user');
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;