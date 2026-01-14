import { renderListWithTemplate } from "./utils.mjs";

// 1. Template function: Defines the structure for each product card
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${product.Image}" alt="${product.Name}">
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

// 2. Class definition: Coordinates data fetching and rendering
export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // Fetch the list from our data source
    const list = await this.dataSource.getData();

    const filteredList = list.slice(0, 4);

    // Pass the list to the render method
    this.renderList(filteredList);
  }

  renderList(list) {
    // 3. We call the reusable utility function
    // We pass: the template, the destination, and the data
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
