import gql from 'graphql-tag';
export const products = gql`
  query products(
    $active: Boolean
    $mainCategory: Int
    $subCategory: Int
    $page: Int
    $perPage: Int
    $tenantCustomerId: Int
    $hubId: Int
    $state: String
    $country: String
  ) {
    products(
      active: $active
      mainCategory: $mainCategory
      subCategory: $subCategory
      page: $page
      perPage: $perPage
      tenantCustomerId: $tenantCustomerId
      hubId: $hubId
      state: $state
      country: $country
    ) {
      active
      category_id
      created_at
      id
      image
      name
      skus {
        id
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
        b2c_uom {
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
      updated_at
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
