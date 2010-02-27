use "https://gist.github.com/raw/9b427dd1b238aa1c16db/a605e55e5a67ae6bb00669beea7e4bb6b98cfe31/github.gists.xml";
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
    true
)

use "https://gist.github.com/raw/9b427dd1b238aa1c16db/a605e55e5a67ae6bb00669beea7e4bb6b98cfe31/github.gists.xml";
select * from github.gists where user = "gozala" and description = "metadocs"