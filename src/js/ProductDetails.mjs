import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // 1. Fetch product data from the API via ProductData.mjs
    this.product = await this.dataSource.findProductById(this.productId);

    if (this.product) {
      // 2. Populate the page with the product info immediately
      this.renderProductDetails();

      // 3. Bind the 'Add to Cart' button to the click event
      document
        .getElementById("addToCart")
        .addEventListener("click", this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    // Retrieve current cart from storage
    let cartItems = getLocalStorage("so-cart");

    // If the storage is empty or not an array, initialize a new list
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    // Add the current product to the list
    cartItems.push(this.product);

    // Save the updated list back to Local Storage
    setLocalStorage("so-cart", cartItems);

    // --- START OF ANIMATION LOGIC ---
    // Trigger the 'pop' animation on the cart icon
    const cartIcon = document.querySelector(".cart");
    if (cartIcon) {
      cartIcon.classList.add("animate");

      // Remove class after animation finishes (0.5s)
      setTimeout(() => {
        cartIcon.classList.remove("animate");
      }, 500);
    }
    // --- END OF ANIMATION LOGIC ---

    // --- START OF SUCCESS MESSAGE LOGIC ---
    // Show a temporary visual message instead of a blocking alert
    const addToCartButton = document.getElementById("addToCart");
    const successMessage = document.createElement("p");
    successMessage.classList.add("cart-success-msg");
    successMessage.textContent = "Added to backpack! 🎒";

    addToCartButton.before(successMessage);

    // Remove the message after 2 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 2000);
    // --- END OF SUCCESS MESSAGE LOGIC ---
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.getElementById("productBrandName").textContent = product.Brand.Name;
  document.getElementById("productName").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice}`;
  document.getElementById("productColorName").textContent = product.Colors[0].ColorName;
  document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}