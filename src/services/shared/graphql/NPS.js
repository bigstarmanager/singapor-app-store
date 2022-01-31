import gql from 'graphql-tag';

export const getNpsByUserId = gql`
  query getNpsByUserId($user_id: Int!) {
    getNpsByUserId(user_id: $user_id) {
      stars
      user_id
      created_at
      updated_at
    }
  }
`;

export const addNps = gql`
  mutation addNps($stars: Int!) {
    addNps(stars: $stars) {
      stars
      user_id
      created_at
      updated_at
    }
  }
`;
