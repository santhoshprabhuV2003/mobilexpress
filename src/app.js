const express = require("express");
const path = require("path");
const app = express();

const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');

require("./db/conn");

const PORT = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");

app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set("view engine", "hbs");
app.set("views", templates_path);

app.use('/', indexRoutes);
app.use('/api', productsRoutes);
app.use('/api', usersRoutes);

app.listen(PORT, () => {
  console.log("Server is running at PORT", PORT);
});