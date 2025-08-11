const { check, validationResult } = require("express-validator");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const user = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        currentPage: 'Login',
        isLoggedIn: false,
        errorMessage: [],
        oldInput: { email: '' },
        user : {},// Pass user information to the template
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup', currentPage: 'signup', isLoggedIn: false, errors: [],
        oldInput: { firstName: "", lastName: "", email: "", userType: "" },
        user: {},// Pass user information to the template
    });

} 

exports.postLogin = async (req, res, next) => {
    // console.log("Login sucsessfull", req.body);
    // res.cookie('isLoggedIn', true,); // Set cookie for 1 day
    // isLoggedIn = true;
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(401).render('auth/login', {
            pageTitle: 'Login',
            currentPage: 'Login',
            isLoggedIn: false,
            errorMessage: ["Invalid email or password"],
            oldInput: { email },
            user: {},// Pass user information to the template
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).render('auth/login', {
            pageTitle: 'Login',
            currentPage: 'Login',
            isLoggedIn: false,
            errorMessage: ["Invalid Password"],
            oldInput: { email },
            user: {},// Pass user information to the template
        });
    }
    // If the user is found and password matches, set session variables
    req.session.isLoggedIn = true;
    req.session.user = user; // Store user information in session
    await req.session.save();

    res.redirect('/');
}




exports.postSignup = [
    check("firstName")
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage("Firstname must be between 2 and 20 characters")
        .matches(/^[a-zA-Z]+$/)
        .withMessage("Firstname must contain only letters"),
    
    check("lastName")
        .matches(/^[a-zA-Z]*$/)  // 0 pn chale (*)
        .withMessage("Lastname must contain only letters"),
    
    
    check("email")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
    
    check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number")
        .trim(),
    
    check("confirmPassword")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }
    ),

    check("userType")
        .notEmpty()
        .withMessage("Please select one type of a user")
        .isIn(['guest', 'host'])
        .withMessage("User type must be either 'guest' or 'host'"),
    
    check("terms")
        .custom((value, { req }) => {
            if (!req.body.terms) {
                throw new Error("You must accept the terms and conditions");
            }
            return true;
        }),
    
    
    (req, res, next) => {
        const { firstName, lastName, email, password, userType } = req.body;
        // Here you would typically check the credentials against a database

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            currentPage: 'signup',
            isLoggedIn: false,
            errorMessage: errors.array().map(err => err.msg),
            oldInput: { firstName, lastName, email, password, userType },
            user: {},// Pass user information to the template
            })
        }

        bcrypt.hash(password, 12)  // aya 12 times hash thay
            .then(hashedPassword => {
                const user = new User({firstName,lastName,email, password: hashedPassword ,userType});
                return user.save();
            })
            .then(() => {
                console.log("User created successfully");
                res.redirect('/login');
            })
            .catch(err => {
                console.error("Error creating user:", err);
                res.status(500).render('auth/signup', {
                    pageTitle: 'Signup',
                    currentPage: 'signup',
                    isLoggedIn: false,
                    errorMessage: "An error occurred while creating the user. Please try again.",
                    oldInput: { firstName, lastName, email, userType },
                    user: {},// Pass user information to the template
                });
            });
    }
    
]    

  
exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/login");
    })
}   