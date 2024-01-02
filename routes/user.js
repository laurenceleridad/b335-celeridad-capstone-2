const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
// const passport = require('passport');

//ininclude si auth
const auth = require("../auth");
const {verify, verifyAdmin} = auth;

router.post("/", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.getProfile);
router.post('/update-password', verify, userController.changePassword);
router.patch("/:userId/set-as-admin", verify, verifyAdmin, userController.updateUserToAdmin);

router.get("/get-cart", verify, userController.getUsersCart);
router.post("/add-to-cart", verify, userController.addToCart);
router.put("/update-cart-quantity", verify, userController.updateCartItem);

router.patch('/:productId/remove-from-cart', verify, userController.removeCartItem);
router.put('/clear-cart', verify,  userController.clearCartItems);

router.post('/checkout', verify, userController.createOrder);
router.get("/my-orders", verify, userController.getMyOrder);
router.get("/all-orders", verify, verifyAdmin, userController.getAllOrders);
router.patch('/:orderId/update-status', verify, verifyAdmin, userController.updateOrderStatus);


// router.get('/google', passport.authenticate('google', {
// 	scope: ['email', 'profile'],
// 	prompt: "select_account"
// }))

// router.get('/google/callback', passport.authenticate('google', {
// 	failureRedirect: '/users/failed'
// 	}),
// 	function(req,res){
// 		res.redirect('/users/success');
// 	}
// )

// router.get("/failed", (req,res) => {
// 	console.log("User is not authenticated");
// 	res.send("Failed");
// })

// router.get("/success", auth.isLoggedIn, (req,res) => {
// 	console.log("You are logged in");
// 	console.log(req.user);
// 	res.send(`Welcome ${req.user.displayName}`);
// })

// router.get("/logout", (req,res) => {
// 	req.session.destroy((err) => {
// 		if(err){
// 			console.log('Error while destroying session', err);
// 		} else {
// 			req.logout(()=>{
// 				console.log("You are logged out");
// 				res.redirect('/courses');
// 			})
// 		}
// 	})
// })


module.exports = router;