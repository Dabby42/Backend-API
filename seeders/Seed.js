import autoBind from 'auto-bind';
import Helper from './../helpers/helper';
import Interest from './../models/Interest';
import User from './../models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
let mongoose = require('mongoose');
let gateman = require("gatemanjs").GateMan(mongoose);

dotenv.config();

class Seed extends Helper{
    constructor(){
        super();
        autoBind(this);
    }

    async seedRole(){
        await this.createSuperAdminRole();
        await this.createSuperAdmin();
        await this.assignSuperAdminRole();
    }

    createSuperAdmin = async () =>{
        const correctUser = {
            firstName: "Nwanze",
            lastName: "Franklin",
            email: "franko4don@gmail.com"
          }

        let hashedPassword = bcrypt.hashSync('tomcat', 8);
        
        let user = new User({...correctUser, password: hashedPassword,});

        try{

            let hasUser = await User.findOne({email: 'franko4don@gmail.com', provider: "email"});
            if(hasUser){
                console.log('user exists already');
                return;
            }

            await user.save();
            console.log(newUser, 'User created')
        }catch(err){
            
            console.log(err, 'Could not create user');
        }
    }

    createSuperAdminRole = async () => {
        
        try{
            let role = await gateman.createRole('superadmin');
            if(role){
                console.log('SuperAdmin role created');
            }
        }catch(err){
                console.log(err, 'failed to create role');
        }
    }

    assignSuperAdminRole = async () => {
        try{
            let roleName = 'superadmin';
            let user = await User.findOne({email: 'franko4don@gmail.com', provider: "email"});
            let roles = await gateman.getRoles();
            
            let role = await user.assign(roleName);
            if(role){
                if(!user.roles.includes(roleName)){
                    user.roles.push(roleName);
                    user.save();
                }
                console.log('Role Assigned');
            }
        }catch(err){
            console.log(err, "error occured")
        }
        
    }

    async seedInterest() {
        const data = [
            {name: 'Fashion', image: 'https://res.cloudinary.com/tribenigeria-com/image/upload/v1593594735/fashion_juqykt.png'},
            {name: 'Art', image: 'https://res.cloudinary.com/tribenigeria-com/image/upload/v1593594716/art_scgidu.png'},
            {name: 'Game', image: 'https://res.cloudinary.com/tribenigeria-com/image/upload/v1593594720/game_vfwajh.png'},
            {name: 'Web Dev', image: 'https://res.cloudinary.com/tribenigeria-com/image/upload/v1593594722/webdev_x7lluc.png'}
        ]
        try {
            data.map(async(item) => {
                let interest = await Interest.findOne({name: item.name});
                if(!interest){
                    interest = new Interest(item);
                    await interest.save();
                }
                
            })

        } catch (error) {
        }
        
    }


}



module.exports = Seed;