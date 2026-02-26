const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = new User({
        username,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(user.password, salt);
      user.password = hashPassword;
      const newUser = await user.save()
      res.status(200).json({msg:"User Registered Succesfully", data: newUser })

    } catch (error) {
      return res.status(500).json({ msg: error.msg });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          res.json({ msg: "Login Successful", data: user });
        }
        else{
            return res.status(400).json({ msg: "Invalid Username or Password" });
        }
      } else {
        return res.status(400).json({ msg: "User Not Registered" });
      }
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
  },
};
    module.exports = userCtrl