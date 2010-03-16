var db = global.localStorage;
var GIST = require("github/gist-yql");
var INITIAL_REPO = "\n\
My Tasks\n\
========\n\
\n\
* Change title of this tasks list\n\
* Set up Github Account for taskhub\n\
* Delete this inital tasks\n\
";

var SETUP = "\n\
Setup\n\
========\n\
\n\
* Enter your Github User name and API Token\n\
* Cross your fingers and wait...\n\
* You can play meanwhile this is actually your first task list\n\
";

var templates = ["setup","initial"];
var Tasks = exports.Tasks = Object.create({}, {
    active: {
        get: function() {
            return db.active;
        },
        set: function(value) {
            var sources = this.sources;
            if (0 > sources.indexOf(value) && 0 > templates.indexOf(value)) db.sources += value + ",";
            return db.active = value;
        }
    },
    authorized: {
        get: function authorized() {
            return (db.authorized == "true");
        },
        set: function authorized(value) {
            return db.authorized = value;
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
            return db.token = value;
        }
    },
    repo: {
        get: function repo() {
            var active = this.active;
            var value = db[active] || ( active == "setup" ? SETUP : db[active] = INITIAL_REPO);
            return html(value);
        },
        set: function repo(value) {
            value = db[this.active] = (typeof value == "string") ? value : wiki(value);
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
                if (i) Tasks.authorized = true;
                if (success) success();
            }, error)
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
    result += tasks[0].textContent;
    result += result.replace(/[\s\S]/g, "=");
    for (var i = 1, l = tasks.length; i < l; i ++) {
        result += "\n* " + tasks[i].textContent.replace(/\n/g, "   \n");
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
        GIST.update({ "taskhub.md": db[repo]}, null, {
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