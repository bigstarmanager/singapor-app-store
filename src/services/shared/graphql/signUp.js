import gql from 'graphql-tag';

export const checkUserOtp = gql`
  mutation checkUser($email: String, $mobile: String, $otp: String) {
    checkUser(email: $email, mobile: $mobile, otp: $otp) {
      email
      mobile
      first_name
      last_name
    }
  }
`;

export const checkUser = gql`
  query checkUser($email: String, $mobile: String, $otp: String) {
    checkUser(email: $email, mobile: $mobile, otp: $otp) {
      email
      mobile
      first_name
      last_name
      __typename
    }
  }
`;

export const getUserByMobile = gql`
  query getUserByMobile($mobile: String!, $otp: String) {
    getUserByMobile(mobile: $mobile, otp: $otp) {
      id
      mobile
      __typename
    }
  }
`;

export const updatePassword = gql`
  mutation updatePassword($userId: Int!, $password: String!) {
    updatePassword(userId: $userId, password: $password) {
      id
      first_name
      last_name
      mobile
      __typename
    }
  }
`;

export const userSignUp = gql`
  mutation addUser(
    $first_name: String!
    $last_name: String!
    $country_id: Int!
    $customer_id: Int!
    $mobile: String!
    $user_type_id: Int!
    $buyer_type: Int!
    $password: String!
    $email: String
  ) {
    addUser(
      item: {
        first_name: $first_name
        last_name: $last_name
        country_id: $country_id
        customer_id: $customer_id
        email: $email
        mobile: $mobile
        user_type_id: $user_type_id
        buyer_type: $buyer_type
        password: $password
      }
    )
  }
`;
