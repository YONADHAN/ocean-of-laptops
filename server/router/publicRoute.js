
const express = require("express");
const router = express.Router();
const {public_get_products_by_category} = require("../controllers/user/publicController");
// import {public_get_products_by_category} from '../controllers/user/publicController'
router.get("/public_get_products_by_category",public_get_products_by_category)

module.exports = router