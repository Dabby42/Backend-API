import axios from 'axios';
import secrets from './../../config/secrets';

class Paystack{

    constructor(){
        
    }

    getSecret = async () => {
        
        return  secrets.paystackSecretKey
    }

    getBaseUrl = async () => {
        return  secrets.paystackBaseUrl
    }

    /**
     * Returns list of banks
     */
    getBanks = async () => {
        try{
            let headers = {
                'Authorization': `Bearer ${await await this.getSecret()}`
            }
            let result = await axios.get(`${await this.getBaseUrl()}/bank`,{headers});
            if(result){
                let banks = result.data.data;
                let bankResult = [];
                bankResult = banks.map((item) => {
                    const {name, slug, code, longcode} = item;
                    return {name, slug, code, longCode: longcode};
                });
                return bankResult;
                
            }else{
                return null;
            }
        }catch(err){
            return null;
        }
    }

    /**
     * @param {String} bvn
     */
    resolveBvn = async (bvn) => {
        let headers = {
            'Authorization': `Bearer ${await this.getSecret()}`
        }
        try{
            let result = await axios.get(`${await this.getBaseUrl()}/bank/resolve_bvn/${bvn}`,{ headers});
            // console.log(result);
            if(result){
                const {first_name, last_name, formatted_dob, mobile, bvn} = result.data.data;
                let newBvn = {
                    firstName: first_name,
                    lastName: last_name,
                    phoneNumber: mobile,
                    dateOfBirth: formatted_dob,
                    bvn
                }
                return newBvn;
            }
            throw Error('Could not resolve BVN right now');
        }catch(err){
            // console.log(err);
        }
    }

    /**
     * @param {String} accountNumber
     */
    resolveAccount = async (accountNumber, bankCode) => {
        let headers = {
            'Authorization': `Bearer ${await this.getSecret()}`
        }
        try{
            let result = await axios.get(`${await this.getBaseUrl()}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,{ headers});
         
            if(result){
                const {account_number, account_name} = result.data.data;
                return {accountNumber: account_number, accountName: account_name};
            }
            return null;
        }catch(err){
            // console.log(err.response);
            return null;
        }
    }

    /**
     * @param {String} accountNumber
     */
    createRecipient = async (data) => {
        let headers = {
            'Authorization': `Bearer ${await this.getSecret()}`
        }
        try{
            let result = await axios.post(`${await this.getBaseUrl()}/transferrecipient`,data,{headers});
           
            if(result){
                const {details, currency, recipient_code} = result.data.data;
                return {accountNumber: details.account_number, currency, recipientCode: recipient_code};
            }
            return null;
        }catch(err){
           
            return null;
        }
    }

    /**
     * @param {String} accountNumber
     */
    initiateTransfer = async (data) => {
        let headers = {
            'Authorization': `Bearer ${await this.getSecret()}`
        }
        try{
            let result = await axios.post(`${await this.getBaseUrl()}/transfer`,data, {headers});
            
            if(result){
                
                return result.data.data;
            }
            return null;
        }catch(err){
           
            return null;
        }
    }

    verifyTransaction = async (reference) => {
        let headers = {
            'Authorization': `Bearer ${await this.getSecret()}`
        }
        try{
            let result = await axios.get(`${await this.getBaseUrl()}/transaction/verify/${reference}`,{ headers});
            
            if(result){
                const {amount, authorization, reference, fees, plan} = result.data.data;
                return {amount, authorization, reference, fees, plan};
            }
            return null;
        }catch(err){
            return null;
        }
    }
}

module.exports = Paystack;