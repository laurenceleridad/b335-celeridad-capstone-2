const jwt = require("jsonwebtoken");

const secret = "CeleridadCourseBookingAPI";

module.exports.createAccessToken = (user) => {

	//payload
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	return jwt.sign(data, secret, {});
}

//function to verify is 
module.exports.verify = (req, res, next) => {
    console.log(req.headers.authorization);

    // "req.headers.authorization" contains sensitive data and especially our token
    let token = req.headers.authorization;

    // This if statement will first check if a token variable contains "undefined" or a proper jwt.  we will check token's data type with "typeof", if it is "undefined" we will send a message to the client. Else if it is not, then we return the token.
    //walang binigay na token
    if(typeof token === "undefined"){
        return res.send({ auth: "Failed. No Token" });
    } else {
    //kung hindi undefined, isslice yung token para hindi mainclude yung bearer
        console.log(token);		
        token = token.slice(7, token.length);
        console.log(token);

        //icocompare si token saka secret key
        //pag di nagmatch error sya
        //pag nagmatch papakita decoded token
        jwt.verify(token, secret, function(err, decodedToken){
            
            //If there was an error in verification, an erratic token, a wrong secret within the token, we will send a message to the client.
            if(err){
                return res.send({
                    auth: "Failed",
                    message: err.message
                });

            } else {

            	// Contains the data from our token
            	console.log("result from verify method:")
                console.log(decodedToken);//if we decode our token we will observe that it consist of information of the user, that is called payload.
                
                // Else, if our token is verified to be correct, then we will update the request and add the user's decoded details.
                //decoded token was assigned to req.user variable
                req.user = decodedToken;

                // next() is an expressJS function which allows us to move to the next function in the route. It also passes details of the request and response to the next function/middleware.
                next();
            }
        })
    }
};

//Pang verify if the user is an admin
module.exports.verifyAdmin = (req, res, next) => {
//ichecheck if si user is admin
	//paghindi admin -- action forbidden
	//pagadmin sige next go proceed gamitin mo yung feature
	
	if(req.user.isAdmin){
		
		next();
	} else {
		// Else, end the request-response cycle by sending the appropriate response and status code.
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}

}

//Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
}