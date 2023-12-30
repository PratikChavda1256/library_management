import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/usermodel.js";
import orderModel from "../models/orderModel.js"
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        //all fild all in model to get 
        const { name, email, password, phone, address, answer } = req.body;

        //validation 
        if (!name) {
            return res.send({ message: 'Name is Required' })
        }
        if (!email) {
            return res.send({ message: 'Email is Required' })
        }
        if (!password) {
            return res.send({ message: 'Password is Required' })
        }
        if (!phone) {
            return res.send({ message: 'Phone is Required' })
        }
        if (!address) {
            return res.send({ message: 'address is Required' })
        }
        if (!answer) {
            return res.send({ message: 'Answer is Required' })
        }

        //check user
        const exisitingUser = await userModel.findOne({ email });

        //exisiting user
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already Register Please Login',
            })
        }

        //register user
        const hashedPassword = await hashPassword(password);


        //save all fill in user store in database
        const user = await new userModel({ name, email, phone, password: hashedPassword, address, answer }).save(); // Corrected variable name

        res.status(201).send({
            success: true,
            message: 'User Register Succesfully',
            user: user,
        })


    } catch (error) {
        console.log(error);
        res.status(500), send({
            success: false,
            message: "Error in Registeration",
            error
        })
    }
};
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not register"
            })
        }
        //compare password
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }
        //Genrate a token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d', });

        res.status(200).send({
            success: true,
            message: 'Login Successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                phone: user.phone,
                role: user.role,
            },
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
};

//forgotPasswordcontroller

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        //validation perform
        if (!email) {
            res.status(400).send({ message: 'Email is Required' });
        }
        if (!answer) {
            res.status(400).send({ message: 'answer is Required' });
        }
        if (!newPassword) {
            res.status(400).send({ message: 'password is Required' });
        }
        //check
        const user = await userModel.findOne({ email, answer })
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong Email or Answer'
            })
        }
        //hashed password
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user.id, { password: hashed })
        res.status(200).send({
            seccess: true,
            message: "Password Reset Successfully",
        })

    } catch (error) {
        console.log(error);
        res.status(505).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

//test controller
export const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }

};

//update profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body
        const user = await userModel.findById(req.user._id)
        //password
        if (password && password.length < 6) {
            return res.json({ error: 'Password is required and 6 character long' })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
        }, { new: true })
        res.status(200).send({
            success: true,
            message: 'Profile updated Sucessfully',
            updatedUser
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error While update profile',
            error
        })
    }
}

//ordercontroller
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error While Geting Orders',
            error
        })
    }
}

//all product in product 
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name").sort({ createAt: -1 });
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error While Geting Orders',
            error,
        })
    }
}


//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: true,
            message: "Error while updating Order",
            error
        })
    }
}

