use "http://gozala.github.com/taskhub/resource/github.gists.xml";
INSERT INTO github.gists (
    user,
    token,
    name,
    content,
    isPrivate
) VALUES (
    "gozala",
    "aa8610a73390ea8b6ae9216589494ef9",
    "test.md",
    "Attempt to create gist using [YQL](https://developer.yahoo.com/yql/).
    
Table from Irakli Gozalishvili",
    1
)

use "http://gozala.github.com/taskhub/resource/github.gists.xml";
select * from github.gists where user = "gozala" and description = "metadocs"