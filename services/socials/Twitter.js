import axios from 'axios';
import autoBind from 'auto-bind';

class Twitter{

    constructor(){
        autoBind(this);
    }

    async getTimeline(data){
        const {firstName, lastName} = data; 
        
        try{
            let result = await axios.get(`${secrets.twitterBaseUrl}/1.1/statuses/home_timeline.json?count=20`);
            
            let preparedResult = result.map((item, index) => {
                item.createdAt = item.created_at;
                item.firstName = firstName;
                item.lastName = lastName;
                delete item['created_at','truncated','entities','source','in_reply_to_status_id','in_reply_to_status_id_str','in_reply_to_user_id','in_reply_to_user_id_str','in_reply_to_screen_name','user','geo','coordinates','place','retweeted_status','contributors','is_quote_status','favorite_count','favorited','possibly_sensitive','possibly_sensitive_appealable','lang'];
                return item;
            }).filter((item) => {
                return item.text != undefined
            })
            return preparedResult;
        }catch(err){
            console.log(err);
            throw new Error(`Couldn't get timeline`);
        }
        
    }
   
}

module.exports = Twitter;