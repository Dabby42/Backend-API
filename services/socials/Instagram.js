import axios from 'axios';
import autoBind from 'auto-bind';

class Instagram{

    constructor(){
        autoBind(this);
    }

    async getTimeline(){
        try{
            let result = await axios.get();
            return result
        }catch(err){
            throw new Error(`Couldn't get timeline`);
        }
        
    }
   
}

module.exports = Instagram;