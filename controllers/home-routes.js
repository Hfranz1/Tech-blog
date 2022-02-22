const sequelize = require('../config/connection');
const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    this.post.findAll({

        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],

        include: [{
            module: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        },
        {
            module: User,
            attributes: ['username']
        }
        ]
    })

        .then(dbPostData => {
            const post = dbPostData.map(post => post.get({ plain: true }));
            res.render('homepage', { post, loggedIn: req.session.loggedIn });
        })

        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');

});

router.get('/signup', (req, res) => {
    res.render('sightup');
});

router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [{
            module: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        },
        {
            model: User,
            attributes: ['username']
        }
        ]
    })

        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            const post = dbPostData.get({ plain: true });
            console.log(post);
            res.render('single-post', { post, loggedIn: req.session.loggedIn });

        })

        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/posts-comments', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [{
            module: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        },
        {
            model: User,
            attributes: ['ussername']
        }
        ]
    })

        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            const post = dbPostData.get({ plain: true });

            res.render('posts-comments', { post, loggedIn: req.session.loggedIn });
        })

        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
