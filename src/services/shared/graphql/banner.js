import gql from 'graphql-tag';

export const getBanners = gql`
  query banners($publicationState: PublicationState, $where: JSON, $sort: String) {
    banners(publicationState: $publicationState, where: $where, sort: $sort) {
      id
      created_at
      updated_at
      name
      state {
        id
        name
      }
      country {
        id
        name
      }
      DeepLink
      published_at
      banner_sequence
      image {
        id
        created_at
        updated_at
        name
        alternativeText
        caption
        width
        height
        formats
        hash
        ext
        mime
        size
        url
        previewUrl
      }
    }
  }
`;
