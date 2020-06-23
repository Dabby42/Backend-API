import axios from 'axios';
import moment from 'moment';
import secrets from './../../config/secrets';

import {NIGERIA, CARD, ACCOUNT} from './../../config/enums';

class Rave{

    constructor(){

    }

    getSecret () {
        return secrets.raveSecretKey
    }

    getKey () {
        return secrets.ravePublicKey;
    }

    getBaseUrl () {
        return secrets.raveBaseUrl;
    }

    getEncryptionKey () {
        return secrets.raveEncryptionKey
    }

    // this is the getKey function that generates an encryption Key for you by passing your Secret Key as a parameter.
    getEncryptedKey =() =>{
        let seckey = this.getSecret();
        let md5 = require('md5');
        let keymd5 = md5(seckey);
        let keymd5last12 = keymd5.substr(-12);
        let seckeyadjusted = seckey.replace('FLWSECK-', '');
        let seckeyadjustedfirst12 = seckeyadjusted.substr(0, 12);
        return seckeyadjustedfirst12 + keymd5last12;
    }

    // This is the encryption function that encrypts your payload by passing the stringified format and your encryption Key.
    encryptPayload = (key, payload) =>{
        let CryptoJS = require('crypto-js');
        let forge    = require('node-forge');
        let utf8     = require('utf8');
        let cipher   = forge.cipher.createCipher('3DES-ECB', forge.util.createBuffer(key));
        cipher.start({iv:''});
        cipher.update(forge.util.createBuffer(JSON.stringify(payload), 'utf-8'));
        cipher.finish();
        let encrypted = cipher.output;
        return ( forge.util.encode64(encrypted.getBytes()) );
    }

    /**
     * @param {Object} data
     */
    initiateCharge = async (data) => {
        
        let payload = {
            alg:"3DES-24",
            PBFPubKey: this.getKey(),
            client: this.encryptPayload(this.getEncryptedKey(), data)
        }
        //console.log(data, "boom", payload);
        try{
            let result = await axios.post(`${this.getBaseUrl()}/flwv3-pug/getpaidx/api/charge`,payload);
            // console.log(result.data);
            if(result){
                
                return result.data.data;
            }
            return null;
        }catch(err){
            console.log(err, payload);
            return null;
        }
    }
    
    validateCharge = async (data) => {
        let payload = {
            alg:"3DES-24",
            PBFPubKey: this.getKey(),
            transaction_reference: data.transaction_reference,
            otp: data.otp,
            client: this.encryptPayload(this.getEncryptedKey(), data)
        }
        // console.log(data);
        try{
            let result = await axios.post(`${this.getBaseUrl()}/flwv3-pug/getpaidx/api/validatecharge`,payload);
            // console.log(result.data); 
            if(result){
                
                return result.data.data;
            }
            return null;
        }catch(err){
            console.log(err.response.data);
            return null;
        }
    }

    /**
     * Returns list of banks
     */
    getBanks = async () => {
        try{
            let config = {
                params: {
                    country: NIGERIA,
                    public_key: this.getKey()
                }
            }
            let result = await axios.get(`${this.getBaseUrl()}/v2/banks/${NIGERIA}`, config);
            if(result){
                let banks = result.data.data.Banks;
                
                let bankResult = [];
                bankResult = banks.map((item) => {
                    const {Name, slug, Code, longCode} = item;
                    return {name: Name, slug, code: Code, longCode: longCode};
                });
                return bankResult;
                
            }else{
                return null;
            }
        }catch(err){
            console.log(err, "couldn't fetch banks")
            return null;
        }
    }

    /**
     * @param {String} bvn
     */
    resolveBvn = async (bvn) => {
        let config = {
            params: {
                seckey: this.getSecret()
            }
        }
        try{
            let result = await axios.get(`${this.getBaseUrl()}/v2/kyc/bvn/${bvn}`, config);
            
            if(result){
                const {first_name, last_name, middle_name, date_of_birth, phone_number, bvn} = result.data.data;
                let newBvn = {
                    firstName: first_name ? (first_name.length == 0 ? middle_name : first_name): middle_name,
                    lastName: last_name,
                    phoneNumber: phone_number,
                    dateOfBirth: moment(date_of_birth, 'DD-MMM-YYYY' ).format('YYYY-MM-DD').toString(),
                    bvn
                }
                return newBvn;
            }
            throw Error('Could not resolve BVN right now');
        }catch(err){
            // console.log(err);
            throw Error(err.response.data.message);
        }
    }

    /**
     * @param {String} accountNumber
     * @param {String} bankCode
     */
    resolveAccount = async (accountNumber, bankCode) => {
        let data = {
                recipientaccount: accountNumber,
                destbankcode: bankCode,
                PBFPubKey: this.getKey()
            }
            
        try{
            let result = await axios.post(`${this.getBaseUrl()}/flwv3-pug/getpaidx/api/resolve_account`, data);
            // console.log(result.data);
            if(result){
                const {accountnumber, accountname, responsecode} = result.data.data.data;
                if(responsecode == '00'){
                    return {accountNumber: accountnumber, accountName: accountname};
                }
                return null;
            }
            
            throw Error('Could not resolve account number');
        }catch(err){
            // console.log(err);
            throw Error(err.response.data.message);
        }
    }

    /**
     * @param {String} accountNumber
     */
    createRecipient = async (data) => {
        let headers = {
            'Authorization': `Bearer ${this.getSecret()}`
        }
        try{
            let result = await axios.post(`${this.getBaseUrl()}/transferrecipient`,data,{headers});
           
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
        data.seckey = this.getSecret()
        try{
            let result = await axios.post(`${this.getBaseUrl()}/v2/gpx/transfers/create`,data);
            // console.log(result.data.data);
            if(result){
                
                return result.data.data;
            }
            return null;
        }catch(err){
            console.log(err.response)
            return null;
        }
    }

    

    /**
     * @param {Object} data
     */
    chargeCard = async (data) => {
        data.SECKEY= this.getSecret()
        
        try{
            let result = await axios.post(`${this.getBaseUrl()}/flwv3-pug/getpaidx/api/tokenized/charge`,data);
            // console.log(result.status);
            if(result){
                
                return result.data.data;
            }
            return null;
        }catch(err){
            console.log(err, err.response)
            return null;
        }
    }

    verifyTransaction = async (reference) => {
        let data = {
            SECKEY: this.getSecret(),
            txref: reference
        }
        
        try{
            let result = await axios.post(`${this.getBaseUrl()}/flwv3-pug/getpaidx/api/v2/verify`,data);
            // console.log(result);
            if(result){
                const {amount, card, txref, plan, currency, flwref, appfee} = result.data.data;
                let channel = card ? CARD : ACCOUNT;
                let authorization = {
                    
                }
 
                if(channel == CARD){
                    authorization.authorization_code = card.card_tokens[0].embedtoken,
                    authorization.last4 = card.last4digits
                    authorization.exp_month = card.expirymonth
                    authorization.exp_year = card.expiryyear
                    authorization.brand = card.brand
                    authorization.card_type = card.type
                    authorization.channel = channel
                }
                
               
                return {amount, authorization, currency, gatewayReference: flwref, channel, reference: txref, fees: appfee};
            }
            throw Error('Could not verify transaction');
        }catch(err){
            console.log(err);
            throw Error(err.response.data.message);
            
        }
    }

     /**
     * @param {Object} data
     */
    refund = async (data) => {
        data.seckey= this.getSecret()
        // console.log(data, "got here at least");
        try{
            let result = await axios.post(`${this.getBaseUrl()}/gpx/merchant/transactions/refund`,data);
            
            if(result){
                return result.data.data;
            }
            return null;
        }catch(err){
            console.log(err.response.data)
            return null;
        }
    }
}

module.exports = Rave;