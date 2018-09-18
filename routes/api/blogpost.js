const express = require('express');
// ProfileDB model
const ProfileDB = require('../../models/Profile');
const User = require('../../models/User');
const passport = require('passport');
//routing 
const router = express.Router();

//validation
const validateBlogPostInput = require('../../validation/blogpost');


// public GET blogs. 
// access publically
router.get('/', (req, res) => { 
  ProfileDB.find()
    .sort({ created_at: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});


// route POST api/blogpost
// access Private mode
router.post(
    '/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
    const { errors, isValid } = validateBlogPostInput(req.body);

    // check Validation
    if (!isValid) {
      // If any errors occer, send 400 with errors object
      return res.status(400).json(errors);
    }     

    const blogPost = new ProfileDB({
      title: req.body.title,
      topics: req.body.topics,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      user: req.user.id
    });

    blogPost.save().then(blogpost => res.json(blogpost));
})

// route PUT api/blogpost/:id(edit)
// access Private mode
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateBlogPostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    ProfileDB.findByIdAndUpdate(req.params.id, {
        $set: {
	          title: req.body.title,
	          topics: req.body.topics,
	          imageUrl: req.body.imageUrl,
	          description: req.body.description,
	          user: req.user.id
       		}
       	},
        {
        	new: true
        },
        (err, blogUpdated) => {
        	if(err) throw err;
        	res.json({blogUpdated})
        })
        .catch(err => res.status(404).json({ BlogPostnotfound: 'No post found' }));
 	}
);

// route DELETE api/delete/id
// access Private mode
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findOne({ user: req.user.id }).then(profile => {
    ProfileDB.findById(req.params.id)
      .then(post => {         
        post.remove().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
    })
    .catch(err => res.status(404).json({ Usernotfound: 'No User found' }));
  }
);

module.exports = router;