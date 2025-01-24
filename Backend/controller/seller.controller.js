import seller from "../model/seller.model.js";
import Service from "../model/service.model.js";
import cookieParser from "cookie-parser";

export const register = async ( req , res ) => {
    try {
        const { username, email, mobile, password } = req.body;

        if ( !username || !email || !mobile || !password ) {
            return res.status(400).json({ "error": "All fields are required." });
        } 

        if ( email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ) {
            return res.status(400).json({ "error": "Please enter a valid email address." });
        }

        if ( mobile && !mobile.match(/^\d{10}$/) ) {
            return res.status(400).json({ "error": "Mobile number must be exactly 10 digits." });
        }

        const existingSeller = await seller.findOne({ email });

        if ( existingSeller ) {
            return res.status( 409 ).json({ "error": "Seller with this email already exists." });
        }

        const hashedPassword = await seller.hashPassword( password );

        const newSeller = new seller({
            username,
            email,
            mobile,
            password: hashedPassword
        });
        await newSeller.save();

        return res.status(201).json({ "message": "Seller registered successfully." , "seller": newSeller });
    } catch ( err ) {
        return res.status(500).json({"error": "An unexpected error occurred. Please try again later."});
    }
}

export const login = async ( req , res ) => {
    try {
        const { email , password } = req.body;

        if ( !email || !password ) {
            return res.status(400).json({"error": "All Fileds are required!"});
        }

        if ( email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ) {
            return res.status(400).json({ "error": "Please enter a valid email address." });
        }

        const loggedseller = await seller.findOne({ email });

        if ( !loggedseller ) {
            return res.json(400).json({"error": "Seller is not available with this mail!"});
        }

        const isPasswordValid = await loggedseller.comparePassword(password);

        if ( !isPasswordValid ) {
            return res.status(401).json({ message: "Invalid credentials!" } );
        }

        const token = loggedseller.generateAuthToken();
        res.cookie( 'token' , token , { httpOnly: true } );
        return res.status(200).json({"Message": "Logged In Successfully!", "token": token , "seller": loggedseller})
    } catch( err ) {
        console.error( err );
        return res.status(500).json({"error": "An unexpected error occured!"});
    }
}

export const createService = async (req, res) => {
    try {
      const { name, description, price , img_url } = req.body;
  
      // Validate fields
      if (!name || !description || !price || !img_url ) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Validate price
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: "Price must be a positive number" });
      }
  
      // Ensure user is authenticated (data provided by middleware)
      if (!req.user || !req.user._id) {
        return res.status(401).json({ error: "Unauthorized! Seller ID is missing." });
      }
  
      const sellerId = req.user._id;
  
      // Create a new service
      const newService = new Service({
        name,
        description,
        price,
        img_url,
        sellerId, // Linking the service to the authenticated seller
      });
  
      await newService.save();
  
      return res.status(201).json({ message: "Service created successfully", service: newService });
    } catch (err) {
      console.error("Service Creation Error:", err);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  export const viewServices = async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ error: "Unauthorized! Seller ID is missing." });
      }
  
      const sellerId = req.user._id;
      const services = await Service.find({ sellerId });
  
      return res.status(200).json({ services });
    } catch (err) {
      console.error("View Services Error:", err);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  };
  
  export const editService = async (req, res) => {
    try {
      const { name, description, price , img_url } = req.body;
      const serviceId = req.params.id; // Get serviceId from URL parameters
  
      // Validate the fields
      if (!name || !description || !price || !img_url) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: "Price must be a positive number" });
      }
  
      // Ensure the user is authenticated and has a valid seller ID
      if (!req.user || !req.user._id) {
        return res.status(401).json({ error: "Unauthorized! Seller ID is missing." });
      }
  
      const sellerId = req.user._id;
  
      // Find the service by serviceId and sellerId (ownership check)
      const service = await Service.findOne({ _id: serviceId, sellerId });
  
      if (!service) {
        return res.status(404).json({ error: "Service not found or you do not have permission to edit it." });
      }
  
      // Update the service
      service.name = name;
      service.description = description;
      service.price = price;
      service.img_url = img_url;
  
      await service.save();
  
      return res.status(200).json({ message: "Service updated successfully", service });
    } catch (err) {
      console.error("Edit Service Error:", err);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  };
  
  
  // Delete Service
  export const deleteService = async (req, res) => {
    try {
      const { serviceId } = req.params;
  
      if (!req.user || !req.user._id) {
        return res.status(401).json({ error: "Unauthorized! Seller ID is missing." });
      }
  
      const sellerId = req.user._id;
      const service = await Service.findOneAndDelete({ _id: serviceId, sellerId });
  
      if (!service) {
        return res.status(404).json({ error: "Service not found or you do not have permission to delete it." });
      }
  
      return res.status(200).json({ message: "Service deleted successfully" });
    } catch (err) {
      console.error("Delete Service Error:", err);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  };
  
  // Logout Seller
  export const logout = async (req, res) => {
    try {
      res.clearCookie('token');
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  };