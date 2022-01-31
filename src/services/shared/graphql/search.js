import gql from 'graphql-tag';

export const searchProducts = gql`
  query searchProducts($keyword: String, $hubId: Int, $supplierId: Int, $limit: Int, $offset: Int) {
    searchProducts(
      keyword: $keyword
      hubId: $hubId
      supplierId: $supplierId
      limit: $limit
      offset: $offset
    ) {
      active
      category_id
      created_at
      id
      image
      name
      skus {
        active
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
      updated_at
      voucherify_id
      tenant {
        tax_rate
        tenant {
          id
          name
        }
      }
    }
  }
`;

export const queryHubByCountryId = gql`
  query getHubByCountryId($country_id: Int!) {
    getHubByCountryId(country_id: $country_id) {
      active
      alias_name
      hub
      id
      name
    }
  }
`;

export const searchProductsPaginate = gql`
  query searchProductsPaginate(
    $keyword: String
    $hubId: Int
    $supplierId: Int
    $limit: Int
    $offset: Int
    $state: String
    $country: String
  ) {
    searchProductsPaginate(
      keyword: $keyword
      hubId: $hubId
      supplierId: $supplierId
      limit: $limit
      offset: $offset
      state: $state
      country: $country
    ) {
      total_count
      items {
        active
        category_id
        created_at
        id
        image
        name
        skus {
          active
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
            active
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
            id
            name
          }
        }
      }
    }
  }
`;
