import mongoose from 'mongoose';
import secrets from './secrets';
//===========================================

//===========================================
//connecting to the Mongo Db Server
//===========================================
mongoose
  .connect(
    secrets.mongoUri,
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      useFindAndModify: false,
      useCreateIndex: true,
      user: secrets.mongoUser,
      pass: secrets.mongoPass,
    }
  )
  .then(() => {
    console.log("Successfully connected to Mongo DB!");
  })
  .catch(err => {
    console.log("Could not connect to MongoDB " + err.message);
  });
  
  module.export = mongoose;