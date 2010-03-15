var App = require("./app").App;
var main = exports.main = function main() {
    exports.app = App(appController);
};

var appController = exports.App = {
    settings: function() {
        var taskListView = document.getElementById("tasks-view");
        taskListView.style.top = "50px";
        var loginView = document.getElementById("login-data");
        loginView.select();
    },
    mousedown: function(event) {
        var target = event.target;
        if (0 <= target.className.indexOf("task")) {
            TasksManager.edit(target);
        }
    },
    click: function(event) {
        var target = event.target;
        if (target.id == "settings") {
            prevent(event);
            this.settings();
        }
    },
    touchstart: function(event) {
        this.mousedown(event);
    },
    keydown: function(event) {
        var target = event.target;
        if (0 > target.className.indexOf("task")) return;
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
                if (target.textContent == "") {
                    prevent(event);
                    TasksManager.remove();
                }
                break;
        }
    },
    DOMNodeInserted: function DOMNodeInserted(event) {
        var target = event.target;
        if (target.nodeType == 1 && target.textContent != "" && target.className != "task") {
            var newTarget = document.createTextNode(target.textContent);
            target.parentNode.replaceChild(newTarget, target);
            window.getSelection().getRangeAt(0).setStartAfter(newTarget);
        }
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
    edit: function editTask(element) {
        var active = this.active;
        if (typeof element == "number") {
            var tasks = document.getElementById("task-list-view").children;
            element = (element >= 0) ? tasks[element] : tasks[tasks.length + element]
        } else if (!element || !element.nodeType || element.nodeType != 1
            || 0 > element.className.indexOf("task")
        ) {
            element = null;
        }
        if (active != element) {
            if (active) {
                active.contentEditable = false;
                if (active.textContent == "") this.remove(active);
            }
            if (element) {
                this.active = element;
                element.contentEditable = true;
                putCursor(element);
            }
        }
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
        if (active && active.textContent == "") return;
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
taskView.className = "task";

if (require.main == module) main()

