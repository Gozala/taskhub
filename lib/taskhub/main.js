var App = require("./app").App;
var main = exports.main = function main() {
    App({
        mousedown: function(event) {
            var target = event.target;
            if (target.className == "task")
                target.contentEditable = true;
        },
        mouseup: function(event) {

        },
        keydown: function(event) {
            var target = event.target;
            switch (event.keyCode) {
                case 9: // tab
                    prevent(event);
                    target.contentEditable = false;
                    if (event.shiftKey) newTarget = target.previousElementSibling || target.parentNode.children[target.parentNode.children.length - 1];
                    else newTarget = target.nextElementSibling || target.parentNode.children[0];
                    putCorsor(newTarget);
                    if (target.textContent == "") target.parentNode.removeChild(target);
                    break;
                case 13: // enter
                    if (!event.shiftKey) {
                        prevent(event);
                        if (target.textContent != "") {
                            target.contentEditable = false;
                            var newTarget = target.cloneNode(false);
                            target.parentNode.insertBefore(newTarget, target.nextSibling);
                            putCorsor(newTarget);
                        }
                    }
                    break;
                case 8: // backspace
                    if (target.textContent == "") {
                        prevent(event);
                        var newTarget = target.previousElementSibling;
                        if (newTarget) {
                            putCorsor(newTarget);
                            target.parentNode.removeChild(target);
                        }
                    }
                    break;
            }
            console.log("keydown:", event)
        },
        DOMNodeInserted: function DOMNodeInserted(event) {
            var target = event.target;
            if (target.nodeType == 1) {
                var newTarget = document.createTextNode(target.textContent);
                target.parentNode.replaceChild(newTarget, target);
            }
        }
    });
    //print(">>>>>");
    //window.addEventListener("load", main, false);
    ///initialize();
    //document.body.addEventListener("online", syncUI, false);
    //document.body.addEventListener("click", responder, false);
};

function putCorsor(target) {
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
var responder = exports.responder = function responder(event) {
    print(event.target.id);
    print(event.currentTarget);
}
var syncUI = exports.syncUI = function syncUI() {
    print("sync ui");
}
var initialize = exports.initialize = function initialize() {
    print("initializing");
}

exports.TasksManager = {
    get panel() {
        delete this.panel;
        return this.panel = document.getElementById("panel");
    },
    initialize: function lm_initialize() {
      this.server = new TasksServer(location);
        document.body.addEventListener("online", function() {
            TasksManager._rebuild();
        }, false);
        // just ensure that some images are visible when going into offline
        // mode
        var img1 = new Image();
        img1.src = "images/sync.png";
        var img2 = new Image();
        img2.src = "images/no-sync.png";
        this._rebuild();
    },
    uninitialize: function lm_uninitalize() {
        var items = [];
        for (var i = 1; i < this.panel.children.length; i++) {
            var item = this.panel.children[i];
            items.push({ 'id':item.getAttribute("id"), 'title':item.getAttribute("title"), 'sync':item.getAttribute("sync")});
        }
        this.server.close(items);
    },
    create : function lm_create() {
        var title = window.prompt("New task:");
        if (title) {
            var res = this.server.add(title);
            var id = res[0];
            var online = res[1];
            this._append(id, title, online);
        }
    },
    remove: function lm_remove(anItem) {
        TasksEffects.remove(anItem);
        this.server.remove(anItem.getAttribute("id"));
    },
    _rebuild: function() {
        // remove all the previously loaded items
        while(this.panel.lastChild != this.panel.firstElementChild)
            this.panel.removeChild(this.panel.lastChild);
            // build a new list
            var items = this.server.getAll();
            if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                this._append(item.id, item.title, item.sync);
            }
        }
    },
    _append: function lm_append(aId, aTitle, aSync) {
        var item = document.createElement("li");
        item.setAttribute("id", aId);
        item.setAttribute("title", aTitle);
        item.setAttribute("sync", aSync);
        item.appendChild(document.createTextNode(aTitle));
        var image = document.createElement("img");
        image.setAttribute("onclick", "TasksManager.remove(this.parentNode);");
        image.src = "images/close-40.png";
        item.appendChild(image);
        item.style.MozOpacity = 0.0;
        this.panel.appendChild(item);
        TasksEffects.append(item);
    }
};

if (require.main == module) main()

