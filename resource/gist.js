function encode(data) {
    var message = "";
    for (var key in data) {
        message += "&" + key + "=" + encodeURIComponent(data[key]);
    }
    return message.substring(1);
}
/**
 * writes files as gists
 * @param {JSON} files       hashmap of file name > content
 * @param {JSON} options     has to have properties user, token and optional isPrivate
 */
var write = exports.write = function write(files, options) {
    var url = "http://gist.github.com/gists/" + (options.id || "");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Accept", "text/javascript, text/json");
    var data = {
        login: options.user,
        token: options.token,
    };
    if (options.isPrivate)  data.action_button = "private";
    var count = 0;
    for (var name in files) {
        if (count ++ > 10) break;
        var key = "gistfile" + count;
        data["file_name[" + key + "]"] = name;
        data["file_ext[" + key + "]"] = undefined;
        data["file_contents[" + key + "]"] = files[name];
    }
    xhr.send(encode(data));
    return xhr;
};
/**
 * removes gist
 * @param {String} id           unique gist id
 * @param {String} options      has to have properties user, token
 */
var remove = exports.remove = function remove(id, options) {
    var url = "https://gist.github.com/delete/" + id;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Accept", "text/javascript, text/json");
    xhr.send(encode({
        "login": options.user,
        "token": options.token,
        "_method": "delete"
    }));
    return xhr;
}
var list = exports.list = function list(options) {
    var url = "http://gist.github.com/api/v1/json/gists/" + options.user;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Accept", "text/javascript, text/json");
    xhr.send(encode({
        "login": options.user,
        "token": options.token
    }));
    return xhr;
}

var user = exports.user = function user(options) {
    var url = "http://github.com/api/v1/json/" + options.user;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Accept", "text/javascript, text/json");
    xhr.send(encode({
        "login": options.user,
        "token": options.token
    }));
    return xhr;
}

var update = exports.update = function update(files, options) {
    var url = "https://gist.github.com/" + (options.id || "");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Accept", "text/javascript, text/json");
    var data = {
        login: options.user,
        token: options.token,
        _method: "put"
    };
    var count = 0;
    for (var name in files) {
        data["file_name[" + name + "]"] = name;
        data["file_ext[" + name + "]"] = name.substr(name.lastIndexOf("."));
        data["file_contents[" + name + "]"] = files[name];
    }
    xhr.send(encode(data));
    return xhr;
};
