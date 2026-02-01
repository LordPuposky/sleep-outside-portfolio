import ExternalServices from "./ExternalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";

const services = new ExternalServices();

// Helper function to convert form data to a JSON object
function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

// Helper function to simplify item data for the API request
function packageItems(items) {
  const simplifiedItems = items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: 1,
  }));
  return simplifiedItems;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  // Initialize the process by getting data and calculating the initial summary
  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
    this.calculateOrderTotal();
  }

  // Calculate the subtotal and display the number of items
  calculateItemSummary() {
    const summaryElement = document.querySelector(this.outputSelector);
    const itemNumElement = document.querySelector(this.outputSelector + " #num-items");

    if (itemNumElement) {
      itemNumElement.innerText = this.list.length;
    }

    const amounts = this.list.map((item) => item.FinalPrice);
    this.itemTotal = amounts.reduce((sum, item) => sum + item, 0);

    // Update the subtotal input value
    const subtotalElement = summaryElement.querySelector("#subtotal");
    if (subtotalElement) {
      subtotalElement.value = "$" + this.itemTotal.toFixed(2);
    }
  }

  // Calculate shipping, tax, and the final order total
  calculateOrderTotal() {
    // Shipping: $10 for the first item, $2 for each additional item
    this.shipping = 10 + (this.list.length - 1) * 2;
    // Tax: 6% of the item total
    this.tax = (this.itemTotal * 0.06).toFixed(2);
    // Final total calculation
    this.orderTotal = (
      parseFloat(this.itemTotal) +
      parseFloat(this.shipping) +
      parseFloat(this.tax)
    ).toFixed(2);

    this.displayOrderTotals();
  }

  // Display the final calculated values in the summary inputs
  displayOrderTotals() {
    const summaryElement = document.querySelector(this.outputSelector);

    const shippingElem = summaryElement.querySelector("#shipping");
    const taxElem = summaryElement.querySelector("#tax");
    const orderTotalElem = summaryElement.querySelector("#orderTotal");

    if (shippingElem) shippingElem.value = "$" + this.shipping.toFixed(2);
    if (taxElem) taxElem.value = "$" + this.tax;
    if (orderTotalElem) orderTotalElem.value = "$" + this.orderTotal;
  }

  // Process the final checkout request
  async checkout() {
    const formElement = document.forms["checkout-form"];
    const json = formDataToJSON(formElement);

    // Append required order data to the JSON object
    json.orderDate = new Date();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = packageItems(this.list);

    try {
      const res = await services.checkout(json);
      // eslint-disable-next-line no-console
      console.log(res);
      // Success: clear the cart and redirect the user
      setLocalStorage(this.key, []);
      location.assign("/checkout/checkedout.html");
    } catch (err) {
      // Error handling: clear previous alerts and display new server messages
      const existingAlerts = document.querySelectorAll(".alert");
      existingAlerts.forEach((alert) => alert.remove());

      const errorResponse = await err.message;

      for (let key in errorResponse) {
        alertMessage(errorResponse[key]);
      }
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }
}
