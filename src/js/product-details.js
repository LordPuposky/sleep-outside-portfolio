import ProductData from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

// 1. Initialize dynamic Header and Footer for this page
loadHeaderFooter();

// 2. Set up the data source for products
const dataSource = new ProductData("tents");

// 3. Retrieve the product ID from the URL parameters
const productId = getParam("product");

// 4. Initialize the ProductDetails with the product ID and data source
const product = new ProductDetails(productId, dataSource);
product.init();
