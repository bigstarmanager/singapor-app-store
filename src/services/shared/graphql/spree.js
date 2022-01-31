import gql from 'graphql-tag';

export const getAllSprees = gql`
  query getAllSprees($active: Boolean!, $status: Int!) {
    getAllSprees(active: $active, status: $status) {
      id
      advocate_id
      hub_id
      tenant_id
      delivery_date
      start_date
      end_date
      Status
      hub {
        id
        name
        alias_name
      }
      tenant {
        id
        tenant {
          name
          alias_name
          minimum_order
        }
        tax_rate
      }
      active
      pre_order_data {
        id
        delivery_date
        order_status_id
        order_status {
          name
        }
        charge_date
        stripe_transaction_id
        pre_order_item {
          id
          sku_id
          sku_deal_id
          user {
            id
            first_name
            last_name
            mobile
          }
          order_item_status_id
          order_item_status {
            name
          }
          sku {
            name
            is_b2c_pooling
            b2c_pooling_qty
            tax_rate
            image
            halal
          }
          sale_unit_price
          total_qty
          total_price
          tax
          customer_buyer_id
          origin_unit_price
          original_total_price
          original_sale_unit_price
          original_tax
        }
      }
    }
  }
`;

export const getOpenSpreeByHubId = gql`
  query($status: Int!, $active: Boolean!, $hub_id: Int!) {
    getAllSprees(status: $status, active: $active, hubId: $hub_id) {
      id
      Status
      delivery_date
      start_date
      end_date
      tenant_id
    }
  }
`;

export const getAvailableSprees = gql`
  query($hub_id: Int, $tenant_id: Int) {
    getAvailableSprees(hubId: $hub_id, tenantId: $tenant_id) {
      id
      Status
      delivery_date
      start_date
      end_date
      tenant_id
    }
  }
`;

export const getPoolingDetails = gql`
  query($skuId: Int!, $hubId: Int!, $deliveryDate: String!) {
    getAllPoolings(skuId: $skuId, hubId: $hubId, deliveryDate: $deliveryDate) {
      full_name
      mobile
      item_type
      pooling_qty
      non_pooling_qty
      successfully_pooled
      pending_pooling
    }
  }
`;
