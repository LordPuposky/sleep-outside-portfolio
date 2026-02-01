import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import {
  getParam,
  loadHeaderFooter
} from "./utils.mjs";

// 1. Initialize dynamic Header and Footer for this page
loadHeaderFooter();

// 2. Set up data source and retrieve the product ID from the URL parameters
const dataSource = new ExternalServices("tents");
const productID = getParam("product");

// 3. Initialize the product details logic
const productDetail = new ProductDetails(productID, dataSource);
productDetail.init();



