var URL = /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|cat|coop|int|pro|tel|xxx|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2})?)|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/;


/**
 * Process prittified data for web application
 * @param {Object} prittified data
 */
function processData(data) {
  var KEY_ARRY = [
    'Paths',
    'Lowest Cohesion Selector',
    'Unique Font Families',
    'Unique Font Sizes',
    'Unique Colors',
    'Properties Count'
  ];
  Object.keys(data).forEach(function (key) {
    if (KEY_ARRY.indexOf(key) !== -1) {
      data[key] = data[key].replace(/\n/g, '<br>').split('<br>');
    }
  });
  data['Properties Count'] = data['Properties Count'].slice(0, 9);
}


/**
 * Covert raw data for Highchart
 * @param {Object} Parse.com Result Data
 * @returns {Array}
 */
function convertData(data) {
  var seriesData = [];
  var count = 0;
  var props = data.attributes.propertiesCount;
  props.forEach(function (obj, index) {
    if (index < 7) {
      var result = [obj.property, obj.count];
      seriesData.push(result);
    } else {
      count += obj.count;
    }
  });
  seriesData.push(['Other', count]);
  return seriesData;
}

module.exports = {
  ID: '6xDZRme9sj9QV5hnZgzN0EqDS6H6enwJ6FlbzGbR',
  KEY: 'ZdTWdw6CQ1tupvwfJqcojcxqPFQmwLqqxamkZT4b',
  ENTER_KEY: 13,
  URL: URL,
  processData: processData,
  convertData: convertData
};