exports.App = function App(app) {
    if (document.readyState == "complete") {
        Responder(exports.app = app);
    } else {
        window.addEventListener("load", function appInit() {
            window.removeEventListener("load", appInit, false);
            App(app);
        }, false);
    }
    return app;
}

function Responder(app) {
    var root = document.body;
    root.addEventListener("click", responder, false);
    root.addEventListener("mousedown", responder, false);
    root.addEventListener("touchstart", responder, false);
    root.addEventListener("mouseup", responder, false);
    root.addEventListener("click", responder, false);
    root.addEventListener("online", responder, false);
    root.addEventListener("offline", responder, false);
    root.addEventListener("keydown", responder, false);
    root.addEventListener("DOMNodeInserted", responder, false);
}

function responder(event) {
    var target = event.target;
    var handler = event.type;
    if (exports.app[handler]) exports.app[handler](event);
}


function View(options) {
    if ((!this instanceof View)) return new View(options);

}