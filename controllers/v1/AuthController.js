import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BaseController from './BaseController';
import User from './../../models/User';

class AuthController extends BaseController{

  /**
   * @api {post} /o/token Authenticate User
   * @apiName Authenticate User
   * @apiGroup Auth
   * @apiParam {String} email user's email
   * @apiParam {String} password user's password
   */
  async register(req, res) {
    const {firstName, email, password, lastName } = req.body;
    console.log(req.body);
    try {
      const user = new User({firstName, email, password, lastName });
      await user.save();

      let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,  {
          expiresIn: 86400 // expires in 24 hours
        });
      // res.send({token})
      return super.success(res,{ token, user }, 'SignUp Successful');
    } catch (err) {
      return super.actionFailure(res, err.message)
    }
  }

  async authenticate(req, res) {
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

          return super.success(res,{ token, user }, 'Login Successful');

        } else {
          return super.unauthorized(res, 'Invalid Credentials');
        }
    }else{
      return super.notFound(res, "Account does not exist");
    }
  }

}

module.exports = AuthController;
