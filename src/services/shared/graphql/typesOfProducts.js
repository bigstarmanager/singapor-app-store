import gql from 'graphql-tag';
export const topPicks = gql`
  query getPopularProducts($collection_point: Int, $countryId: Int!, $state: String) {
    getPopularProducts(collection_point: $collection_point, countryId: $countryId, state: $state) {
      active
      category_id
      id
      image
      name
      skus {
        b2c_unit_per_oom
        b2c_unit_price
        b2c_market_unit_price
        is_b2c_pooling
        price
        halal
        inventories {
          price
          quantity
        }
        b2c
        oom {
          name
        }
        uom {
          name
        }
        sku_deals {
          id
          quantity
          discount
        }
        market_unit_price
        name
        is_order_by_weight
        active
        weight
        tax_rate
      }
      tenant_id
      voucherify_id
      tenant {
        tax_rate
        tenant {
          name
        }
      }
    }
  }
`;
export const hotDeals = gql`
  query getHotDiscountProductsB2C($hubId: Int, $countryId: Int!, $state: String) {
    getHotDiscountProductsB2C(hubId: $hubId, countryId: $countryId, state: $state) {
      active
      category_id
      id
      image
      name
      skus {
        b2c_unit_per_oom
        b2c_unit_price
        b2c_market_unit_price
        is_b2c_pooling
        price
        inventories {
          price
          quantity
        }
        b2c
        halal
        oom {
          name
        }
        uom {
          name
        }
        sku_deals {
          id
          quantity
          discount
        }
        market_unit_price
        name
        is_order_by_weight
        active
        weight
        tax_rate
      }
      tenant_id
      voucherify_id
      tenant {
        tax_rate
        tenant {
          name
        }
      }
      discount
    }
  }
`;
export const volumeDeals = gql`
  query getVolumeDealProducts($hubId: Int, $countryId: Int!, $state: String) {
    getVolumeDealProducts(hubId: $hubId, countryId: $countryId, state: $state) {
      id
      name
      image
      tenant {
        tax_rate
        tenant {
          name
        }
      }
      skus {
        sku_deals {
          sku_id
          quantity
          discount
          rank
          default
        }
        b2c
        price
        halal
        tax_rate
        uom {
          name
        }
        b2c_uom {
          name
        }
        b2c_oom {
          name
        }
        b2c_uom_id
        b2c_weight
        b2c_oom_id
        b2c_packaging
        b2c_unit_price
        b2c_pooling_qty
        b2c_unit_per_oom
        b2c_market_unit_price
        b2c_total_market_price
        is_b2c_pooling
        inventories {
          price
          quantity
        }
      }
    }
  }
`;
