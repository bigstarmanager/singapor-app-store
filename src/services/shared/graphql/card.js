import gql from 'graphql-tag';

export const addStripeCard = gql`
  mutation addStripeCard($cardNumber: String!, $expYear: Int!, $expMonth: Int!, $cvc: String!) {
    addStripeCard(cardNumber: $cardNumber, expYear: $expYear, expMonth: $expMonth, cvc: $cvc) {
      ... on DefaultStripeCardResponse {
        paymentMethodId
        stripeCustomerId
        card {
          brand
          country
          funding
        }
      }
      ... on CardErrorResponse {
        error
        message
      }
    }
  }
`;

export const listCustomerCard = gql`
  query getListStripeCard {
    listCustomerCard {
      __typename
      ... on ListCustomerCard {
        data {
          id
          object
          customer
          type
          card {
            brand
            exp_month
            exp_year
            country
            funding
            last4
            fingerprint
          }
          created
        }
        has_more
      }
      ... on CardErrorResponse {
        error
        message
      }
    }
  }
`;

// export const removeStripeCard = gql`
//   mutation removeStripeCard($paymentMethodId: String!) {
//     removeStripeCard(paymentMethodId: $paymentMethodId) {
//       ... on DefaultStripeCardResponse {
//         paymentMethodId
//         stripeCustomerId
//       }
//       ... on CardErrorResponse {
//         error
//         message
//       }
//     }
//   }
// `;

export const removeStripeCard = gql`
  mutation removeStripeCard($cardNumber: String!) {
    removeStripeCard(paymentMethodId: $cardNumber) {
      ... on DefaultStripeCardResponse {
        paymentMethodId
        stripeCustomerId
      }
      ... on CardErrorResponse {
        error
        message
      }
    }
  }
`;

export const setDefault = gql`
  mutation setDefault($cardNumber: String!) {
    setDefaultStripeCard(paymentMethodId: $cardNumber) {
      ... on DefaultStripeCardResponse {
        paymentMethodId
        stripeCustomerId
      }
      ... on CardErrorResponse {
        error
        message
      }
    }
  }
`;

export const getDefault = gql`
  query getDefault {
    getDefaultCard {
      ... on DefaultStripeCardResponse {
        paymentMethodId
        stripeCustomerId
        card {
          brand
          exp_month
          exp_year
          country
          funding
          last4
          fingerprint
        }
      }
      ... on CardErrorResponse {
        error
        message
      }
    }
  }
`;
