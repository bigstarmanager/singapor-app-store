import gql from 'graphql-tag';

export const getAllProducts = gql`
  query getAllProducts($hubId: Int, $state: String, $country: String) {
    getAllProducts(hubId: $hubId, state: $state, country: $country) {
      top_picks {
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
          sku_deals {
            id
            quantity
            discount
          }
        }
      }
      discounts {
        id
        discount
        name
        image
        tenant_id
        tenant {
          tax_rate
          tenant {
            name
          }
        }
        max_amount
        max_price
        skus {
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
          sku_deals {
            id
            quantity
            discount
          }
        }
      }
      group_buy {
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
          sku_deals {
            id
            quantity
            discount
          }
        }
      }
      suppliers {
        logo
        tenant {
          name
          id
          alias_name
        }
      }
      categories {
        active
        description
        id
        name
        image
        subCategory {
          active
          description
          id
          name
        }
      }
      volume_deals {
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
          sku_deals {
            id
            quantity
            discount
          }
        }
      }
    }
  }
`;
