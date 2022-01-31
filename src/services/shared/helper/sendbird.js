import { isPlatform } from '@ionic/vue';
import SendBird from 'sendbird';
import Vue from 'vue';
import SendBirdSyncManager from 'sendbird-syncmanager';

// const appId = process.env.SENDBIRD_APP_ID;
// const sendbirdToken = process.env.SENDBIRD_TOKEN;

const { VUE_APP_SENDBIRD_TOKEN: sendbirdToken, VUE_APP_SENDBIRD_APP_ID: appId } = process.env;

export const sb = new SendBird({ appId: appId });

let currentChannel = undefined;
let currentChannelMessageListQuery = undefined;
let fcmToken;

export default {
  /**
   * @function connect
   * @param {number} userId
   * @description Login/Register a user to SendBird application
   */
  connect(userId, accessToken) {
    let self = this;
    return new Promise((resolve, reject) => {
      SendBirdSyncManager.sendBird = sb;
      const options = new SendBirdSyncManager.Options();
      options.messageCollectionCapacity = 2000;
      options.messageResendPolicy = 'automatic';
      options.automaticMessageResendRetryCount = 5;
      options.maxFailedMessageCountPerChannel = 50;
      options.failedMessageRetentionDays = 7;

      SendBirdSyncManager.setup(userId, options, () => {
        const query = sb.GroupChannel.createMyGroupChannelListQuery();
        query.limit = 50;
        query.includeEmpty = false;
        query.order = 'latest_last_message';

        new SendBirdSyncManager.ChannelCollection(query);
        const collectionHandler = new SendBirdSyncManager.ChannelCollection.CollectionHandler();
        collectionHandler.onChannelEvent = (action, channels) => {
          console.log('channels', channels);
          switch (action) {
            case 'insert': {
              break;
            }
            case 'update': {
              break;
            }
            case 'move': {
              break;
            }
            case 'remove': {
              break;
            }
            case 'clear': {
              break;
            }
          }
        };
        sb.connect(userId, accessToken, function (user, error) {
          if (error) reject(new Error(`Login Failed: ${error}`));
          self.setTokenForPushNotification();
          resolve(user);
        });
      });
    });
  },

  // Probably need to create a function from backend to prevent revealing token
  async getUserToken(userId) {
    const res = await fetch(`https://api-${appId}.sendbird.com/v3/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Api-Token': sendbirdToken
      }
    });
    const result = res.json();
    return result;
  },
  // craete user sendbird
  async createUserAccount(userId, nickname) {
    const res = await fetch(`https://api-${appId}.sendbird.com/v3/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Token': sendbirdToken
      },
      body: JSON.stringify({
        user_id: userId,
        nickname: nickname,
        profile_url: '',
        issue_access_token: true,
        issue_session_token: true
      })
    });
    return await res.json();
  },
  // super group channel
  async findCommunityChat(metadata) {
    const res = await fetch(
      `https://api-${appId}.sendbird.com/v3/group_channels?metadata_key=hubId&metadata_values=${metadata.hubId}&show_empty=true`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': sendbirdToken
        }
      }
    );
    return await res.json();
  },
  // find member in group channel by user_id
  async findCommunityChatMember(channelURL, userId) {
    const res = await fetch(
      `https://api-${appId}.sendbird.com/v3/group_channels/${channelURL}/members/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': sendbirdToken
        }
      }
    );
    return await res.json();
  },
  // join to group channel
  async joinGroupChannel(channelURL, userId) {
    const res = await fetch(`https://api-${appId}.sendbird.com/v3/group_channels/${channelURL}/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Token': sendbirdToken
      },
      body: JSON.stringify({
        user_ids: [`${userId}`]
      })
    });
    return await res.json();
  },
  // get description of community chat
  async getChannelMetadata(channelURL) {
    const res = await fetch(
      `https://api-${appId}.sendbird.com/v3/group_channels/${channelURL}/metadata?keys=groupDescription`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': sendbirdToken
        }
      }
    );
    return await res.json();
  },
  // this function should use from seller app
  createSuperGroupChannel(hubId, hubName, userId, coverImageUrl) {
    return new Promise((resolve, reject) => {
      let params = new sb.GroupChannelParams();
      params.isSuper = true;
      params.name = hubName;
      const metaData = { hubId: hubId.toString() };
      params.addUserId(userId);
      if (coverImageUrl) {
        params.coverUrl = coverImageUrl;
      }
      sb.GroupChannel.createChannel(params, (channel, error) => {
        if (error) reject(new Error(`Could not create channel ${error}`));
        channel.createMetaData(metaData, (response, error) => {
          if (error) {
            reject(error);
          }
          resolve(channel);
        });
      });
    });
  },

  /**
   * @function startChat
   * @param {Array} userIds
   * @description SendBird enables the creation of private channels; To start a one-on-one chat needs creation of a channel with two members
   */
  startChat(userIds) {
    return new Promise((resolve, reject) => {
      // The boolean argument below directs the app to look for an existing chat between
      // the two users. Creates a new chat if no match is found
      sb.GroupChannel.createChannelWithUserIds(userIds, true, function (channel, error) {
        if (error) reject(new Error(`Channel creation Failed: ${error}`));
        resolve(channel);
      });
    });
  },

  /**
   * @function getChat
   * @param {string} channelUrl
   * @description get a single chat
   */
  getChat(channelUrl) {
    return new Promise((resolve, reject) => {
      sb.GroupChannel.getChannel(channelUrl, function (groupChannel, error) {
        if (error) reject(new Error(`Could not get channel: ${error}`));
        currentChannel = groupChannel;
        resolve(groupChannel);
      });
    });
  },

  getUserMessageParams(message, members) {
    var params = new sb.UserMessageParams();
    params.message = message;
    params.mentionedUserIds = members;
    return params;
  },

  async prepareFileMessageParams(files, data, members) {
    const fileMessageParams = new sb.FileMessageParams();
    if (files && files.length > 0) {
      fileMessageParams.file = files[0].file;
      fileMessageParams.thumbnailSizes = [{ maxWidth: 200, maxHeight: 200 }];
      fileMessageParams.data = data;
      fileMessageParams.fileName = files[0].name;
      fileMessageParams.mentionedUserIds = members;
    }
    return fileMessageParams;
  },

  /**
   * @function sendMessage
   * @param {BaseChannel} channel
   * @param {string} message
   * @description Send a message to another user
   */
  async sendMessage(collection, channel = currentChannel, message, files, members) {
    const fileMessageParams = await this.prepareFileMessageParams(files, message, members);
    return new Promise((resolve, reject) => {
      if (!files || files.length < 1) {
        const params = this.getUserMessageParams(message, members);
        const previewMessage = channel.sendUserMessage(params, (message, error) => {
          if (error) reject(new Error(`Message send Failure: ${error}`));
          collection.handleSendMessageResponse(error, message);
          resolve(message);
        });
        collection.appendMessage(previewMessage);
      } else {
        const previewMessage = channel.sendFileMessage(fileMessageParams, (message, error) => {
          if (error) reject(new Error(`Message send Failure: ${error}`));
          collection.handleSendMessageResponse(error, message);
          resolve(message);
        });
        collection.appendMessage(previewMessage);
      }
    });
  },

  /**
   * @function getChatList
   * @description get a list of chats for current user
   */
  getChatList() {
    return new Promise((resolve, reject) => {
      const channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
      channelListQuery.includeEmpty = true;
      channelListQuery.order = 'latest_last_message';
      channelListQuery.limit = 50;

      if (channelListQuery.hasNext) {
        channelListQuery.next(function (channelList, error) {
          if (error) reject(new Error(`Could not get list: ${error}`));
          resolve(channelList);
        });
      }
    });
  },

  /**
   * @function getChatMessages
   * @param {Object} channel
   * @description get message history for selected chat
   */
  getChatMessages(customLimit = 5) {
    return new Promise((resolve, reject) => {
      currentChannelMessageListQuery.limit = customLimit;
      currentChannelMessageListQuery.reverse = false;
      currentChannelMessageListQuery.load(function (messages, error) {
        if (error) reject(new Error(`Could not get messages: ${error}`));
        resolve(messages);
      });
    });
  },

  /**
   * @function groupChannelCreatePreviousMessageListQuery
   * @param {Object} channel
   * @description create previous message in channel query
   */

  groupChannelCreatePreviousMessageListQuery(url) {
    return new Promise((resolve, reject) => {
      sb.GroupChannel.getChannel(url, async function (groupChannel, error) {
        if (error) {
          reject(error);
        } else {
          try {
            currentChannel = groupChannel;
            const messageQuery = await currentChannel.createPreviousMessageListQuery();
            currentChannelMessageListQuery = messageQuery;
            resolve(messageQuery);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  },

  /**
   * @function getTotalUnreadChannelCount
   * @description get total unread message in all group channel
   */

  getTotalUnreadChannelCount() {
    return new Promise((resolve, reject) => {
      sb.getTotalUnreadChannelCount((count, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(count);
        }
      });
    });
  },

  setFcmToken(token) {
    fcmToken = token;
  },

  async setTokenForPushNotification() {
    if (!fcmToken) {
      return;
    }
    try {
      if (isPlatform('android') || isPlatform('ios')) {
        isPlatform('android')
          ? await sb.registerGCMPushTokenForCurrentUser(fcmToken)
          : await sb.registerAPNSPushTokenForCurrentUser(fcmToken);
        await sb.setPushTriggerOption('all');
      }
    } catch (error) {
      console.error(error);
    }
  },

  setChatPushNotification() {
    if (isPlatform('android') || isPlatform('ios')) {
      isPlatform('android')
        ? Vue.prototype.$firebase.getFCMToken('onSetChatPushNotification')
        : Vue.prototype.$firebase.getAPNSToken('onSetChatPushNotification');
      window.addEventListener('onSetChatPushNotification', onSetChatPushNotification);
    }
  },

  /**
   * We dont unset chat push notification for Android because everytime user's redirect to login page,
   * it will revoke FCM token.
   */
  unsetChatPushNotification(callback) {
    if (isPlatform('ios')) {
      Vue.prototype.$firebase.getAPNSToken('onUnsetChatPushNotification');
      window.addEventListener('onUnsetChatPushNotification', ($event) =>
        onUnsetChatPushNotification($event, callback)
      );
    }
  }
};

async function onSetChatPushNotification($event) {
  const token = $event.detail?.token;
  if (!token) return;

  try {
    if (isPlatform('android') || isPlatform('ios')) {
      isPlatform('android')
        ? await sb.registerGCMPushTokenForCurrentUser(token)
        : await sb.registerAPNSPushTokenForCurrentUser(token);
      await sb.setPushTriggerOption('all');
    }
  } catch (error) {
    console.error(error);
  }
}

async function onUnsetChatPushNotification($event, callback) {
  const token = $event.detail?.token;

  if (token) sb.unregisterAPNSPushTokenForCurrentUser(token);

  if (callback) callback();
}
