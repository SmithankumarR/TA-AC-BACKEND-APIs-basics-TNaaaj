var express = require('express');
var User = require('../models/User');
var lodash =require('lodash');
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

// list books by category
router.get('/list/by/:category', function(req,res,next) {
    var category = req.params.category;

    Book.find( {category: category }, (err,books) => {
        if(err) return next(err);

        res.json({ books });
    })
})

// count books for each category
router.get('/count/by/category',(req,res,next) => {

    // getting array of all categories
    Book.find({},(err,books) => {
        if(err) return next(err);

        var arrOfCate = books.reduce((acc,cv) => {
            acc.push(cv.categories);
            return acc;
        },[]);

        arrOfCate = lodash.uniq(lodash.flattenDeep(arrOfCate));
        let objOfcount = {};

        arrOfCate.forEach((categories) => {
            Book.find({ categories: categories}, (err,foundBooks) => {
                if(err) return next(err);

                objOfcount[categories] = foundBooks.length;

            });
        })
        res.json(objOfcount);
    })
})

// list of books by author

router.get('/list/author/:id', function(req,res,next) {
    let authorId = req.params.id;

    User.findById(authorId)
    .populate('books')
    .exec((err,user) => {
        if(err) return next(err);
        res.json({ books: user.books });
    })
})

// list of all tags
router.get('/tags/taglist',(req,res,next) => {
    Book.find({},(err,books) => {
        if(err) return next(err);

        let arrOftags = books.reduce((acc,cv) => {
            acc.push(cv.tags);
            return acc;

        }, []);

        arrOftags = lodash.uniq(lodash.flattenDeep(arrOftags));

        res.json( { arrOftags });
    })
})

// list of tags in ascending/descending order
router.get('/tags/tagslist/:type', (req,res,next) => {
    let type = req.params.type;

    Book.find({},(err,books) => {
        if(err) return next(err);

        let arrOftags = books.reduce((acc,cv) => {
            acc.push(cv.tags);
            return acc;
        },[]);
        arrOftags = lodash.uniq(lodash.flattenDeep(arrOftags));

        // ascending order

        if(type === 'asc'){
            arrOftags = arrOftags.sort(function(a,b) {
                var nameA = a.toUpperCase();
                var nameB = b.toUpperCase();

                if(nameA < nameB){
                    return -1;
                }
                if(nameA > nameB){
                    return 1;
                }
                // name must be equal
                return 0;
            });

            return res.json({ arrOftags });
        }

        // descending order
        if(type === 'desc'){
            arrOftags = arrOftags.sort(function(a,b) {
                var nameA = a.toUpperCase();
                var nameB = b.toUpperCase();

                if(nameA < nameB){
                    return -1;
                }
                if(nameA > nameB){
                    return 1;
                }
                // name must be equal
                return 0;
            });

            return res.json({ arrOftags });
        }
    })
});

// filter books by tags
router.get('list/tags/:name' ,(req,res,next) => {
    let name = req.param.name;

    Book.find({ tags: name}, (err, books) => {
        if(err) return next(err);

            res.json( { books });
    })
})
// count of number of books of each tags

router.get('/tags/taglist/count',(req,res,next) => {

    Book.find({}, (err,books) => {
        if(err) return next(err);

        let arrOftags = books.reduce((acc, cv) => {
            acc.push(cv.tags);
            return acc;
        },[]);

        arrOftags = lodash.uniq(lodash.flatMapDeep(arrOftags));

        let objOfcount = {};

        arrOftags.forEach((tag) => {
            Book.find({ tags: tag}, (err,booksByTags) => {
                if(err) return next(err);

                objOfcount[tag] = booksByTags.length;
            });
        });

        return res.json(objOfcount);
    })
})
module.exports = router;