const express = require("express");
const bcrypt = require("bcryptjs");

const { UserModel } = require("../model/UserModel");

const router = express.Router();


// ================= SIGNUP =================

router.post("/signup", async (req, res) => {

    console.log("SIGNUP API HIT");
    console.log(req.body);

    try {

        const { name, mobile, email, password } = req.body;

        // Check all fields
        if (!name || !mobile || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if email already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({
            name,
            mobile,
            email,
            password: hashedPassword
        });

        // Save user
        const savedUser = await newUser.save();

        console.log("USER SAVED SUCCESSFULLY");
        console.log(savedUser);

        res.status(201).json({
            message: "Account created successfully"
        });

    } catch (error) {

        console.log("SIGNUP ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ================= LOGIN =================

router.post("/login", async (req, res) => {

    console.log("LOGIN API HIT");
    console.log(req.body);

    try {

        const { email, password } = req.body;

        // Check email and password
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        console.log("LOGIN SUCCESSFUL");

        // Send user data
        res.status(200).json({
            message: "Login successful",
            user: {
                name: user.name,
                mobile: user.mobile,
                email: user.email
            }
        });

    } catch (error) {

        console.log("LOGIN ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;