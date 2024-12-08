# ValueVue: A Dynamic & Revolutionizing Retail

ValueVue is a full-stack MERN application aimed at connecting local customers with nearby sellers, helping them find the best products at the lowest prices based on their location. Sellers can easily manage their inventory, while customers can dynamically change their location and see real-time updates on nearby products and shops. The app aims to provide a seamless shopping experience by showing the shortest distance between customers and shops.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

### Customer Features:
- **Separate Login Credentials**: Customers have unique login credentials to access their accounts.
- **Dynamic Location**: Customers can change their location dynamically to see products and shops based on their new location.
- **Category-wise Filtering**: Products and shops are filtered by categories within a 20 km radius, with the nearest options displayed first.
- **Location-based Search**: Products and shops are filtered based on proximity, displaying the lowest prices for products near the customer.
- **Shortest Distance Calculation**: Customers can view the shortest distance between their current location and any shop they browse.
- **Product and Shop Listings**: A responsive interface shows nearby products along with seller information.
- **Search Functionality**: Customers can search for specific products across various categories.
- **QR Code Interaction**: Customers can scan a QR code at a shop to view the seller’s details, available products, and directly contact the seller.
- **Customer Engagement**: Customers can directly contact the sellers for more info.
- **Feedback and Contact**: Customers can leave feedback or contact the admin (user) via email.

### Seller Features:
- **Separate Login Credentials**: Sellers have unique login credentials to access their accounts.
- **Product Management**: Sellers can add, edit, or delete products easily. Changes are reflected in real-time.
- **Inventory Management**: Sellers can manage their inventory, ensuring that customers only see available products.
- **Location-based Shop Visibility**: Sellers' products are shown to customers based on geographic proximity, helping them target local buyers effectively.
- **Shop Dashboard**: A simple dashboard that provides an overview of products, sales, and customer engagement.
- **QR Code Interaction**: Sellers are provided with a QR code for customers to scan at their shop to access the seller's details and products.
- **Customer Engagement**: Sellers can receive direct contact from customers.
- **Feedback and Contact**: Sellers can leave feedback or contact the admin (user) via email.

---

## Technologies

### MERN Stack:
The **MERN stack** is a popular software stack used for building full-stack web applications. It's an acronym that stands for MongoDB, Express.js, React, and Node.js. Each component in the stack serves a specific purpose and together they provide a comprehensive framework for developing dynamic and interactive web applications.
- **MongoDB**: A NoSQL database used for storing data in JSON-like documents.
- **Express.js**: A web application framework for Node.js used for building server-side applications and APIs.
- **React.js**: A JavaScript library for building user interfaces, often used for creating dynamic and interactive front-end components.
- **Node.js**: A JavaScript runtime environment that executes JavaScript code outside of a web browser, commonly used for building server-side applications.
- **Redux**: A predictable state container for JavaScript apps, often used with React for managing application state.
- **Material-UI**: A popular React UI framework that provides pre-designed, customizable components that follow Google’s Material Design guidelines.

### Google Maps APIs:
**Google** provides a variety of APIs that help developers integrate location-based features into their applications. In ValueVue, several Google APIs were used to enhance the user experience with geolocation and mapping functionalities.
- **Maps JavaScript API**: This API is used to embed interactive maps on the frontend.
- **Geocoding API**: Converts addresses into geographic coordinates.
- **Geolocation API**: This API is used to determine the user's location based on their device’s GPS or IP address.
- **Directions API**: Used to calculate the shortest route between two geographic locations.
- **Places API**: This API is used to find nearby points of interest, such as shops, based on the customer’s location.
- **Autocomplete API**: A feature that automatically suggests complete addresses or locations as the customer types into the search bar.

---

## Screenshots

Here are some key screenshots that show the various features of the app:

### Signin & Signup Pages
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://i.postimg.cc/bNMJCC0R/12.png" width="350" height="200">
  <img src="https://i.postimg.cc/13qzLGJ1/13.png" width="350" height="200">
  <img src="https://i.postimg.cc/jjYjKDFw/14.png" width="350" height="200">
  <img src="https://i.postimg.cc/hjSPzHgK/15.png" width="350" height="200">
</div>

### Customer Pages
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://i.postimg.cc/Hx2n6T3J/3.png" width="350" height="200">
  <img src="https://i.postimg.cc/Kj8zVCs0/4.png" width="350" height="200">
  <img src="https://i.postimg.cc/zv2B1ps8/5.png" width="350" height="200">
  <img src="https://i.postimg.cc/bNdrRcnJ/9.png" width="350" height="200">
</div>

### Seller Pages
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://i.postimg.cc/vB38W3Hf/16.png" width="350" height="200">
  <img src="https://i.postimg.cc/KY78Ym69/17.png" width="350" height="200">
  <img src="https://i.postimg.cc/yxx1nck5/18.png" width="350" height="200">
  <img src="https://i.postimg.cc/gj7Y7jh0/19.png" width="350" height="200">
  <img src="https://i.postimg.cc/XN17qHP0/20.png" width="350" height="200">
  <img src="https://i.postimg.cc/9F4X7P3w/21.png" width="350" height="200">
</div>

### Home Page & Footer
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://i.postimg.cc/Hx2n6T3J/3.png" width="350" height="200">
  <img src="https://i.postimg.cc/RVjSQ39s/22.png" width="350" height="200">
  <img src="https://i.postimg.cc/QtsVgFgG/7.png" width="350" height="200">
  <img src="https://i.postimg.cc/L4xhf6nw/8.png" width="350" height="200">
</div>

---

## License

The project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
