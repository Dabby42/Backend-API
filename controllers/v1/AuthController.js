const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const BaseController = require('./BaseController');
const User = mongoose.model('User');

class AuthController extends BaseController{

  /**
   * @api {post} /o/token Authenticate User
   * @apiName Authenticate User
   * @apiGroup Auth
   * @apiParam {String} email user's email
   * @apiParam {String} password user's password
   */
  static async register(req, res) {
    const {firstName, email, password, lastName } = req.body;

    try {
      const user = new User({firstName, email, password, lastName });
      await user.save();

      let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,  {
          expiresIn: 86400 // expires in 24 hours
        });
      return this.success(res,{ token, user }, 'SignUp Successful');
    } catch (err) {
      return this.actionFailed(res, err.message)
    }
  }

  static async authenticate(req, res) {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if(user){
      let isPasswordValid = bcrypt.compareSync(password, user.password);
        if (isPasswordValid) {
          let token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {
              expiresIn: 86400 // expires in 24 hours
            }
          );

          return this.success(res,{ token, user }, 'Login Successful');

        } else {
          return this.unauthorized(res, 'Invalid Credentials');
        }
    }else{
      return this.notFound(res, "Account does not exist");
    }
  }

}

module.exports = AuthController;
