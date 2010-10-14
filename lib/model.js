var db = global.localStorage;
var GIST = require("github/gist-yql");
db["system:template"] = "\n\
My Tasks\n\
========\n\
\n\
* Change title of the template tasks list\n\
* Add some tasks !!\n\
";
db["system:setup"] = "\n\
Setup\n\
========\n\
\n\
* ^ Enter your Github User name and API Token\n\
* Cross your fingers and wait...\n\
* You can play meanwhile this is actually your first task list!\n\
";

var Tasks = exports.Tasks = Object.create({}, {
    active: {
        get: function() {
            return db.active;
        },
        set: function(value) {
            return db.active = value.toString();
        }
    },
    authorized: {
        get: function authorized() {
            return (db.authorized == "true");
        },
        set: function authorized(value) {
            return db.authorized = value.toString();
        }
    },
    sources: {
        get: function sources() {
            return db.sources ? db.sources.split(",") : [];
        },
        set: function sources(value) {
            db.sources = value.join(",");
            return value;
        }
    },
    user: {
        get: function user() {
            return db.user || (db.user = "User");
        },
        set: function user(value) {
            return db.user = value;
        }
    },
    token: {
        get: function token() {
            return db.token || (db.token = "Token");
        },
        set: function token(value) {
            return db.token = value.toString();
        }
    },
    repo: {
        get: function repo() {
            var active = this.active;
            var value = db[active];
            return html(value);
        },
        set: function repo(value) {
            var active = this.active;
            value = db[active] = (typeof value == "string") ? value : wiki(value);
            if (this.sources.indexOf(active) >= 0) sync(active);
            return value;
        }
    },
    authorize: {
        value: function authorize(success, error) {
            GIST.listContents({
                user: localStorage.user,
                token: localStorage.token,
                filter: {
                    description: "taskhub"
                }
            }, function(result) {
                var sources = Tasks.sources;
                for (var i = 0, l = result.length; i < l; i++) {
                    var value = result[i], repo = value.repo, content = value.content;
                    var local = db[repo];
                    if (!local || local.length < content.length) {
                        db[repo] = content;
                        if (!local) sources.push(repo)
                    }
                    db.sources = sources.join(",");
                }
                if (success) success();
            }, error)
        }
    },
    createSource: {
        value: function create(success, error) {
            GIST.write({"taskhub.md": db[this.active]}, {
                user: localStorage.user,
                token: localStorage.token,
                description: "taskhub",
                "public": false
            }, function(result) {
                this.sources = [this.active = result.repo];
                success(result);
            }.bind(this), error)
        }
    }
});

function html(string) {
    var result = "<li>";
    var tasks = string.replace(/<[^>]*>/g, "").split(/\n\s*\*/);
    result += tasks.shift().replace(/=/g, "") + "</li><li>" + tasks.join("</li><li>") + "</li>";
    return result;
}

function wiki(tasks) {
    var result = "";
    result += tasks[0].textContent.trim();
    result += "\n" + result.replace(/[\s\S]/g, "=") + "\n";
    for (var i = 1, l = tasks.length; i < l; i ++) {
        result += "\n* " + tasks[i].textContent.trim().replace(/\n/g, "   \n");
    }
    return result;
}

var active = false;
var pending = [];
function push() {
    if (global.navigator.onLine) {
        var repo = pending.shift();
        if (0 === pending.length) {
            active = false;
        } else {
            setTimeout(push, 0);
        }
        GIST.write({ "taskhub.md": db[repo] }, {
            user: Tasks.user,
            token: Tasks.token,
            repo: repo
        }, null, function() { sync(repo) });
    } else {
        setTimeout(push, 5000);
    }
};

function sync(repo) {
    if (0 <= pending.indexOf(repo)) return;
    pending.push(repo);
    if (!active) {
        setTimeout(push, 0);
        active = true;
    }
};