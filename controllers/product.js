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

    return Product.findByIdAndUpdate(req.params.productId, updateStatus, {new:true})
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

    return Product.findByIdAndUpdate(req.params.productId, updateStatus, {new:true})
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


module.exports.getAllActive = (req, res) => {
	Product.find({ isActive : true})
	.then(product => {
		if(product.length > 0){
			return res.status(200).send({ product });
		}
		else{
			return res.status(200).send({ message: "No active products"});
		}
	})
	.catch(err => res.status(500).send({ error: "Error finding active products" }) );
};


module.exports.updateProduct = (req, res) => {

	let updatedProduct = {
		name: req.body.name,
		description: req.body.description, 
		price: req.body.price 
	}

	return Product.findByIdAndUpdate(req.params.productId, updatedProduct, {new:true})
	.then(updatedProduct => {
		if(!updatedProduct){
			return res.status(404).send({ error: "Product not found"})
		}
		else{
			return res.status(200).send(
				{ 
	        	message: 'Product updated successfully', 
	        	updatedProduct : updatedProduct 
	        	}
	        );
		}
	})
	.catch(err => {
		console.error("Error in updating a product: ", err)
		return res.status(500).send({ error: 'Error in updating a product.' });
	});
}


module.exports.searchProductsByPriceRange = (req, res) => {
  const { minPrice, maxPrice } = req.body;

  if (!minPrice || !maxPrice || isNaN(minPrice) || isNaN(maxPrice)) {
    return res.status(400).send({ error: "Both minPrice and maxPrice are required." });
  }

  Product.find({ price: { $gte: minPrice, $lte: maxPrice } })
    .then((products) => {
      if (products.length === 0) {
        return res.status(404).send({ message: "No products found in the specified price range." });
      }
      return res.status(200).send({ products });
    })
    .catch((err) => {
      console.error("Error searching products by price range", err);
      return res.status(500).send({ error: "Internal Server Error" });
    });
};


module.exports.searchProductsByName = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send({ error: "Name is required." });
  }

  const regex = new RegExp(name, 'i');

  console.log('Regex:', regex);

  Product.find({ name: regex })
    .then((products) => {
      if (products.length === 0) {
        return res.status(404).send({ message: "No products found with the specified name." });
      }
      console.log('Query results:', products);
      return res.status(200).send({ products });
    })
    .catch((err) => {
      console.error("Error searching products by name", err);
      return res.status(500).send({ error: "Internal Server Error" });
    });
};


