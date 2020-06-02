const mongoose= require("mongoose");
const secrets= require("./secrets");

const mongoUri = 'mongodb+srv://database:passwordpassword@cluster0-36vuz.mongodb.net/test?retryWrites=true&w=majority';
if (!mongoUri) {
  throw new Error(
    `MongoURI was not supplied.  Make sure you watch the video on setting up Mongo DB!`
  );
}
mongoose
  .connect(
    secrets.mongo,
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log('Connected to mongo instance');

  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  })

module.export = mongoose;
