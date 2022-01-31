import gql from 'graphql-tag';

export const addItemToCart = gql`
  mutation($item: CartItemInput!) {
    addItemToCart(item: $item) {
      id
      items {
        id
      }
    }
  }
`;

export const changeCartItemQuantity = gql`
  mutation($id: String!, $order_quantity: Int!, $order_weight: Float!) {
    changeCartItemQuantity(id: $id, order_quantity: $order_quantity, order_weight: $order_weight) {
      id
    }
  }
`;

export const getCartByCustomerId = gql`
  query($customer_id: Int!) {
    getCartByCustomerId(customer_id: $customer_id) {
      id
      user_id
      customer_id
    }
  }
`;

export const getCartByCustomerIdWithItemIds = gql`
  query($customer_id: Int!) {
    getCartByCustomerId(customer_id: $customer_id) {
      id
      user_id
      customer_id
      items {
        id
      }
    }
  }
`;

export const getCartByCustomerIdWithItems = gql`
  query($customer_id: Int!) {
    getCartByCustomerId(customer_id: $customer_id) {
      id
      items {
        id
        sku_id
        order_quantity
        order_weight
        price
        sku {
          id
          image
          is_sample
          name
          b2c_increment_qty
          b2c_market_unit_price
          b2c_oom_id
          b2c_packaging
          b2c_pooling_qty
          b2c_total_market_price
          b2c_total_price
          b2c_unit_per_oom
          b2c_unit_price
          b2c_uom_id
          b2c_weight
          halal
          is_b2c_pooling
          tax_rate
          product {
            tenant_id
            name
            tenant {
              id
              tax_rate
              tenant {
                name
              }
            }
          }
          b2c_uom {
            name
          }
          b2c_oom {
            name
          }
        }
      }
    }
  }
`;

export const removeCartItem = gql`
  mutation($id: String!) {
    removeCartItem(id: $id)
  }
`;

export const getAllCartByUserId = gql`
  query getAllCartByUserId($hubId: Int) {
    getAllCartByUserId(hubId: $hubId) {
      active_sprees {
        id
        hub_id
        minimum_order
        current_order
        name
        alias_name
        delivery_date
        start_date
        end_date
        end_datetime
        tenant_id
      }
      cart_items {
        supplier {
          id
          tax_rate
          tenant {
            name
          }
        }
        items {
          id
          sku_id
          cart_id
          order_quantity
          order_weight
          price
          item_quantity
          sku {
            id
            image
            is_sample
            name
            b2c_increment_qty
            b2c_market_unit_price
            b2c_oom_id
            b2c_packaging
            b2c_pooling_qty
            b2c_total_market_price
            b2c_total_price
            b2c_unit_per_oom
            b2c_unit_price
            b2c_uom_id
            b2c_weight
            halal
            is_b2c_pooling
            is_order_by_weight
            tax_rate
            active
            inventories {
              unit_amount
              customer_id
              id
              quantity
              rank
            }
            product {
              id
              tenant_id
              name
              image
              tenant {
                id
                tax_rate
                tenant {
                  id
                  name
                }
              }
            }
            b2c_uom {
              name
            }
            b2c_oom {
              name
            }
            specs
          }
        }
      }
    }
  }
`;

export const getAvailableCollectionPoints = gql`
  query getAvailableCollectionPoints($product_id: Int!) {
    getAvailableCollectionPoints(product_id: $product_id) {
      id
      advocate_id
      hub_id
      tenant_id
      delivery_date
      start_date
      end_date
      Status
      hub {
        id
        name
        alias_name
        halal_products
      }
      tenant {
        id
        tenant {
          name
          alias_name
          minimum_order
        }
        tax_rate
      }
      active
    }
  }
`;
