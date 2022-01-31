import gql from 'graphql-tag';

export const getAllOrders = gql`
  query allOrders($hub_id: Int, $status_id: [Int]!, $user_id: Int!) {
    allOrders(active: true, hub_id: $hub_id, status_id: $status_id, user_id: $user_id) {
      id
      payment_b2c_id
      order_status_id
      spree_id
      total_charged
      voucher_discount
      order_status {
        name
      }
      delivery_date
      delivery_time
      created_at
      updated_at
      stripe_transaction_id
      user {
        first_name
        last_name
      }
      description
      standalone
      po_number
      active
      paymentB2c {
        discount_amount
        voucher_code
        order_total
        stripe_transaction_id
        refunded_amount
      }
      pre_order_item {
        id
        order_item_status {
          id
          name
        }
        pool_item {
          pool {
            pool_qty
            remaining_qty
          }
        }
        order_item_status_id
        order_id
        sku_id
        sku {
          product_id
          name
          product {
            tenant {
              tenant {
                alias_name
                name
              }
            }
            name
            image
            customers {
              name
            }
          }
          is_b2c_pooling
          b2c_pooling_qty
          image
          b2c_packaging
          oom {
            name
          }
          sku_deals {
            id
            discount
          }
        }
        hub {
          hub_delivery_fee
          name
          alias_name
          minimum_order
          tenant {
            street_name
            registration_number
          }
          address {
            street_number
            road
            city
            postal_code
          }
        }
        tax
        original_tax
        user_id
        customer_buyer_id
        total_price
        sale_unit_price
        total_qty
        sku_deal_id
      }
      supplier {
        name
        alias_name
        minimum_order
        current_order
        logo
        image
      }
    }
  }
`;
