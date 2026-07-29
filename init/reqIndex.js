const mongooose = require("mongoose");
const Request = require("../models/request.js");
const initData = require("./request.js");

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
  await Request.deleteMany({});
  await Request.insertMany(initData.requestData);
  console.log("Data was initialized");
};

initDB();
