import gql from 'graphql-tag';

export const getProductDetailB2c = gql`
  query getProductDetailB2c($product_id: Int!, $product_type_id: Int!) {
    getProductDetailB2c(product_id: $product_id, product_type_id: $product_type_id) {
      id
      name
      tax_rate
      max_amount
      max_market_price
      max_price
      min_amount
      min_market_price
      min_price
      image
      discount
      skus {
        product {
          tenant {
            tax_rate
            logo
            tenant {
              id
              name
              alias_name
            }
          }
        }
        id
        name
        halal
        specs
        description
        country_of_origin
        is_b2c_pooling
        b2c_pooling_qty
        b2c_increment_qty
        b2c_weight
        tax_rate
        b2c_unit_price
        b2c_unit_per_oom
        b2c_packaging
        b2c_market_unit_price
        uom {
          name
        }
        oom {
          name
        }
        inventories {
          id
          customer_id
          quantity
          rank
        }
      }
    }
  }
`;

export const getSkuDeals = gql`
  query getSkuDeals($active: Boolean!, $skuId: Int) {
    getSkuDeals(active: $active, skuId: $skuId) {
      id
      sku_id
      quantity
      discount
      rank
      default
      active
    }
  }
`;
