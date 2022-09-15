var express = require('express');
var State = require('../models/State');
var Country = require('../models/Country');

var router = express.Router();

// create new Country
router.post('/', (req, res, next) => {
    let data = req.body;
    Country.create(data, (err, createdCountry) => {
        if (err) return next(err);
        res.json({ createdCountry });
    })
})

// list all countries
router.get('/list/:type', (req, res, next) => {
    let type = req.params.type;

    Country.find({}, (err, countries) => {
        if (err) return next(err);
        // list all countries
        if (type === 'all') {
            return res.json({ countries });
        }
        // to list in ascending order
        if (type === 'asc') {
            countries = countries.sort(function (a, b) {
                var nameA = a.name.toUpperCase();
                var nameB = a.name.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                // names must be equal
                return 0;
            });
            return res.json({ countries });
        }
        // to list in descending order
        if (type === 'desc') {
            countries = countries.sort(function (a, b) {
                var nameA = a.name.toUpperCase();
                var nameB = a.name.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                // names must be equal
                return 0;
            });
            return res.json({ countries });
        }
    })
});

// update country
router.get('/:id/update', (req, res, next) => {
    let countryId = req.params.id;
    let data = req.body;

    Country.findByIdAndUpdate(countryId, data, (err, updatedCountry) => {
        if (err) return next(err);
        res.json({ updatedCountry });
    })
})

// delete country
router.get('/:id/delete', (req, res, next) => {
    let countryId = req.params.id;

    Country.findByIdAndDelete(countryId, (err, deletedCountry) => {
        if (err) return next(err);
        res.json({ deletedCountry });
    })
});

// add state to country
router.post('/:id/state/add', (req, res, next) => {
    let countryId = req.params.id;
    let data = req.body;
    data.country = countryId;

    State.create(data, (err, createdState) => {

        Country.findByIdAndUpdate(countryId, { $push: { states: createdState.id } },
            (err, country) => {
                if (err) return next(err);
                res.json({ createdState, country });
            })
    })

});

// get all neighboring countries
router.get('/:id/neighbours', (req, res, next) => {
    let countryId = req.params.id;

    Country.findById(countryId)
        .populate('neighbouring_countries')
        .exec((err, neighbouringCountries) => {
            res.json({ neighbouringCountries });
        })
})

// get list of all religions
router.get('/list/religion', (req, res, next) => {
    Country.find({}, (err, countries) => {
        if (err) return next(err);

        var listOfReligions = countries.reduce((acc, cv) => {
            cv.ethnicity.forEach((ele) => {
                acc.push(ele);
            });
            return acc;
        }, []);

        res.json({ listOfReligions });
    })
})

// list of Countries based on religion
router.get('/list/religion/:type', (req, res, next) => {
    let type = req.params.type;

    Country.find({ ethnicity: type }, (err, countries) => {
        if (err) return next(err);
        res.json({ countries });
    })
});

// list of countries based on continent
router.get('/list/continent/:name', (req, res, next) => {
    let name = req.params.name;

    Country.find({ continent: name }, (err, countries) => {
        if (err) return next(err);

        res.json({ countries });
    })
});

module.exports = router;