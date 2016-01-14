/**
 * iqdb API
 */

var fs = require('fs');

module.exports = {

  file: function(filepath){

    var result = {};

    return new Promise(function(resolve,reject){
      request('http://iqdb.org/', {
        method: 'POST',
        formData: {
            MAX_FILE_SIZE: 8388608,
            service: [1,2,3,4,5,6,10,11,12,13],
            file: fs.createReadStream(filepath),
            url: 'http://'
        }
      })
        .then(function(response){

          var body = response.body;
          var $ = cheerio.load(body);

          var best = $("tbody:contains('Best match')").find('tr');
          result.best = {
            image: 'http://iqdb.org' + best.eq(1).find('img').attr('src'),
            alt: best.eq(1).find('img').attr('alt'),
            link: 'http'+ best.eq(1).find('a').attr('href'),
            source: best.eq(2).text(),
            size : best.eq(3).text(),
            similarity: best.eq(4).text(),
          };

          resolve(result);

        })
        .catch(reject)
    });
  }
};
