import gql from 'graphql-tag';

const getCurrentUserData = `{
  active
  address {
      active
      address_type_id
      building
      city
      country {
          active
          currency_code
          currency_symbol
          description
          id
          name
      }
      country_id
      customer_id
      floor_number
      id
      is_default
      latlng
      postal_code
      road
      stall
      state
      street_number
      type {
          active
          description
          id
          name
      }
      unit
  }
  birth_date
  buyer_type
  country {
      active
      currency_code
      currency_symbol
      description
      id
      name
  }
  country_id
  email
  eWallet {
    is_refund_to_e_wallet
  }
  first_name
  gender
  id
  image
  last_name
  mobile
  stripe_card_id
  stripe_customer_id
  tenant {
      building_name
      class_id
      default_credit_card_term
      email
      email_notification
      first_name
      id
      last_name
      registration_number
      street_name
      tax_rate
      tax_registration_number
      tenant {
          account_number
          active
          alias_name
          beef_products
          cod
          collection_type_id
          credit_term
          customer_type_id
          delivery_charge
          delivery_instruction
          direction
          group_id
          halal_products
          hub
          hub_can_delivery
          hub_delivery_fee
          id
          minimum_order
          name
          payment_type
          peppol_scheme_id
          profile
          storecove_id
          tenant_id
          voucherify_id
          whatsapp_link
          xero_id
      }
      unit_number
      xeroIntegration {
          active
          created_at
          created_by
          id
          tenant {
              building_name
              class_id
              default_credit_card_term
              email
              email_notification
              first_name
              id
              last_name
              registration_number
              street_name
              tax_rate
              tax_registration_number
              unit_number
          }
          tenant_id
          updated_at
          updated_by
          xero_tenant_id
          xero_token_set
      }
  }
  token
  tokenJWT
  type {
      active
      description
      id
      name
  }
  user_type_id
  username
}`;

export const getCurrentUser = gql`
mutation me {
  me ${getCurrentUserData}
}
`;

const updateProfileData = `
{
  updateUser(
    firstName: $firstName
    lastName: $lastName
    gender: $gender
    birthDate: $birthDate
    mobile: $mobile
    email: $email
  )
}`;
export const updateProfile = gql`
mutation updateUser(
    $firstName: String
    $lastName: String
    $gender: String
    $birthDate: String
    $mobile: String
    $email: String
) ${updateProfileData}
`;

export const updatePassword = gql`
  mutation updatePassword($userId: Int!, $password: String!) {
    updatePassword(userId: $userId, password: $password) {
      id
      first_name
      last_name
      mobile
    }
  }
`;

export const updateLanguage = gql`
  mutation updateLanguage($language: String!) {
    updateLanguage(language: $language) {
      language
    }
  }
`;

export const deleteUserAccount = gql`
  mutation deleteUserAccount($userId: Int!) {
    deleteUserAccount(userId: $userId)
  }
`;
