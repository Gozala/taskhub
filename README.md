Tuskhub is a web application for managing tasks / notes 
=======================================================

In order to use **[Taskhub] demo** and be able to store data remotely you need
to provide your Github user name _(not an email and it is case sensitive)_ and
[Github API Token].  
_Note: Try using `Tab` and `Enter` keys to switch between \ create new tasks_ 


Taskhub is a prototype of a backend-less HTML5 based application, build on top
of [CommonJS packages]. Application uses Github [Gist] as a remote datastorage.
It saves tasks / notes a [Markdown] formatted list on the users private gist.
All the communication is done using XMLHttpRequests relying on 
[Access-Control-Allow-Origin] which is supported by all modern browsers.

Application can be used offline since it's build with [HTML5 Offline caching
API's] in mind. Tasks / Notes can be updated while being offline as well since
[localStorage] is used to cache store and cache data locally.

Application uses CommonJS [github lib] in order for reading and writing gists.
Communication is goes through the [YQL] pipe which unlike Github puts
`Access-Control-Allow-Origin: *` header to their http responses.  

Application UI is build using [CSS3] and features some [CSS transitions].

TaskHug is a JavaScript cloud application without backend. It uses [YQL] and 
Github [Gist] service to manage persistence in cloud.


Author
------
- Irakli Gozalishvili

Contributors
------------
- Irakli Gozalishvili

----
TuskHub is Copyright (c)2009 [Irakli Gozalishvili]

[Irakli Gozalishvili]:http://gozala.github.com/
[HTML5 Offline caching API's]:http://www.w3.org/TR/offline-webapps/#offline
[CommonJS packages]:http://wiki.commonjs.org/wiki/Packages
[Taskhub]:http://gozala.github.com/taskhub/
[Github API Token]:https://github.com/account/#git_config
[Gist]:http://gist.github.com/gists
[Markdown]:http://daringfireball.net/projects/markdown/
[Access-Control-Allow-Origin]:http://www.w3.org/TR/cors/
[localStorage]:http://www.w3.org/TR/offline-webapps/#related
[github lib]:http://github.com/Gozala/github/
[YQL]:http://developer.yahoo.com/yql/
[CSS3]:http://www.w3.org/Style/CSS/current-work#CSS3
[CSS transitions]:http://www.w3.org/TR/css3-transitions/