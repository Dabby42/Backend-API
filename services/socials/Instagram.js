import axios from 'axios';
import autoBind from 'auto-bind';
import secrets from './../../config/secrets';

class Instagram{

    constructor(){
        autoBind(this);
    }

    async getTimeline(data){
        const {longLivedAccessToken, firstName, lastName} = data;
        try{
            let result = await axios.get(`${secrets.instagramBaseUrl}/me/media?fields=timestamp,media_url,caption&access_token=${longLivedAccessToken}`);

            let preparedResult = result.data.data.map((item, index) => {
                item.createdAt = item.timestamp;
                item.firstName = firstName;
                item.lastName = lastName;
                delete item['timestamp'];
                return item;
            }).filter((item) => {
                return item.caption != undefined
            })
            return preparedResult;
          
        }catch(err){
            console.log(err.message);
            throw new Error(`Couldn't get timeline`);
        }
        
    }
   
}

module.exports = Instagram;