const AV = require('leanengine');
const qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = '';
qiniu.conf.SECRET_KEY = '';

AV.Cloud.define('genUpToken', function(req, res) {
  const bucket = req && req.params['bucket'] ? req.params['bucket'] : 'hidoge',
      putPolicy = new qiniu.rs.PutPolicy(bucket);
  const aToken = putPolicy.token();
  return res.success(aToken);
});