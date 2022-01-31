import gql from 'graphql-tag';

const requestData = `{
  address {
    id
    customer_id
    floor_number
    street_number
    road
    building
    unit
    stall
    city
    state
    postal_code
    latlng
    country_id
    address_type_id
    active
  }
  birth_date
  buyer_type
  country {
    id
    name
    description
    currency_code
    currency_symbol
  }
  email
  first_name
  gender
  id
  image
  last_name
  mobile
  stripe_card_id
  stripe_customer_id
  tokenJWT
  token
  email
  type {
    id
    name
    description
  }
  tenant {
    id
    registration_number
    tax_registration_number
    tax_rate
    building_name
    street_name
    unit_number
    email
    first_name
    last_name
    email_notification
    class_id
    default_credit_card_term
    tenant {
      id
      name
    }
    xeroIntegration {
      xero_tenant_id
    }
  }
  user_type_id
  username
}`;

export const loginDashboard = gql`
  mutation($identity: String!, $password: String!) {
    signIn(identity: $identity, password: $password) ${requestData}
  }
`;

export const requestJWT = gql`
  mutation($oldToken: String!) {
    requestJWT(oldToken: $oldToken) ${requestData}
  }
`;

export const me = gql`
  mutation {
    me ${requestData}
  }
`;

export const getSeletedHub = gql`
  query getSelectedHub {
    getSelectedHub {
      tutorial_tick_status
      hub {
        alias_name
        beef_products
        delivery_charge
        halal_products
        hub
        hub_can_delivery
        id
        name
        whatsapp_link
        defaultAddress {
          asString2
        }
      }
    }
  }
`;

export const signInWithOTPRequest = gql`
  mutation($phoneNumber: String!) {
    signInWithOTP(phoneNumber: $phoneNumber) {
      birth_date
      __typename
    }
  }
`;

export const signInWithOTP = gql`
  mutation($phoneNumber: String!, $OTP: String!) {
    signInWithOTP(phoneNumber: $phoneNumber, OTP: $OTP)  ${requestData}
  }
`;
