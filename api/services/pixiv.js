/**
 * pixiv API
 */

var fs = require('fs');

module.exports = {

  id: function(id){

    var result = {};

    return new Promise(function(resolve,reject){
      request('http://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + id)
        .then(function(response){

          var body = response.body;
          var $ = cheerio.load(body);

          result.title = $('meta[property="og:title"]').attr('content');
          result.url = $('meta[property="og:url"]').attr('content');
          result.image = $('.img-container img,.sensored img').attr('src').replace('/64x64/','/600x600/').replace('square1200','master1200');

          result.error = $('.error-message').text().replace('戻る','');

          resolve(result);

        })
        .catch(reject)
    });
  }

};
