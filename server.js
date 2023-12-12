const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const compression = require('compression');
const { fireBaseConnection } = require('./utils/fbConnect');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const restRoute = require("./routes/restaurant");
const sendVerificationEmail = require("./utils/email_verification");
const catRoute = require("./routes/category");
const foodRoute = require("./routes/food");
const cartRoute = require("./routes/cart");
const addressRoute = require("./routes/address");
const driverRoute = require("./routes/driver");
const messagingRoute = require("./routes/messaging");
const orderRoute = require("./routes/order");



dotenv.config()

fireBaseConnection();
// sendVerificationEmail("akotoxmpimbo@gmail.com", "fdhgfssdhgs")



const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("connected to the db")).catch((err) => { console.log(err) });


app.use(compression({
    level: 6,
    threshold: 0
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", authRoute);
app.use("/api/users", userRoute);
app.use("/api/restaurant", restRoute);
app.use("/api/category", catRoute);
app.use("/api/foods", foodRoute);
app.use("/api/cart", cartRoute);
app.use("/api/address", addressRoute);
app.use("/api/driver", driverRoute);
app.use("/api/orders", orderRoute);
app.use("/api/messaging", messagingRoute);


app.listen(process.env.PORT || 6000, () => console.log(`Foodly backend app listening on port ${process.env.PORT}!`));
