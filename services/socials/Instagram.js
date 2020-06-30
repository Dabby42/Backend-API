import axios from 'axios';
import autoBind from 'auto-bind';

class Instagram{

    constructor(){
        autoBind(this);
    }

    async getTimeline(){
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
   
}

module.exports = Instagram;