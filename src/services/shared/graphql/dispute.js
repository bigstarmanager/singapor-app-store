import gql from 'graphql-tag';

export const getAllOngoingDisputes = gql`
  query getAllOngoingDisputes($userId: Int) {
    getAllOngoingDisputes(userId: $userId) {
      id
      pre_order_item_id
      status_id
      issue_id
      resolution_id
      description
      quantity
      refunded_amount
      created_at
      updated_at
      active
      preOrderItem {
        id
        order_id
        sku_id
        product_type_id
        user_id
        driver_collect_user_id
        driver_delivery_user_id
        customer_seller_id
        customer_buyer_id
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
        active
        order_item_status_id
        status_note
        sku {
          id
          product_id
          voucherify_sku_id
          is_order_by_weight
          name
          vendor_code
          is_sample
          alias
          halal
          perishable
          oom_id
          uom_id
          unit_per_oom
          increment_qty
          weight
          price
          market_unit_price
          total_price
          total_market_price
          tax_rate
          image
          specs
          country_of_origin
          b2c_uom_id
          b2c_unit_per_oom
          b2c_increment_qty
          b2c_unit_price
          b2c_market_unit_price
          b2c_total_price
          b2c_pooling_qty
          b2c_packaging
          b2c_weight
          b2c_oom_id
          is_b2c_pooling
          description
          is_slack_notifiable
          active
          created_at
          updated_at
          oom {
            name
          }
          uom {
            name
          }
          product {
            id
            tenant_id
            name
            image
            category_id
            voucherify_id
            active
            created_at
            updated_at
          }
        }
        hub {
          id
          name
          alias_name
          account_number
          password
          is_private
          group_id
          customer_type_id
          collection_type_id
          profile
          halal_products
          beef_products
          cod
          credit_term
          payment_type
          delivery_instruction
          delivery_charge
          minimum_order
          hub
          active
          xero_id
          voucherify_id
          direction
          hub_delivery_fee
          hub_can_delivery
          whatsapp_link
          storecove_id
          tenant_id
        }
      }
      status {
        id
        name
        description_for_customer
        description_for_supplier
        active
      }
      issue {
        id
        name
        description
        active
      }
      resolution {
        id
        name
        description
        active
      }
      histories {
        id
        dispute_id
        status_id
        resolution_id
        description
        created_by
        created_at
        active
      }
    }
  }
`;

export const getAllCompletedDisputes = gql`
  query getAllCompletedDisputes($userId: Int) {
    getAllCompletedDisputes(userId: $userId) {
      id
      pre_order_item_id
      status_id
      issue_id
      resolution_id
      description
      quantity
      refunded_amount
      created_at
      updated_at
      active
      preOrderItem {
        id
        order_id
        sku_id
        product_type_id
        user_id
        driver_collect_user_id
        driver_delivery_user_id
        customer_seller_id
        customer_buyer_id
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
        active
        order_item_status_id
        status_note
        sku {
          id
          product_id
          voucherify_sku_id
          is_order_by_weight
          name
          vendor_code
          is_sample
          alias
          halal
          perishable
          oom_id
          uom_id
          unit_per_oom
          increment_qty
          weight
          price
          market_unit_price
          total_price
          total_market_price
          tax_rate
          image
          specs
          country_of_origin
          b2c_uom_id
          b2c_unit_per_oom
          b2c_increment_qty
          b2c_unit_price
          b2c_market_unit_price
          b2c_total_price
          b2c_pooling_qty
          b2c_packaging
          b2c_weight
          b2c_oom_id
          is_b2c_pooling
          description
          is_slack_notifiable
          active
          created_at
          updated_at
          oom {
            name
          }
          uom {
            name
          }
          product {
            id
            tenant_id
            name
            image
            category_id
            voucherify_id
            active
            created_at
            updated_at
          }
        }
        hub {
          id
          name
          alias_name
          account_number
          password
          is_private
          group_id
          customer_type_id
          collection_type_id
          profile
          halal_products
          beef_products
          cod
          credit_term
          payment_type
          delivery_instruction
          delivery_charge
          minimum_order
          hub
          active
          xero_id
          voucherify_id
          direction
          hub_delivery_fee
          hub_can_delivery
          whatsapp_link
          storecove_id
          tenant_id
        }
      }
      status {
        id
        name
        description_for_customer
        description_for_supplier
        active
      }
      issue {
        id
        name
        description
        active
      }
      resolution {
        id
        name
        description
        active
      }
      histories {
        id
        dispute_id
        status_id
        resolution_id
        description
        created_by
        created_at
        active
        attachments {
          file_name
        }
      }
    }
  }
`;

export const getB2cDisputeIssuesAndResolutions = gql`
  query getB2cDisputeIssuesAndResolutions {
    getB2cDisputeIssuesAndResolutions {
      issues {
        id
        name
      }
      resolutions {
        id
        name
      }
    }
  }
`;

export const cancelB2cDispute = gql`
  mutation cancelB2cDispute($id: Int!) {
    cancelB2cDispute(id: $id)
  }
`;

export const resolveB2cDispute = gql`
  mutation resolveB2cDispute($id: Int!) {
    resolveB2cDispute(id: $id)
  }
`;

export const acceptRejectedB2cDispute = gql`
  mutation acceptRejectedB2cDispute($id: Int!) {
    acceptRejectedB2cDispute(id: $id)
  }
`;

export const appealRejectedB2cDispute = gql`
  mutation appealRejectedB2cDispute($item: B2cAppealDisputeItemInput!) {
    appealRejectedB2cDispute(item: item)
  }
`;
