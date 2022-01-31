import gql from 'graphql-tag';

export const queryAllSuppliers = gql`
  query getAllSuppliers($hubId: Int, $state: String) {
    getAllSuppliers(hubId: $hubId, state: $state) {
      id
      logo
      tenant {
        name
        id
      }
    }
  }
`;

export const getProductsBySupplier = gql`
  query getProductsBySupplier($supplierId: Int, $mainCategory: Int, $selectedHubId: Int) {
    getProductsBySupplier(
      supplierId: $supplierId
      mainCategory: $mainCategory
      selectedHubId: $selectedHubId
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
        logo
        tax_rate
        tenant {
          id
          name
        }
      }
    }
  }
`;

export const getSupplierByCusId = gql`
  query getSupplierByCusId($customerId: Int!) {
    getSupplierByCusId(customerId: $customerId) {
      name
      alias_name
      tenant {
        id
        logo
      }
    }
  }
`;
