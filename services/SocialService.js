
import Facebook from './socials/Facebook';
import Twitter from './socials/Twitter';
import Instagram from './socials/Instagram';

class PaymentService {

    
    constructor(processor){
        this.processor = null;

        switch(processor){
            case 'facebook':
                this.processor = new Facebook();
                break;

            case 'twitter':
                this.processor = new Twitter();
                break;

            case 'instagram':
                this.processor = new Instagram();

            default:
                this.processor = new Instagram();
        }
    }

    getTimeline = async (data) => {
        return await this.processor.getTimeline(data);
    }

    getAvatar = async (data) => {
        return await this.processor.getAvatar(data);
    }

}

module.exports = PaymentService;