import gql from 'graphql-tag';

export const addBankDetail = gql`
  mutation addBankDetail($bankId: Int!, $accountNumber: String!, $accountHolderName: String!) {
    addBankDetail(bankId: $bankId, accountNumber: $accountNumber, accountHolderName: $accountHolderName) {
      id
      bank {
        bank_name
        acronym
      }
      account_number
      account_name
    }
  }
`;

export const getEwalletTransactions = gql`
  query getEwalletTransactions($page: Int!, $perPage: Int) {
    getEwalletTransactions(page: $page, perPage: $perPage) {
      id
      description
      amount
      created_at
      eWallet {
        currency_code
        currency_symbol
      }
      type {
        name
      }
      status {
        name
      }
    }
  }
`;

export const getEwalletBalance = gql`
  query getEwalletBalance {
    getEwalletBalance {
      available
      pending_withdraw
      locked
    }
  }
`;

export const topUpEwallet = gql`
  mutation topUpEwallet($method: ScalarEwalletTopUpMethod!, $amount: Int!, $bankShortCode: String) {
    topUpEwallet(method: $method, amount: $amount, bankShortCode: $bankShortCode) {
      status
      amount
      expiredAt
      paymentMethod {
        type
        qrCodeDisplayImage
        instructions {
          bankShortCode
          accountNo
        }
      }
    }
  }
`;

export const getBanks = gql`
  query getBanks {
    getBanks {
      id
      bank_name
      country_id
      acronym
    }
  }
`;

export const getBankDetailUser = gql`
  query getBankDetailUser {
    getBankDetailUser {
      id
      bank {
        bank_name
        acronym
      }
      account_number
      account_name
    }
  }
`;

export const withdrawEwallet = gql`
  mutation withdrawEwallet($bankDetailId: Int!, $amount: Float!) {
    withdrawEwallet(bankDetailId: $bankDetailId, amount: $amount) {
      status
      amount
      disbursementMethod {
        bankAccountNo
        bankShortCode
        bankAccountHolderName
        serverBankAccountHolderName
        bankName
      }
    }
  }
`;

export const setRefundToEwallet = gql`
  mutation setRefundToEwallet($refundToEwallet: Boolean) {
    setRefundToEwallet(refundToEwallet: $refundToEwallet) {
      id
      is_refund_to_e_wallet
    }
  }
`;
