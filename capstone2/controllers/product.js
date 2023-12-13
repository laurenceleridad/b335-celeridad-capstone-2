const Product = require("../models/Product");


module.exports.addProduct = (req, res) => {
	Product.findOne({name: req.body.name})
	.then(result => {
		if(result){
			return res.status(409).send({ error: "Product already exist"}) 
		}
		else {
			let newProduct = new Product({
			name: req.body.name,
			description: req.body.description,
			price: req.body.price
			})

			return newProduct.save()
			.then(savedProduct => res.status(201).send({savedProduct}))
			.catch(err => {
				console.error("Error in saving the product", err)
				return res.status(500).send({ error: "Failed to save the product"})
			})
		}
	})		
};


module.exports.getAllProduct = (req, res) => {
	return Product.find({})
	.then(product => { res.status(200).send({product}) })
	.catch(err => res.status(500).send({error: "Error finding all products"}) );
};


module.exports.getProduct = (req, res) => {
	Product.findById(req.params.productId)
	.then(product => {
		if(!product){
			return res.status(404).send({ error: "Product not found"})
		}
		else{
			return res.status(200).send({product})
		}
	})
	.catch(err => {
		console.error("Error in retrieving the product", err);
		return res.status(500).send({error: "Failed to fetch product"});
	})
}


module.exports.archiveProduct = (req, res) => {
    let updateStatus = {
        isActive: false
    }

    return Product.findByIdAndUpdate(req.params.productId, updateStatus)
    .then(archiveProduct => {
        if(!archiveProduct){
            return res.status(404).send({ error: 'Product not found' });
        }
        else{
            return res.status(200).send(
                { 
                message: 'Product archived successfully', 
                archiveProduct
                }
            );
        }
    })
    .catch(err => {
        console.error("Error: ", err)
        return res.status(500).send({ error: 'Error in archiving a product.' });
    });
}


module.exports.activateProduct = (req, res) => {
    let updateStatus = {
        isActive: true
    }

    return Product.findByIdAndUpdate(req.params.productId, updateStatus)
    .then(activatedProduct => {
        if(!activatedProduct){
            return res.status(404).send({ error: 'Product not found' });
        }
        else{
            return res.status(200).send(
                { 
                message: 'Product activated successfully', 
                activatedProduct
                }
            );
        }
    })
    .catch(err => {
        console.error("Error: ", err)
        return res.status(500).send({ error: 'Error in activating a product.' });
    });
}