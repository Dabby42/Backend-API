import axios from 'axios';
import autoBind from 'auto-bind';
import secrets from './../../config/secrets';
import Twitter from 'twitter-lite';

class twitter{

    constructor(){
        autoBind(this);
    }

    async getTimeline(data){
        const {longLivedAccessToken, longLivedAccessTokenSecret, firstName, lastName} = data; 

        const client = new Twitter({
            consumer_key: secrets.twitterConsumerKey,
            consumer_secret: secrets.twitterConsumerSecret,
            access_token_key: longLivedAccessToken,
            access_token_secret: longLivedAccessTokenSecret
          });
          
        
        
        try{
            let tweets = await client.get("statuses/home_timeline");
            
            let preparedTweets = tweets.map((item, index) => {
                item.createdAt = item.created_at;
                item.firstName = firstName;
                item.lastName = lastName;
                delete item['created_at','truncated','entities','source','in_reply_to_status_id','in_reply_to_status_id_str','in_reply_to_user_id','in_reply_to_user_id_str','in_reply_to_screen_name','user','geo','coordinates','place','retweeted_status','contributors','is_quote_status','favorite_count','favorited','possibly_sensitive','possibly_sensitive_appealable','lang'];
                return item;
            }).filter((item) => {
                return item.text != undefined
            })
            return preparedTweets;
        }catch(err){
            console.log(err);
            throw new Error(`Couldn't get timeline`);
        }
        
    }
   
}

module.exports = twitter;