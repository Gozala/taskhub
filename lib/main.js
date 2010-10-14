require("./global-harmony");
var App = require("./app").App;
var Model = require("./model").Tasks;

var main = exports.main = function main() {
    exports.app = App(appController);
};

var appController = exports.App = {
    init: function() {
        document.getElementById("login-data").value = Model.user + "/" + Model.token;
        if (!Model.authorized) TasksManager.setup();
        else TasksManager.load();
    },
    mousedown: function(event) {
        var target = event.target;
        if (target.tagName.toLowerCase() == "li") {
            TasksManager.edit(target);
        }
    },
    click: function(event) {
        var target = event.target;
        if (target.id == "settings") {
            prevent(event);
            TasksManager.toggleSettings();
        }
    },
    touchstart: function(event) {
        this.mousedown(event);
    },
    keydown: function(event) {
        var target = event.target;
        if (target.id == "login-data" && event.keyCode == 13) return TasksManager.authorize();
        if (target.nodeName.toLowerCase() != "li") return;
        switch (event.keyCode) {
            case 9: // tab
                prevent(event);
                if (event.shiftKey) TasksManager.editPrevious()
                else TasksManager.editNext();
                break;
            case 13: // enter
                if (!event.shiftKey) {
                    prevent(event);
                    TasksManager.add();
                }
                break;
            case 8: // backspace
                if (target.textContent.trim() == "") {
                    prevent(event);
                    TasksManager.remove();
                }
                break;
        }
    },
    DOMNodeInserted: function DOMNodeInserted(event) {
        var target = event.target;
        /*
        if (target.nodeType == 1 && target.textContent != "" && target.nodeName.toLowerCase() == "li") {
            var newTarget = document.createTextNode(target.textContent);
            target.parentNode.replaceChild(newTarget, target);
            window.getSelection().getRangeAt(0).setStartAfter(newTarget);
        }
        */
    }
}
function putCursor(target) {
    target.contentEditable = true;
    target.focus();
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    target = target.lastChild || target;
    range.setStart(target, target.textContent.length);
    selection.collapseToEnd();
}

function prevent(event) {
    event.stopPropagation(true);
    event.preventDefault();
}

var TasksManager = exports.TasksManager = {
    active: null,
    load: function load(repo, data) {
        if (repo) Model.active = repo;
        if (data) Model.repo = data;
        document.getElementById("task-list-view").innerHTML = Model.repo;
    },
    displayError: function displayError(result) {
        var error = (typeof result == "string") ? result : result.error;
        this.load("system:error", "Boom! Sorry had an error\n=============\n\n* " + error);
    },
    setup: function setup() {
        this.load("system:setup");
        this.toggleSettings();
    },
    authorize: function authorize() {
        var login = document.getElementById("login-data").value.split("/");
        var user = Model.user = login[0].trim();
        var token = Model.token = login[1].trim();
        this.load("system:settings", "Account Settings\n=============\n\n* Github User: "
            + user + "\n* API Token: " + token + "\n* Loading...");
        Model.authorize(this.accountBounded.bind(this), this.displayError.bind(this));
    },
    accountBounded: function authorized() {
        this.toggleSettings();
        var sources = Model.sources;
        if (sources.length) { // There are no gists on a server
            Model.authorized = true;
            this.load(sources[0]);
        } else {
            this.load("system:template");
            Model.createSource(this.sourceBounded.bind(this), this.displayError.bind(this));
        }
    },
    sourceBounded: function sourceBounded(value) {
        if (value.repo) {
            Model.authorized = true;
            Model.repo = value.repo;
        } else { // maybe I should do something more intelegent
            this.displayError(value)
        }
    },
    toggleSettings: function() {
        var viewStyle = document.getElementById("tasks-view").style;
        if (viewStyle.top == "50px") {
            viewStyle.top = null;
        } else {
            viewStyle.top = "50px";
            document.getElementById("login-data").select();
        }
    },
    edit: function editTask(element) {
        var tasks = document.getElementById("task-list-view").children;
        var active = this.active;
        if (typeof element == "number") {
            element = (element >= 0) ? tasks[element] : tasks[tasks.length + element]
        } else if (!element || !element.nodeType || element.nodeType != 1
            || element.tagName.toLowerCase() != "li"
        ) {
            element = null;
        }
        if (active != element) {
            if (active) {
                active.contentEditable = false;
                if (active.textContent.trim() == "") this.remove(active);
            }
            if (element) {
                this.active = element;
                element.contentEditable = true;
                putCursor(element);
            }
        }
        Model.repo = tasks;
        return this;
    },
    editNext: function editNext() {
        var active = this.active;
        return this.edit(active ? active.nextElementSibling || 0 : 0);
    },
    editPrevious: function editPrevious() {
        var active = this.active;
        return this.edit(active ? active.previousElementSibling || -1 : 0);
    },
    add: function add() {
        var active = this.active;
        if (active && active.textContent.trim() == "") return;
        var task = taskView.cloneNode(false);
        var taskList = document.getElementById("task-list-view");
        taskList.insertBefore(task, active ? active.nextSibling : null);
        return this.editNext();
    },
    remove: function remove(element) {
        var active = this.active;
        if (typeof element == "number") {
            element = document.getElementById("task-list-view").children[element];
        } else if (!element) {
            element = active;
            this.editPrevious();
        } else {
            element.parentNode.removeChild(element);
        }
        return this;
    }
};

var taskView = document.createElement("li");

if (require.main == module) main()

