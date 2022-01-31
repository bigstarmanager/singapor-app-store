export function hasSpree(cart) {
  return !!cart.find((cartItem) => cartItem.spree);
}

export function hasAnyProductsChecked(cart) {
  return !!cart.find((cartItem) => cartItem.products.find((product) => product.isChecked));
}

export function buildCartMinimumSpree(cart) {
  const tempCart = [];
  for (const item of cart) {
    let tempItem = {};
    Object.assign(tempItem, item);

    const products = item.products.filter((o) => o.isChecked);
    tempItem.products = products;
    const overallPrice = getProductsTaxedPrice(products);

    if (products.length > 0 && overallPrice >= item.spree.minimum_order) {
      tempCart.push(tempItem);
    }
  }

  return tempCart;
}

export function getProductsTaxedPrice(products) {
  let totalPrice = 0;
  products.map((product) => {
    if (!product.isChecked) {
      return;
    }
    totalPrice += getTaxedPrice(product) * product.item.order_quantity;
  });

  return totalPrice;
}

export function getTaxRate(product) {
  return product.item.sku.tax_rate > 0 ? product.item.sku.tax_rate : product.item.sku.product.tenant.tax_rate;
}

export function calculateTaxedPrice(price, product) {
  return price + price * (getTaxRate(product) / 100);
}

export function getTaxedPrice(product) {
  const price = product.item.sku.b2c_unit_price * product.item.sku.b2c_unit_per_oom;
  return calculateTaxedPrice(price, product);
}

export function getTaxedMarketPrice(product) {
  const price = product.item.sku.b2c_market_unit_price * product.item.sku.b2c_unit_per_oom;
  return calculateTaxedPrice(price, product);
}

export function buildOrderItems(cart) {
  let items = [];
  let totalAmount = 0;

  let products = [];
  cart.forEach((cartItem) => {
    const currentProducts = cartItem.products.filter((product) => product.isChecked && product.isAvailable);
    products = products.concat(currentProducts);
  });

  for (const product of products) {
    const orderItem = {
      sku_id: product.item.sku_id,
      price: product.item.price,
      order_quantity: product.item.order_quantity,
      order_weight: product.item.order_weight,
      name: product.item.sku.name,
      tenant_id: product.item.sku.product.tenant_id
    };
    totalAmount += getTaxedPrice(product) * product.item.order_quantity;
    items.push(orderItem);
  }

  return {
    items: items,
    totalAmount: totalAmount
  };
}

export function buildCheckoutCartItems(cart, userHub) {
  let items = [];

  for (const cartItem of cart) {
    const cartItemIds = cartItem.products.map((product) => product.item.id);

    let checkoutItem = {
      tenantId: cartItem.supplier.id,
      hubId: userHub,
      cartItemIds: cartItemIds
    };

    items.push(checkoutItem);
  }

  return items;
}

export function isCheckoutNotAllowed(countryName, selectedCardPayment, finalPrice) {
  if (finalPrice === 0) {
    return '';
  }
  if (countryName === 'SG' && selectedCardPayment && finalPrice < 0.5) {
    return 'minimum_order_singapore';
  }
  if (countryName === 'MY' && finalPrice < 3.0) {
    return 'minimum_order_malaysia';
  }
  return '';
}
