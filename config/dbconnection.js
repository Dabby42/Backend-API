const mongoose= require("mongoose");
const secrets= require("./secrets");

//connecting to Mongo Db server

mongoose
  .connect(
    secrets.mongo,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log('Connected to mongo instance');

  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  })

module.export = mongoose;
