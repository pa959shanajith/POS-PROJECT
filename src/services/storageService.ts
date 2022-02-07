class StorageService {
    getValue(key: string) {
        return window.localStorage.getItem(key);
    }
    getToken() {
        return this.getValue('TOKEN');
    }
    getShopId() {
        return this.getValue('SHOP_ID');
    }
    getClientId() {
        return this.getValue('CLIENT_ID');
    }
    getEmployeeId() {
        return this.getValue('EMPLOYEE_ID');
    }
    getSessionId() {
        return this.getValue('SESSION_ID');
    }
    setToken(value: string) {
        window.localStorage.setItem('TOKEN', value);
    }
    setShopId(value: string) {
        window.localStorage.setItem('SHOP_ID', value);
    }
    setClientId(value: string) {
        window.localStorage.setItem('CLIENT_ID', value);
    }
    setEmployeeId(value: string) {
        window.localStorage.setItem('EMPLOYEE_ID', value);
    }
    setSessionId(value: string) {
        window.localStorage.setItem('SESSION_ID', value);
    }
    setRoleId(value: string) {
        window.localStorage.setItem('ROLE_ID', value);
    }
    removeToken() {
        return window.localStorage.removeItem('TOKEN');
    }
    removeShopId() {
        return window.localStorage.removeItem('SHOP_ID');
    }
    removeClientId() {
        return window.localStorage.removeItem('CLIENT_ID');
    }
    removeEmployeeId() {
        return window.localStorage.removeItem('EMPLOYEE_ID');
    }
    removeSessionId() {
        return window.localStorage.removeItem('SESSION_ID');
    }
}

export default new StorageService();
