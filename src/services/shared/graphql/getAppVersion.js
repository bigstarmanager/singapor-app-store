import gql from 'graphql-tag';

export const getAppVersion = gql`
  query($appType: Int!) {
    getAppVersion(appType: $appType) {
      id
      version
      android
      ios
      web
      app_type
    }
  }
`;
