import JWT from 'jsonwebtoken';
import userModel from '../models/usermodel.js';

//protected routes token base
export const requireSignIn = async (req, res, next) => {
    try {
        const token = await req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token not provided',
            });
        }
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
    }

}

// admin access 
export const isAdmin = async (req, res, next) => {
    try {

        const user = await userModel.findById(req.user._id)

        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User not found"
            });
        }
        if (user.role === 'admin' || user.role === 'manager' || user.role === 'employee') {
            // User has the necessary role, allow the request to proceed
            next();
        } else {
            // User does not have the required role, send a 401 Unauthorized response
            return res.status(401).send({
                success: false,
                message: "Unauthorized Access"
            });
        }





        // if (user.role !== 'admin') {
        //     return res.status(401).send({
        //         success: false,
        //         message: "UnAuthorized Access"
        //     });
        // } else {
        //     next();
        // }
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success: false,
            error,
            message: "Error in Admin middelware",
        });
    }
}

// export const isAdmin = async (req, res, next) => {
//     try {
//         const user = await userModel.findById(req.user._id);

//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User not found',
//             });
//         }

//         if (user.role !== 'admin') {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Unauthorized access. Admin role required.',
//             });
//         }

//         next();
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             error: error.message,
//             message: 'Error in admin middleware',
//         });
//     }
// };



// export const isAdmin = (req, res, next) => {
//     if (req.user && req.user.role === 'admin') {
//         next();
//     } else {
//         res.status(403).json({
//             success: false,
//             message: 'Unauthorized Access'
//         });
//     }
// };


// if (req.user && req.user.role === 'admin') {
//     next();
// } else {
//     res.status(403).json({
//         success: false,
//         message: 'Unauthorized Access'
//     });
// }
