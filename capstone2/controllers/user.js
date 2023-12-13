const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");


module.exports.registerUser = (req, res) => {
	return User.findOne({ email : req.body.email }).then((result) => {
		if(result != null && result.email == req.body.email){
			return res.status(400).send({ error: "Duplicate email found" });
		}
		if(req.body.mobileNo.length !== 11){
			return res.status(400).send({ error: "Enter 11 digit mobile number" });

		}
		if(!req.body.email.includes("@")){
			return res.status(400).send({ error: "Email invalid, no @ symbol" });
		}
		if(req.body.password.length < 8){
			return res.status(400).send({ error: "Password should be greater than 8 characters" });
		} 
		else {
			if(req.body.firstName !== '' && req.body.lastName !== '' && req.body.email !== '' && req.body.password !== ''){

                let newUser = new User({
                		firstName: req.body.firstName,
                		lastName: req.body.lastName,
                		email: req.body.email,
                		isAdmin: req.body.isAdmin,
                		password: bcrypt.hashSync(req.body.password, 10),
                		mobileNo: req.body.mobileNo
                	})
    
                return newUser.save()
                	.then((user) => res.status(201).send({ message: "Registered Successfully"}))
                	.catch(err => {
                		console.error("Register Error", err);
                		return res.status(500).send({error: "Failed to register"});
            		})
                	
            } else {

               return res.status(400).send({ error: "All fields must be provided"});
            }			
		}
	})
	.catch((err) => {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  });
}


module.exports.loginUser = (req,res) => {

	return User.findOne ({email: req.body.email})
	.then((result) => {
		if(result == null) {
			return res.status(404).send({ error: "No Email Found" });
		}
		else {
			
			const isPasswordCorrect = bcrypt.compareSync(req.body.password,result.password);
			if (isPasswordCorrect == true) {
					return res.status(200).send({ access : auth.createAccessToken(result)})
				} else {
					return res.status(401).send({ message: "Email and/or password do not match" });
				}
		}
	})
	.catch(err => {
		console.error("Error in logging in", err);
		return res.status(500).send({error: "Failed to login"});

	})
}

module.exports.getProfile = (req,res) => {
	console.log(req.user);
	return User.findById(req.user.id)
	.then(user =>{
		if(!user){
			return res.status(404).send({error: 'User not found'});

		} else {
			user.password = "******";
			return res.status(200).send({user})
		}
	})
	.catch(err => {
		console.error("Error in getting the profile", err);
		return res.status(500).send({error: "Failed to fetch profile"});
	})
}

module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body; 
    const { id } = req.user; 

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(id, { password: hashedPassword });

   
    res.status(200).send({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

//update user to admin
module.exports.updateUserToAdmin = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send({ error: "User ID is required." });
  }

  User.findByIdAndUpdate(userId, { isAdmin: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send({ error: "User not found." });
      }

      return res.status(200).send({ message: "User updated to admin successfully." });
    })
    .catch((err) => {
      console.error("Error updating user to admin", err);
      return res.status(500).send({ error: "Internal Server Error" });
    });
};