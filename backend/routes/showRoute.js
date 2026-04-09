const showRouter = require('express').Router();
const Show = require('../model/showModel');
const authMiddleware = require('../middlewares/authMiddleware');
const { addShow, deleteShow, updateShow, getAllShowsByTheatre, getAllTheatreByMovie, getShowById } = require('../controllers/showController');

showRouter.post('/add-show', authMiddleware, addShow);

showRouter.post('/delete-show', authMiddleware, deleteShow)

showRouter.put('/update-show', authMiddleware, updateShow)

showRouter.post('/get-all-shows-by-theatre', authMiddleware, getAllShowsByTheatre)

showRouter.post('/get-all-theatre-by-movie', authMiddleware, getAllTheatreByMovie)

showRouter.post('/get-show-by-id', authMiddleware, getShowById);

module.exports = showRouter;