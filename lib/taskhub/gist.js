function encode(data) {
    var message = "";
    for (var key in data) {
        message += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    }
    return message.substring(1);
}
function xhr(options, callback) {
    var result = {};
    var request = new XMLHttpRequest();
    var url = options.url;
    var data = options.data;
    var message = null;
    if (data) message = encode(data);
    var method = null;
    var headers = options.headers || {};
    if ("POST" == (method = options.method)) {
        if (!headers["Content-type"]) headers["Content-type"] = "application/x-www-form-urlencoded";
    } else {
        method = "GET";
        url += "?" + message;
        message = null;
    }
    request.open(method, url, true);
    if (headers) for (var key in headers) request.setRequestHeader(key, headers[key]);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            if (request.status == 0 || request.status == 200) {
                var text = result.text = request.responseText;
                result.xml = request.responseXML;
                if(callback) callback(text);
            }
        }
    }
    request.send(message);
    return result;
}

/**
 * writes files as gists
 * @param {JSON} files       hashmap of file name > content
 * @param {JSON} options     has to have properties user, token and optional isPrivate
 */
var write = exports.write = function write(files, options, callback) {
    var result = {};
    var data = {
        login: options.user,
        token: options.token
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
    xhr({
        url: "http://gist.github.com/gists/",
        method: "POST",
        headers: { "Accept": "text/javascript, text/json" },
        data: data
    }, function(html) {
        result.id =  /gist: (\w*) /.exec(html)[1];
        if (callback) callback(result);
    });
    return result;
};
/**
 * removes gist
 * @param {String} id           unique gist id
 * @param {String} options      has to have properties user, token
 */
var remove = exports.remove = function remove(id, options, callback) {
    var result = {}
    xhr({
        url: "https://gist.github.com/delete/" + id,
        method: "POST",
        headers: { "Accept": "text/javascript, text/json" },
        data: {
            "login": options.user,
            "token": options.token,
            "_method": "delete"
        }
    }, function() {
        result.removed = true;
        if (callback) callback(result);
    });
    return result;
};
var user = exports.user = function user(options, callback) {
    var result = {};
    xhr({
        url: "https://github.com/api/v2/json/user/show/" + options.user,
        //url: "http://github.com/api/v1/json/" + options.user,
        method: "POST",
        headers: { "Accept": "text/javascript, text/json" },
        data: {
        "login": options.user,
        "token": options.token
        }
    }, function(jsonData) {
        var data = JSON.parse(jsonData);
        for (var key in data) {
            result[key] = data[key];
        }
        if (callback) callback(data);
    });
    return result;
};

var edit = exports.edit = function edit(id, options, callback) {
    result = {};
    xhr({
        url: "https://gist.github.com/gists/" + id + "/edit/",
        headers: { "Accept": "text/javascript, text/json" },
        data: {
            login: options.user,
            token: options.token
        }
    }, function(html) {
        result.hash = html.match(/<form[^>]*action="\/gists\/(\d*)"[^>]*method="post"/)[1];
        callback(result);
    })
    return result;
};

var description = exports.description = function description(text, options, callback) {
    var result = {}
    xhr({
        url: "https://gist.github.com/gists/" + options.id + "/update_description",
        method: "POST",
        headers: { "Accept": "text/javascript, text/json" },
        data: {
            login: options.user,
            token: options.token,
            description: text
        }
    }, function(html) {
        result.updated = true;
        if (callback) callback(result);
    });
    return result;
};

var update = exports.update = function update(files, text, options, callback) {
    var descriptionDone = filesDone = false;
    if (text) {
        description(text, options, function() {
            descriptionDone = true;
            if (callback && filesDone) callback();
        });
    } else {
        descriptionDone = true;
    }
    if (!files) filesDone = true;
    else {
        var data = {
            login: options.user,
            token: options.token,
            _method: "put"
        };
        for (var name in files) {
            data["file_name[" + name + "]"] = name;
            data["file_ext[" + name + "]"] = name.substr(name.lastIndexOf("."));
            var content = files[name];
            if (content !== null) data["file_contents[" + name + "]"] = content;
        }
        edit(options.id, options, function(response) {
            var count = 0;
            xhr({
                url: "https://gist.github.com/gists/" + response.hash,
                headers: { "Accept": "text/javascript, text/json" },
                method: "POST",
                data: data
            }, function() {
                filesDone = true;
                if (callback && descriptionDone) callback();
            })
        });
    }
    return result;
};

var list = exports.list = function list(options, callback) {
    var result = {};
    var index = 1;
    var data = {
        "login": options.user,
        "token": options.token,
    };
    function fetch(index) {
        if (index) data.page = index;
        xhr({
            url: "http://gist.github.com/mine/",
            method: "POST",
            headres: { "Accept": "text/javascript, text/json" },
            data: data
        }, collect);
    }
    function collect(html) {
        var gist, match = /file\s*(private|public)[\s\S]*?gist:\s*(\w*)[\s\S]*?<span[^>]*>(\w*)/g;
        var i = 0;
        while (gist = match.exec(html)) {
            i ++;
            result[gist[2]] = {
                id: gist[2],
                description: gist[3],
                isPrivate: (gist[1] == "private")
            };
        }
        if (i) fetch(++index);
        else callback(result);
    }
    fetch();
    return result;
};
