import gql from 'graphql-tag';

export const groupBuyCheckout = gql`
  mutation groupBuyCheckout(
    $payment_method: String
    $stripePaymentType: String
    $stripe_customer_id: String
    $stripe_card_id: String
    $voucherDiscount: String
    $voucherDiscountType: String
    $voucherDiscountUpperLimit: String
    $vouchercode: String
    $voucherMinimumAmount: String
    $userState: String
    $cartItems: [GroupBuyCheckoutInputCardItem]
  ) {
    groupBuyCheckout(
      payment_method: $payment_method
      stripePaymentType: $stripePaymentType
      stripe_customer_id: $stripe_customer_id
      stripe_card_id: $stripe_card_id
      voucherDiscount: $voucherDiscount
      voucherDiscountType: $voucherDiscountType
      voucherDiscountUpperLimit: $voucherDiscountUpperLimit
      vouchercode: $vouchercode
      voucherMinimumAmount: $voucherMinimumAmount
      userState: $userState
      cartItems: $cartItems
    ) {
      payment_status_id
      order_status_id
      id
      payment_b2c_id
      stripe_transaction_id
      delivery_date
      stripe_session
      items {
        id
        order_id
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
        order_item_status {
          name
        }
        hub {
          alias_name
        }
        sku {
          name
          b2c_unit_price
          b2c_unit_per_oom
          b2c_weight
          product {
            name
            tenant {
              tenant {
                name
              }
            }
          }
        }
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
      }
    }
  }
`;

export const stripeCheckout = gql`
  mutation($data: CheckoutSessionRequestData!) {
    stripeCheckout(data: $data) {
      id
      url
    }
  }
`;

export const stripeCheckoutSuccessful = gql`
  mutation stripeCheckoutSuccessful(
    $paymentId: String
    $paymentTxId: String
    $paymentB2cId: Int!
    $cartItems: [GroupBuyCheckoutInputCardItem]
  ) {
    stripeCheckoutSuccessful(
      paymentId: $paymentId
      paymentTxId: $paymentTxId
      paymentB2cId: $paymentB2cId
      cartItems: $cartItems
    )
  }
`;

export const stripeCheckoutFailed = gql`
  mutation stripeCheckoutFailed($paymentB2cId: Int!, $errorMessage: String) {
    stripeCheckoutFailed(paymentB2cId: $paymentB2cId, errorMessage: $errorMessage)
  }
`;
