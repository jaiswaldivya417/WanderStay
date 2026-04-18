const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../MODELS/listing.js");


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner: '69aad1d5ba20f7ca67bad158'}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();