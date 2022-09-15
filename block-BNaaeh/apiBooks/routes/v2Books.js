var express = require('express');
var User = require('../models/User');
var Book = require('../models/Book');
var Comment = require('../models/Comment');

var router = express.Router();

// list all books
router.get('/', (req, res, next) => {
    Book.find({}, (err, books) => {
        if (err) return next(err);
        res.json({ books });
    });
});

// create new Book
router.post('/', (req, res, next) => {
    var data = req.body;
    Book.create(data, (err, createdBook) => {
        if (err) return next(err);
        res.json({ createdBook });
    });
});
// get single book
router.get('/:id', (req, res, next) => {
    var id = req.params.id;
    Book.findById(id, (err, book) => {
        if (err) return next(err);
        res.json({ book });
    });
});

// update a book
router.put('/:id', (req, res, next) => {
    var bookId = req.params.id;
    var data = req.body;
    Book.findByIdAndUpdate(bookId, data, (err, updatedBook) => {
        if (err) return next(err);
        res.json({ updatedBook });
    });
});

// delete a book
router.delete('/:id', (req, res, next) => {
    var bookId = req.params.id;
    Book.findByIdAndDelete(bookId, (err, deletedBook) => {
        if (err) return next(err);
        res.json({ deletedBook });
    });
});


// comments are going to be populated with the books


// list all Comments
router.get('/:id/comments', (req, res, next) => {
    var bookId = req.params.id;

    Book.findById(bookId)
        .populate('comments')
        .exec((err, book) => {
            if (err) return next(err);
            res.json({ book });
        });
});

// create new Comment
router.post('/:id/comment/new', (req, res, next) => {
    var data = req.body;
    data.createdBy = req.user.id;

    Comment.create(data, (err, createComment) => {
        if (err) return next(err);

        User.findByIdAndUpdate(req.user.id,
            { $push: { comments: createComment.id } },
            (err, updatedUser) => {
                if (err) return next(err);
                res.json({ createComment, updatedUser });

            })
    })
})


//edit a comment

router.get('/:id/comment/edit/:commId', (req, res, next) => {
    let commentId = req.params.commId;

    Comment.findById(commentId, (err, comment) => {
        if (err) return next(err);
        res.json({ comment });
    });
});

router.post('/:id/comment/edit/:commId', (req, res, next) => {
    let commentId = req.params.commId;
    let data = req.body;

    Comment.findByIdAndUpdate(commentId, data, (err, updatedComment) => {
        if (err) return next(err);
        res.json({ updatedComment });
    });
});

//delete a comment
router.get('/:id/comment/delete/:commId', (req, res, next) => {
    let commentId = req.params.commId;

    Comment.findByIdAndDelete(commentId, (err, deletedComment) => {
        if (err) return next(err);
        User.findByIdAndUpdate(
            deletedComment.createdBy,
            {
                $pull: { comments: deletedComment.id },
            },
            (err, updatedUser) => {
                if (err) return next(err);
                res.json({ deletedComment, updatedUser });
            }
        );
    });
});


module.exports = router;