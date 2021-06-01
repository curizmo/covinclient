import country_json_1 from './lib/country.json';
import state_json_1 from './lib/state.json';
import city_json_1 from './lib/city.json';

var _findEntryByCode = function (source, code) {
  if (code && source != null) {
    var codex = source.findIndex(function (c) {
      return c.isoCode === code;
    });
    return codex !== -1 ? source[codex] : '';
  }
  return '';
};
var _findStateByCodeAndCountryCode = function (source, code, countryCode) {
  if (code && countryCode && source != null) {
    var codex = source.findIndex(function (c) {
      return c.isoCode === code && c.countryCode === countryCode;
    });
    return codex !== -1 ? source[codex] : '';
  }
  return '';
};
var compare = function (a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};
const csc = {
  getStatesOfCountry: function (countryCode) {
    var states = state_json_1.filter(function (value) {
      return value.countryCode === countryCode;
    });
    return states.sort(compare);
  },
  getCitiesOfState: function (countryCode, stateCode) {
    var cities = city_json_1.filter(function (value) {
      return value.countryCode === countryCode && value.stateCode === stateCode;
    });
    return cities.sort(compare);
  },
  getCitiesOfCountry: function (countryCode) {
    var cities = city_json_1.filter(function (value) {
      return value.countryCode === countryCode;
    });
    return cities.sort(compare);
  },
  getAllCountries: function () {
    return country_json_1;
  },
  getAllStates: function () {
    return state_json_1;
  },
  getAllCities: function () {
    return city_json_1;
  },
  getCountryByCode: function (isoCode) {
    return _findEntryByCode(country_json_1, isoCode);
  },
  // to be deprecate
  getStateByCode: function (isoCode) {
    // eslint-disable-next-line no-console
    console.warn(
      "WARNING! 'getStateByCode' has been deprecated, please use the new 'getStateByCodeAndCountry' function instead!",
    );
    return _findEntryByCode(state_json_1, isoCode);
  },
  getStateByCodeAndCountry: function (isoCode, countryCode) {
    return _findStateByCodeAndCountryCode(state_json_1, isoCode, countryCode);
  },
};
export default csc;
