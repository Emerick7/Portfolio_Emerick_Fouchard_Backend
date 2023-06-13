//const { request } = require('../app');
const Work = require('../models/Work');
const fs = require('fs');

exports.createWork = (req, res, next) => {
    const workObject = JSON.parse(req.body.work);
    delete workObject._id;
    delete workObject._userId;
    const work = new Work({
        ...workObject,
        userId: req.auth.userId,
        imgUrl: `${req.protocol}://${req.get('host')}/images/${res.locals.newName}`
    });

    work.save()
        .then(() => {res.status(201).json({ message: 'Work saved' })})
        .catch(error => {res.status(400).json({ error })});
};

exports.modifyWork = (req, res, next) => {
    const workObject = req.file ? {
        ...JSON.parse(req.body.work),
        imgUrl: `${req.protocol}://${req.get('host')}/images/${res.locals.newName}`
    } : { ...req.body };

    delete workObject._userId;
    Work.findOne({_id: req.params.id})
        .then((work => {
            if(work.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not Authorized' });
            } else {
                Work.updateOne({ _id: req.params.id}, { ...workObject, _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Work modified'}))
                    .catch(error => res.status(401).json({ error }));
            }
        }))
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteWork = (req, res, next) => {
    Work.findOne({ _id: req.params.id})
        .then(work => {
            if(work.userId != req.auth.userId) {
                res.status(401).json({ message: 'Unauthorized'})
            } else {
                const filename = work.imgUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Work.deleteOne({ _id: req.params.id})
                        .then(() => {res.status(200).json({ message: 'Work deleted'})})
                        .catch(error => res.status(401).json({ error }));
                })
            };
        })
        .catch(error => {
            res.status(500).json({ error })
        });
};

exports.getOneWork = (req, res, next) => {
    Work.findOne({ _id: req.params.id})
        .then(work => res.status(200).json(work))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllWork = (req, res, next) => {
    Work.find()
        .then(works => res.status(200).json(works))
        .catch(error => res.status(400).json({ error }));
};