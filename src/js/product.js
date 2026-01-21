import {
  getParam,
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter
} from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// 1. Initialize dynamic Header and Footer for this page
loadHeaderFooter();

// 2. Set up data source and retrieve the product ID from the URL parameters
const dataSource = new ProductData("tents");
const productID = getParam("product");

// 3. Initialize the product details logic
const productDetail = new ProductDetails(productID, dataSource);
productDetail.init();

/**
 * Adds a product object to local storage.
 * Renamed parameter to 'item' to avoid shadowing issues.
 */
function addProductToCart(item) {
  const cartItems = getLocalStorage("so-cart") || [];
  cartItems.push(item);
  setLocalStorage("so-cart", cartItems);
}

// Event handler for the "Add to Cart" button
async function addToCartHandler(e) {
  const productItem = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(productItem);
}

// To fix 'never used' warning, you can export the handler or attach it to a listener
document.getElementById("addToCart")?.addEventListener("click", addToCartHandler);
