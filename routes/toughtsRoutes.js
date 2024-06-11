const express = require("express");
const router = express.Router();
const ToughtController = require('../controllers/toughtscontoller');
const checkauth = require('../services/auth')

router.get("/add",checkauth, ToughtController.create);
router.post("/add",checkauth, ToughtController.createPost);
router.get('/edit/:id', checkauth, ToughtController.editTought)
router.post('/edit', checkauth, ToughtController.editToughtPost)
router.get("/dashboard",checkauth, ToughtController.dashboard);
router.post("/remove", ToughtController.remove)
router.get("/", ToughtController.showTougths);
module.exports = router;
