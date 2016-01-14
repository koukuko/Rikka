/**
 * niconico API
 */

var fs = require('fs');

module.exports = {

  id: function(id){

    var result = {};

    return new Promise(function(resolve,reject){
      request('http://ext.nicovideo.jp/api/getthumbinfo/' + id)
        .then(function(response){

          var body = response.body;
          var $ = cheerio.load(body);

          result.title = $('title').text();
          result.url = $('watch_url').text();
          result.user_nickname = $('user_nickname').text();
          result.thumbnail_url = $('thumbnail_url').text();
          result.first_retrieve = $('first_retrieve').text();
          result.error = $('error').text();

          resolve(result);

        })
        .catch(reject)
    });
  }
};
