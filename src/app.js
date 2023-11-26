const express = require("express");
const path = require("path");
const http = require("http");
const EventEmitter = require("events");

const app = express();
const server = http.createServer(app);

require("./db/conn");
const Product = require("./models/product");
const User = require('./models/user');

const PORT = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");

app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set("view engine", "hbs");
app.set("views", templates_path);

const eventEmitter = new EventEmitter();

app.get("/", (req,res) => {
    res.render("index");
});

app.get('/api/products', async (req,res) => {
    Product.find({})
    .then((items) => {
      res.json(items);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.post('/api/signup', async (req, res) => {
  try {
    const maxUserID = await User.findOne().sort('-userid');
    const newUserID = maxUserID ? maxUserID.userid + 1 : 1;

    const newUser = new User({
      userid: newUserID,
      username: req.body.username,
      phonenumber: req.body.phoneNumber,
      password: req.body.password
    });
    await newUser.save();

    eventEmitter.emit('userSignedUp', { message: 'User signed up successfully' });

    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Account creation failed' });
  }
});

app.post('/api/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
      const user = await User.findOne({ username, password });
      if (user) {
          res.json({ success: true });
      } else {
          res.json({ success: false });
      }
  } catch (error) {
      res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

app.post('/api/addproduct', async (req, res) => {
  try {
    const newProduct = new Product({
      pid: parseInt(req.body.pid),
      name: req.body.name,
      company: req.body.company,
      rating: parseFloat(req.body.rating),
      price: parseFloat(req.body.price),
      description: req.body.description,
      imgsrc: req.body.imgsrc
    });

    await newProduct.save();

    eventEmitter.emit('productAdded', { message: 'New Product added successfully!!' });

    res.status(201).json({ message: 'New Product added successfully!!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product!' });
  }
});

app.post('/api/deleteproduct', async (req, res) => {
  try {
    const pidToDelete = req.body.pid;
    const productToDelete = await Product.findOne({ pid: pidToDelete });

    if (!productToDelete) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await Product.deleteOne({ pid: pidToDelete });

    eventEmitter.emit('productDeleted', { message: 'Product deleted successfully' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

app.post('/api/updateproduct', async (req, res) => {
  try {
    const pidToUpdate = req.body.pid;
    const newPrice = req.body.price;
    const productToUpdate = await Product.findOne({ pid: pidToUpdate });

    if (!productToUpdate) {
      return res.status(404).json({ message: 'Product not found' });
    }

    productToUpdate.price = newPrice;

    await productToUpdate.save();

    res.status(200).json({ message: 'Product price updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update product price' });
  }
});

eventEmitter.on('productAdded', (data) => {
  console.log('Event: ', data.message);
});

eventEmitter.on('productDeleted', (data) => {
  console.log('Event: ', data.message);
});

eventEmitter.on('userSignedUp', (data) => {
  console.log('Event: ', data.message);
});

server.listen(PORT, () => {
  console.log("Server is running at PORT", PORT);
});