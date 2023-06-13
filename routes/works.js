const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const worksControllers = require('../controllers/works');

router.post('/', auth, multer.imageUploader.single('image'), multer.imgResize, worksControllers.createWork);
router.put('/:id', auth, multer.imageUploader.single('image'), multer.imgResize, worksControllers.modifyWork);
router.delete('/:id', auth, worksControllers.deleteWork);
router.get('/:id', worksControllers.getOneWork);
router.get('/', worksControllers.getAllWork);

module.exports = router;