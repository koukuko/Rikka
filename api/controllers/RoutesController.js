/**
 * Rikka Robot Route
 */

function generateRandomCard() {
  // 1. 生成中奖区域
  var target = Math.random() * 93.5;

  var randomCard = Math.random() * 100;
  if (randomCard > target && randomCard < target + 6.5) {
    if (randomCard < target + 1.5) {
      return '[SSR]';
    } else {
      return '[SR]';
    }
  } else {
    return '[R]'
  }
}

module.exports = {

  index: function (req, res) {

    var message = req.query.message || '';
    var command = req.query.message.split(' ');

    switch (command[0]) {

      case '#pixiv':
      case '#pixivid':
      case '#pid':
      case '#p站':
      case '#P站':

        var id = parseInt(command[1]);

        sails.services.pixiv.id(id)
          .then(function (data) {
            if (!data.image) {
              if (data.error) {
                res.send(200, data.error);
              } else {
                res.send(200, '該当作品は削除されたか、存在しない作品IDです。')
              }
            } else {
              res.send(200, "[image=http://127.0.0.1:1337/pixiv?url=" + data.image + "&id=" + id + "] \n" + data.title + "\n" + data.url);
            }
          });


        break;

      case '#10连':
      case '#cgss':

        var line1 = [];
        var line2 = [];

        for (var i = 0; i < 9; i++) {
          if (i > 4) {
            line2.push(generateRandomCard());
          } else {
            line1.push(generateRandomCard());
          }
        }

        line2.push('[SR]');

        var result = line1.join("\t") + '\n' + line2.join("\t");
        res.send(200, result);

        break;

      case '#单抽':
        res.send(200,generateRandomCard());
        break;

      case '#nico':
      case '#nicovideo':
      case '#niconico':
        var id = command[1];

        sails.services.niconico.id(id)
          .then(function (data) {
            if (data.error) {
              res.send(200, 'お探しの動画は再生できません\nこの動画は存在しないか、削除された可能性があります。')
            } else {
              res.send(200, "[image=" + data.thumbnail_url + "] \n" + data.title + "\n" + data.user_nickname + '@' + data.first_retrieve + '\n' + '再生:'+ data.view_counter + '\t' + 'コメント:'+ data.comment_num + '\t' +  'マイリスト:' + data.mylist_counter + '\n' + data.url);
            }
          });
        break;

      case '#搜图':
      case '#iqdb':

        var source = /\[image\=(.*?)\]/g.exec(command[1] || '');
        if(!source){
          return res.notFound();
        }


        var source = 'F:/QQBot/image/' + source[1];

        sails.services.iqdb.file(source)
          .then(function (data) {
            if (data.error) {
              res.send(200, 'ERROR')
            } else {
              res.send(200,
                'Best Match:\n' +
                  '[image=' + data.best.image + ']\n' +
                  data.best.link + '\n' +
                data.best.source + '\n' +
                data.best.size + '\n' +
                data.best.similarity
              )
            }
          });

        break;

      default:
        res.notFound();
        break;
    }
  },

  pixiv: function (req, res) {

    var url = req.query.url;
    var id = req.query.id;

    return request({
      url: url,
      encoding: null,
      headers: {
        'Accept': 'image/webp,image/*,*/*;q=0.8',
        'Referer': 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + id,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
      }
    }).then(function (response) {

      if (url.indexOf('.gif') >= 0) {
        res.writeHead(200, {'Content-Type': 'image/gif'});
      } else {
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
      }


      res.end(response.body, 'binary');
    });

  }

};
