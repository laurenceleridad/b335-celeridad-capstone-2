const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");

const auth = require("../auth");
const {verify, verifyAdmin} = auth;

router.post("/", verify, verifyAdmin, productController.addProduct);

router.get("/all", verify, verifyAdmin, productController.getAllProduct);

router.get("/:productId", productController.getProduct);

router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

module.exports = router;