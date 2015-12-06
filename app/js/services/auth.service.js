(function() {

    'use strict';

    mbApp.services.factory('AuthService', ['$rootScope', '$cookies', 'AppConfig', 'Web3Service', AuthService]);

    var utils = mbApp.utils.eth;

    function AuthService($rootScope, $cookies, AppConfig, Web3Service) {

        return {
            login: login,
            autologin: autologin,
            logout: logout,

            isAnonymous: isAnonymous,
            isAuthorized: isAuthorized,
            isAuthentificated: isAuthentificated,

            isOwner: isOwner,

            getAddress: getAddress,
            getSeedHash: getSeedHash,
            getClientInfo: getClientInfo,

            getBalance: getBalance
        };

        function login(seed) {
            return _.isEmpty(seed) ? null : autologin(utils.seedToAuth(seed));
        }

        function autologin(auth) {
            console.log('Auto login seed=[%s] address=[%s]', auth.seedHash, auth.address);
            
            $cookies.put('auth:seedHash', auth.seedHash);
            $cookies.put('auth:address', auth.address);

            $rootScope.$broadcast('auth:login', auth);

            return auth.address;
        }

        function logout() {
            $cookies.remove('auth:seedHash');
            $cookies.remove('auth:address');

            $rootScope.$broadcast('auth:logout');
        }

        function isAuthorized() {

        }

        function isAdmin() {
            return false;
        }

        function isSuperAdmin() {
            return getAddress() === AppConfig.SU_ADDRESS;
        }

        function isOwner(address) {
            return _.isEqual(getAddress().toUpperCase(), address.toUpperCase());
        }

        function isAnonymous() {
            return !getAddress();
        }

        function isAuthentificated() {
            return !isAnonymous();
        }

        function getAddress() {
            return $cookies.get('auth:address');
        }

        function getSeedHash() {
            return $cookies.get('auth:seedHash');
        }

        function getClientInfo() {
            var result = {};

            var address = getAddress();
            if (address) {
                result.address = address;
                result.seedHash = getSeedHash();
            }

            return result;
        }

        function getBalance() {
            if (this.isAnonymous()) {
                return 0;
            }

            return Web3Service.eth.getBalance(this.getAddress()).toNumber();
        }
    }

})();