import gql from 'graphql-tag';

export const getAllOrdersPaginate = gql`
  query allOrdersPaginate($hub_id: Int, $status_id: [Int]!, $user_id: Int!, $limit: Int, $offset: Int) {
    allOrdersPaginate(
      active: true
      hub_id: $hub_id
      status_id: $status_id
      user_id: $user_id
      limit: $limit
      offset: $offset
    ) {
      total_count
      items {
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
          payment_transaction_id
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
          discount
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
            id
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
              address_type_id
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
        }
      }
    }
  }
`;

export const cancelB2cOrderItem = gql`
  mutation cancelB2cOrderItem($id: Int!) {
    cancelB2cOrderItem(id: $id) {
      id
      order_status_id
      po_number
      standalone
      delivery_date
      delivery_time
      stripe_transaction_id
      charge_date
      close_date
      payment_date
      payment_status_id
      payment_b2c_id
      created_at
      updated_at
      last_user_id
      description
      token
      active
      pre_order_item {
        id
        order_id
        sku_id
        product_type_id
        user_id
        driver_collect_user_id
        driver_delivery_user_id
        customer_buyer_id
        customer_seller_id
        group_id
        invoice_id
        amount_qty
        total_qty
        origin_unit_price
        sale_unit_price
        total_price
        tax
        discount
        original_sale_unit_price
        original_total_price
        original_tax
        sku_deal_id
        cod
        created_at
        updated_at
        last_user_id
        description
        order_item_status_id
        status_note
        active
        sku {
          name
        }
        order_item_status {
          name
        }
        hub {
          alias_name
        }
      }
      order_status {
        id
        name
      }
      paymentB2c {
        stripe_transaction_id
      }
    }
  }
`;

export const getB2cBadgeOrderMenu = gql`
  query getB2cBadgeOrderMenu {
    getB2cBadgeOrderMenu {
      preparing
      to_collect
      collected
      cancelled
    }
  }
`;

export const updatePreOrderItemCollectedReadStatus = gql`
  mutation updatePreOrderItemCollectedReadStatus($userId: Int) {
    updatePreOrderItemCollectedReadStatus(userId: $userId)
  }
`;

export const updatePreOrderItemCancelledReadStatus = gql`
  mutation updatePreOrderItemCancelledReadStatus($userId: Int) {
    updatePreOrderItemCancelledReadStatus(userId: $userId)
  }
`;
