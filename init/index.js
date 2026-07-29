const mongooose = require("mongoose");
const Donor = require("../models/donor.js");
const initData = require("./donor.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/bioBridge";
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongooose.connect(MONGO_URL);
}

const initDB = async () => {
  await Donor.deleteMany({});
  await Donor.insertMany(initData.donorData);
  console.log("Data was initialized");
};

initDB();
