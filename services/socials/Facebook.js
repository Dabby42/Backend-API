import axios from 'axios';
import autoBind from 'auto-bind';
import secrets from './../../config/secrets';

class Facebook{

    constructor(){
        autoBind(this);
    }

    async getTimeline(data){
        const {longLivedAccessToken, firstName, lastName} = data;
        try{
            let result = await axios.get(`${secrets.facebookBaseUrl}/me/feed?access_token=${longLivedAccessToken}`);
            
            let preparedResult = result.data.data.map((item, index) => {
                item.createdAt = item.created_time;
                item.firstName = firstName;
                item.lastName = lastName;
                delete item['created_time'];
                return item;
            }).filter((item) => {
                return item.message != undefined
            })
            return preparedResult;
        }catch(err){
            console.log(err);
            throw new Error(`Couldn't get timeline`);
        }
        
    }

    async getAvatar(data){
        const {longLivedAccessToken} = data;
     
        try{
            let result = await axios.get(`${secrets.facebookBaseUrl}/me/picture?redirect=0&height=200&width=200&type=normal&access_token=${longLivedAccessToken}`);
            return result.data.data;
        }catch(err){
            console.log(err);
            throw new Error(`Couldn't get timeline`);
        }
        
    }
   
}

module.exports = Facebook;