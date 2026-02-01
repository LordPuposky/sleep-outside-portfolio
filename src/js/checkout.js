import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

// Initialize the checkout process using the ID selector from the HTML
const myCheckout = new CheckoutProcess("so-cart", "#checkout-summary");
myCheckout.init();

// Listen for the submit button click
document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();

  const myForm = document.forms["checkout-form"];

  // Check form validation status
  const chk_status = myForm.checkValidity();

  // Display validation messages to the user
  myForm.reportValidity();

  // Only proceed to checkout if the form is valid
  if (chk_status) {
    myCheckout.checkout();
  }
});
