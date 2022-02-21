const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        //git all join with user data
        const blogData = await blog.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        //Serialeize data so template can read
        const blogs = blogData.map((bloq) => blog.get({ plain: true }));

        if (req.session.logged_in) {
            const userData = await User.findByPk(req.session.user_id, {
                attributes: { exclude: ['password'] },
                include: [{ model: Blog }],
            });

            const user = userData.get({ plain: true });

            //serialixed data and session template
            res.render('homepage', {
                ...user,
                blogs,
                logged_in: true
            });

        } else {
            // pass serialized data
            res.render('homepage', {
                blogs,
                logged_in: req.session.logged_in
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ['name'],
                    },
                },
            ],
        });

        const blog = blogData.get({ plain: true });
        console.log(blog);
        res.render('blog', {
            ...blog,
            logged_in: req.session.logged_in,
            disable_edit: (req.session.user_id !== blog.user_id),
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// prevent route access
router.get('/profile', withAuth, async (req, res) => {
    try {
        //find user from id
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Blog }],
        });

        const user = userData.get({ plain: true });

        res.render('profile', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    //if logged in redirect the request
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }

    res.render('login');
});

module.exports = router;