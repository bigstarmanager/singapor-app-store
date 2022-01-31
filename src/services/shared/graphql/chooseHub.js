import gql from 'graphql-tag';

export const queryHubByCountryId = gql`
  query getHubByCountryId($country_id: Int!) {
    getHubByCountryId(country_id: $country_id) {
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
      alias_name
      beef_products
      cod
      defaultAddress {
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
        asString2
      }
      delivery_charge
      halal_products
      hub
      hub_can_delivery
      hub_delivery_fee
      id
      name
      whatsapp_link
    }
  }
`;
export const getCPByDistance = gql`
  query getCPByDistance(
    $countryId: Int!
    $onlyOpen: Boolean
    $onlyHalal: Boolean
    $lat: Float
    $lng: Float
    $postalCode: String
    $distance: Int!
  ) {
    getCPByDistance(
      countryId: $countryId
      onlyOpen: $onlyOpen
      onlyHalal: $onlyHalal
      lat: $lat
      lng: $lng
      postalCode: $postalCode
      distance: $distance
    ) {
      id
      name
      alias_name
      halal_products
      hub
      distance
      road
      city
      postal_code
      latlng
      active
      is_private
      whatsapp_link
      hubSpreeData {
        id
        Status
        active
      }
      advocateList {
        id
        first_name
        last_name
        first_and_sur_name
      }
    }
  }
`;
export const mutationChooseHub = gql`
  mutation joinHub($hubId: Int!) {
    joinHub(hub_id: $hubId)
  }
`;
export const signInPrivateHub = gql`
  query signInPrivateHub($identity: Int!, $password: String!) {
    signInPrivateHub(identity: $identity, password: $password)
  }
`;
