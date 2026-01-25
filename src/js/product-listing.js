import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

// 1. Initialize the dynamic header and footer
loadHeaderFooter();

// 2. Set up the data source
const dataSource = new ProductData();

// 3. Retrieve the category from the URL parameters
const category = getParam("category");

// 4. Select the HTML element where the product list will be rendered
const listElement = document.querySelector(".product-list");

// 5. Initialize the product listing logic
const myList = new ProductList(category, dataSource, listElement);

// 6. Render the list
myList.init();
