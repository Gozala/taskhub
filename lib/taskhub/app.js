var view = '<ul id="tasks"><li id="new">New task</li></ul>';

exports.App = function App(app) {
    if (document.readyState == "complete") {
        Responder(exports.app = app);
    } else {
        window.addEventListener("load", function appInit() {
            window.removeEventListener("load", appInit, false);
            App(app);
        }, false);
    }
}

function Responder(app) {
    var root = document.body;
    root.addEventListener("click", responder, false);
    root.addEventListener("mousedown", responder, false);
    root.addEventListener("mouseup", responder, false);
    root.addEventListener("online", responder, false);
    root.addEventListener("offline", responder, false);
    root.addEventListener("keydown", responder, false);
    root.addEventListener("DOMNodeInserted", responder, false);
}

function responder(event) {
    var target = event.target;
    var handler = event.type;
    if (exports.app[handler]) exports.app[handler](event)
    console.log(event.type + ":" + target.toString() + "#" + target.id, target);
}


function View(options) {
    if ((!this instanceof View)) return new View(options);

}