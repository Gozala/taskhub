exports.write = function write(path, content, options) {
    var data = (options.isPrivate) ? "action_button=private&" : "";
    if (options.user) data += "login=" + options.user + "&";
    if (options.token) data += "token=" + options.token + "&";
    data += "file_name[gistfile1]=" + encodeURIComponent(path) + "&"
        + "file_ext[gistfile1]=" + encodeURIComponent(options.extension) + "&"
        + "file_contents[gistfile1]=" + encodeURIComponent(content).toString();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://gist.github.com/gists", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Accept", "text/javascript");
    xhr.send(data);
    return xhr;
}

function gist(files, isPrivate) {
    var count = 0, data = {};
    var data = (isPrivate) ? "action_button=private&" : "";
    for (var key in files) {
        if (count ++ > 10) break;
        data += "file_name[gistfile" + count +"]="
            + encodeURIComponent(key) + "&"
            + "file_ext[gistfile" + count + "]=undefined&"
            + "file_contents[gistfile" + count + "]="
            + encodeURIComponent(files[key]).toString() + "&";
    }
    data = content.substring(0, data.length);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://github.com/gists", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Accept", "text/javascript");
    xhr.send(data);
    return xhr;
}