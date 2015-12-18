/**
 * Rikka Robot Route
 */

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
          .then(function(data){

            console.log(data);

            if(!data.image){
              if(data.error){
                res.send(200, data.error);
              } else {
                res.send(200, '該当作品は削除されたか、存在しない作品IDです。')
              }
            } else {
              res.send(200,"[image=http://172.16.4.52:1337/pixiv?url="+data.image+"&id="+id+"] \n"+data.title+"\n"+data.url);
            }

          });


        break;

      default:
        res.notFound();
        break;
    }
  },

  pixiv: function(req,res){

    var url = req.query.url;
    var id = req.query.id;

    return request({
      url: url,
      encoding: null,
      headers: {
        'Accept': 'image/webp,image/*,*/*;q=0.8',
        'Referer': 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id='+id,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
      }
    }).then(function(response){
      res.writeHead(200, {'Content-Type': 'image/jpeg' });
      res.end(response.body, 'binary');
    });

  }

};
