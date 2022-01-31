import gql from 'graphql-tag';

export const queryAllCategories = gql`
  query categories($active: Boolean, $supplierId: Int, $hubId: Int, $state: String, $country: String) {
    categories(active: $active, supplierId: $supplierId, hubId: $hubId, state: $state, country: $country) {
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
  }
`;
