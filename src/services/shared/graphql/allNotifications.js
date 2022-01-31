import gql from 'graphql-tag';

export const deleteUserNotification = gql`
  mutation($notificationId: Int!) {
    deleteUserNotification(id: $notificationId) {
      created_at
      id
      read
      title
      message
      payload
      target_user_id
    }
  }
`;

export const readAllUserNotifications = gql`
  mutation($userId: Int) {
    readAllUserNotifications(read: true, userId: $userId)
  }
`;

export const getAllUserNotifications = gql`
  query($userId: Int) {
    getUserNotifications(userId: $userId) {
      created_at
      id
      read
      title
      message
      payload
      target_user_id
      type
    }
  }
`;

export const getUserNotification = gql`
  query($notificationId: Int) {
    getUserNotification(id: $notificationId) {
      created_at
      id
      read
      title
      message
      payload
      target_user_id
      type
    }
  }
`;

export const updateUserNotification = gql`
  mutation($notificationId: Int!) {
    updateUserNotification(
      title: null
      notificationId: $notificationId
      message: null
      read: true
      payload: null
    ) {
      created_at
      id
      read
      title
      message
      type
      payload
      target_user_id
    }
  }
`;

export const getUnreadNotificationCount = gql`
  query getUnreadNotificationCount {
    getUnreadNotificationCount
  }
`;
