const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/mobilexpress", {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(() => {
    console.log("MongoDB Connected Successfully!!");
}).catch((e) => {
    console.log(e);
});