(function() {

    'use strict';

    mbApp.services.factory('RateEx', RateEx);

    function RateEx(AppConfig, ContractService, AuthService) {

        return {
            rateCardCount: rateCardCount,
            lowestRateForCountryCode: lowestRateForCountryCode
        };

        function rateCardCount() {
            return ContractService.RateEx().with(defaultContext()).numberOfRateCards().then(function(res) {
                if (res) {
                    return res.toNumber();
                }
            });
        }

        function lowestRateForCountryCode(countryCode) {
            return ContractService.RateEx().with(defaultContext()).lowestRateCard(countryCode).then(function(res) {
                if (res) {
                    return {
                        rate: res[0].toNumber(),
                        rateCard: res[1]
                    };
                }
            });
        }

        function defaultContext() {
            return {
                client: AuthService.getClientInfo(),
                tx: {
                    from: AuthService.getAddress() || AppConfig.SU_ADDRESS
                }
            };
        }
    }

})();