const STORAGE_KEYS = {
  USER_INFO: '8^$:.BBpP4fkWW+r',
  JWT_TOKEN: 'N4%=!Ub9K9ZT-wc"',
  SELECTED_COMPANY: 'y=~~{^mduTTZ55C>',
  SELECT_CUSTOMER: '2L8A05bWIZEoAjRz',
  isNew: 'U_$-4Hp8J@ynNJ+s',
  CURRENT_LOCATION: '{N)k%9-vWufH!R+d',
  SELECTED_STATE: 'J%9!U^-Xy9GeH&Le',
  POSTAL_CODE: 'b?Vn~uAXD%7ME53-',
  REDIRECTPATH: '7S#4ED%wD@#~@ACd'
};
class TDStorage {
  constructor(ionicStorage) {
    this.$storage = ionicStorage;
  }

  // wrap basic function
  get(key) {
    return this.$storage.get(key);
  }

  set(key, value) {
    return this.$storage.set(key, value);
  }

  remove(key) {
    return this.$storage.remove(key);
  }

  getJWTToken() {
    return this.get(STORAGE_KEYS.JWT_TOKEN);
  }

  getUser() {
    return this.get(STORAGE_KEYS.USER_INFO);
  }

  async setUser(value) {
    // set jwt token
    this.set(STORAGE_KEYS.JWT_TOKEN, value.tokenJWT);

    // set user info
    await this.set(STORAGE_KEYS.USER_INFO, value);
  }

  getSelectedCompany() {
    return this.get(STORAGE_KEYS.SELECTED_COMPANY);
  }

  setSelectedCompany(value) {
    this.set(STORAGE_KEYS.SELECTED_COMPANY, JSON.parse(JSON.stringify(value)));
  }

  getSelectCustomer() {
    return this.get(STORAGE_KEYS.SELECT_CUSTOMER);
  }

  setSelectedCustomer(value) {
    this.set(STORAGE_KEYS.SELECT_CUSTOMER, JSON.parse(JSON.stringify(value)));
  }

  getIsNew() {
    return this.get(STORAGE_KEYS.isNew);
  }

  setIsNew(value) {
    this.set(STORAGE_KEYS.isNew, value);
  }

  setCurrentLocation(value) {
    this.set(STORAGE_KEYS.CURRENT_LOCATION, value);
  }

  getCurrentLocation() {
    return this.get(STORAGE_KEYS.CURRENT_LOCATION);
  }

  setSelectedState(value) {
    this.set(STORAGE_KEYS.SELECTED_STATE, value);
  }

  getSelectedState() {
    return this.get(STORAGE_KEYS.SELECTED_STATE);
  }

  setPostalCode(value) {
    this.set(STORAGE_KEYS.POSTAL_CODE, value);
  }

  getPostalCode() {
    return this.get(STORAGE_KEYS.POSTAL_CODE);
  }

  setRedirectPath(value) {
    this.set(STORAGE_KEYS.REDIRECTPATH, value);
  }

  getRedirectPath() {
    return this.get(STORAGE_KEYS.REDIRECTPATH);
  }

  clearStorage() {
    const storageKeys = Object.keys(STORAGE_KEYS);
    storageKeys.forEach((key) => {
      this.$storage.remove(STORAGE_KEYS[key]);
    });
  }
}

export default TDStorage;
