## MobileXpress: A Simple E-Commerce Mobile Store

MobileXpress is a MEAN stack application designed as a simple e-commerce mobile store. It allows users to browse products, add items to their cart, sign up, log in, and manage their accounts. Admins can manage the product inventory.

### Features

- **Home Page**: Displays the services offered.
- **Products Page**: Shows a list of products with sorting and filtering capabilities.
- **Cart Page**: Allows users to view and manage their cart items.
- **About Us Page**: Provides information about the store.
- **Sign Up Page**: Enables new users to create an account.
- **Log In Page**: Allows existing users to log in.
- **Admin Page**: Enables admins to add, delete, and update products.

### Technologies Used

- **Frontend**: AngularJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Templating Engine**: Handlebars (hbs)

### API Endpoints

- **GET /api/products**: Fetch all products.
- **POST /api/signup**: Create a new user account.
- **POST /api/login**: Log in a user.
- **POST /api/product**: Add a new product (Admin only).
- **DELETE /api/product**: Delete a product (Admin only).
- **PATCH /api/product**: Update a product's price (Admin only).

### AngularJS Controllers

- **Home Controller**: `homectrl`
- **Products Controller**: `productsctrl`
- **Cart Controller**: `cartctrl`
- **About Us Controller**: `aboutusctrl`
- **Sign Up Controller**: `signupctrl`
- **Log In Controller**: `loginctrl`
- **Admin Controller**: `adminctrl`

### AngularJS Services

- **Cart Service**: Manages the cart items.
- **Auth Service**: Manages user authentication state.

### AngularJS Directives

- **Product Directive**: Custom directive to display a product.

### Contribution

Feel free to fork this repository, open issues, and submit pull requests.