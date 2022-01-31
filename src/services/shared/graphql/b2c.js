import gql from 'graphql-tag';

export const checkVoucher = gql`
  mutation checkVoucher($vouchercode: String!) {
    checkVoucher(vouchercode: $vouchercode)
  }
`;

export const voucherValidation = gql`
  mutation voucherValidation(
    $vouchercode: String!
    $metadataB2b: Boolean
    $metadataB2c: Boolean
    $metadataState: String
    $totalAmount: Float
    $orderItems: [CartItemInput]!
  ) {
    voucherValidation(
      vouchercode: $vouchercode
      metadataB2b: $metadataB2b
      metadataB2c: $metadataB2c
      metadataState: $metadataState
      totalAmount: $totalAmount
      orderItems: $orderItems
    )
  }
`;

export const b2c_addItemToCart = gql`
  mutation addItemToCart($item: CartItemInput!) {
    addItemToCart(item: $item) {
      created_at
      customer_id
      id
      updated_at
      user_id
      items {
        cart_id
        created_at
        id
        order_quantity
        order_weight
        price
        sku {
          active
          alias
          b2c
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
          country_of_origin
          created_at
          description
          halal
          id
          image
          increment_qty
          is_b2c_pooling
          is_order_by_weight
          is_sample
          is_slack_notifiable
          market_unit_price
          name
          oom_id
          perishable
          price
          product_id
          specs
          tax_rate
          total_market_price
          total_price
          unit_per_oom
          uom_id
          updated_at
          vendor_code
          voucherify_sku_id
          weight
        }
        sku_id
        updated_at
      }
    }
  }
`;

export const getAllVouchers = gql`
  query getAllVouchers(
    $metadataB2b: Boolean
    $metadataB2c: Boolean
    $totalAmount: Float
    $orderItems: [CartItemInput]!
  ) {
    getAllVouchers(
      metadataB2b: $metadataB2b
      metadataB2c: $metadataB2c
      totalAmount: $totalAmount
      orderItems: $orderItems
    )
  }
`;
