var mongoose = require('mongoose');
var config = require('./config');
var schemas = require('./schemas');
var db = module.exports = {

  models: {
    users: null,
    doodles: null
  },

  init: function () {
    mongoose.connect(process.env.DATABASE_CREDENTIALS || config.database_credentials);
    var conn = mongoose.connection;
    conn.on('error', console.error.bind(console, 'Connection Error'));
    conn.once('open', function setModels() {
      schemas.doodles.index({
        'expires': 1
      }, {
        expireAfterSeconds: 86400
      });
      db.models.users = mongoose.model('users', schemas.users);
      db.models.doodles = mongoose.model('doodles', schemas.doodles);
    });
  },

  toObjectId: function (value) {
    if (value instanceof mongoose.Types.ObjectId) {
      return value;
    }
    return new mongoose.Types.ObjectId(value);
  },

  user: {

    exists: function (query, callback) {
      db.models.users.findOne(query).exec(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, false);
      });
    },

    getById: function (id, callback) {
      db.models.users.findOne({
        _id: id
      }).exec(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, null);
      });
    },

    getByEmail: function (email, callback) {
      db.models.users.findOne({
        email: email
      }).exec(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, null);
      });
    },

    getByUsername: function (username, callback) {
      db.models.users.findOne({
        username: username
      }).exec(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, null);
      });
    },

    add: function (params, callback) {
      var user = new db.models.users({
        email: params.email,
        username: params.username,
        password: params.password
      });
      user.save(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, null);
      });
    }

  },

  doodle: {

    create: function (params, callback) {
      var doodle = new db.models.doodles({
        _user: params.user,
        title: params.title,
        slug: params.slug,
        image: params.image,
        checksum: params.checksum,
        parent: params.parent
      });
      doodle.save(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, null);
      });
    },

    get: function (slug, callback) {
      db.models.doodles.findOne({
        slug: slug
      }).exec(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, false);
      });
    },

    getWithOwner: function (slug, callback) {
      db.models.doodles.findOne({
        slug: slug
      })
      .populate('_user')
      .exec(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, false);
      });
    },

    getAll: function (callback) {
      db.models.doodles.find({
        _user: null
      })
      .sort({ created: -1 })
      .exec(function (err, docs) {
        if (err) {
          return callback(err);
        }
        if (docs) {
          return callback(null, docs);
        }
        return callback(null, false);
      })
    },

    getAllByObjectId: function (oid, callback) {
      db.models.doodles.find({
        _user: oid
      })
      .sort({ created: -1 })
      .exec(function (err, docs) {
        if (err) {
          return callback(err);
        }
        if (docs) {
          return callback(null, docs);
        }
        return callback(null, false);
      });
    },

    update: function (slug, data, callback) {
      data.modified = Date.now();
      db.models.doodles.update({
        slug: slug
      }, {
        $set: data
      }, {
      },
        function (err, affected) {
          if (err) {
            return callback(err);
          }
          return callback(null, affected);
        }
      );
    },

    delete: function (slug, callback) {
      db.models.doodles.remove({
        slug: slug
      }).exec(function (err) {
        if (err) {
          return callback(err);
        }
        return informChildren(slug, function (err, affected) {
          if (err) {
            return callback(err);
          }
          return callback(null, affected);
        });
      });

      function informChildren (slug, callback) {
        db.models.doodles.update({
          parent: slug,
          modified: Date.now()
        }, {
          $set: {
            parent: null
          }
        }, {
          multi: true
        }, function (err, affected) {
          if (err) {
            return callback(err);
          }
          return callback(null, affected);
        });
      }
    },

  }

};
