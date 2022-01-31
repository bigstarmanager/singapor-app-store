import gql from 'graphql-tag';

export const countries = gql`
  query {
    allCountries(active: true) {
      id
      name
      description
    }
  }
`;
