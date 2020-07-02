import autoBind from 'auto-bind';
import Helper from './../helpers/helper';
import Interest from './../models/Interest';
import dotenv from 'dotenv';

dotenv.config();

class Seed extends Helper{
    constructor(){
        super();
        autoBind(this);
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