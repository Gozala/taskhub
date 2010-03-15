var db = localStorage;
var INITIAL_REPO = "\n\
My Tasks\n\
========\n\
\n\
* Change title of this tasks list\n\
* Set up Github Account for taskhub\n\
* Delete this inital tasks\n\
";

var Tasks = exports.Tasks = Object.create({}, {
    active: {
        get: function() {
            return db.active || (db.active = "initial-repo")
        },
        set: function() {
            return db.active = "initial-repo";
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
            var value = db[active] || (db[active] = INITIAL_REPO);
            return html(value);
        },
        set: function repo(value) {
            db[this.active] = wiki(value);
            return value;
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