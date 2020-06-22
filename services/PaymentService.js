
import Paystack from './payments/Paystack';
import Rave from './payments/Rave';

class PaymentService {

    
    constructor(processor){
        this.processor = null;

        switch(processor){
            case 'paystack':
                this.processor = new Paystack();
                break;

            case 'rave':
                this.processor = new Rave();
                break;

            default:
                this.processor = new Rave();
        }
    }

    getBanks = async () => {
        return await this.processor.getBanks();
    }

    resolveBvn = async (bvn) => {
        return await this.processor.resolveBvn(bvn);
    }

    resolveAccount = async (accountNumber, bankCode) => {
        return await this.processor.resolveAccount(accountNumber, bankCode);
    }

    verifyTransaction = async (reference) => {
        return await this.processor.verifyTransaction(reference);
    }

    createRecipient = async (data) => {
        return await this.processor.createRecipient(data);
    }

    initiateTransfer = async (data) => {
        return await this.processor.initiateTransfer(data);
    }

    chargeCard = async (data) => {
        return await this.processor.chargeCard(data);
    }

    refund = async (data) => {
        return await this.processor.refund(data);
    }

    initiateCharge = async (data) => {
        return await this.processor.initiateCharge(data);
    }

    validateCharge = async (data) => {
        return await this.processor.validateCharge(data);
    }
    

}

module.exports = PaymentService;