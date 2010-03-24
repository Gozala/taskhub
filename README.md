Tuskhub is a web application for managing tasks / notes 
=======================================================

In order to use **[Taskhub demo](http://gozala.github.com/taskhub/)** and be able to store data remotely you need to provide your Github user name _(not an email and it is case sensitive)_ and [Github API Token](https://github.com/account/#git_config).  
_Note: Try using `Tab` and `Enter` keys to switch between \ create new tasks_ 


Taskhub is a prototype of a backend-less HTML5 based application, build on top of [CommonJS packages](http://wiki.commonjs.org/wiki/Packages). Application uses [Github Gist](http://gist.github.com/gists) 
as a remote datastorage. It saves tasks / notes a [markdown](http://daringfireball.net/projects/markdown/)
formatted list on the users private gist. All the communication is done using XMLHttpRequests relying on [Access-Control-Allow-Origin](http://www.w3.org/TR/cors/) which is supported by all modern browsers. 

Application can be used offline since it's build with [HTML5 Offline caching API's](http://www.w3.org/TR/offline-webapps/#offline) in mind. Tasks / Notes can be updated while being offline as well since [localStorage](http://www.w3.org/TR/offline-webapps/#related) is used to cache store and cache data locally.

Application uses CommonJS [github lib](http://github.com/Gozala/github) in order for reading and writing
gists. Communication is goes through the [YQL](http://developer.yahoo.com/yql/) pipe which unlike Github puts
`Access-Control-Allow-Origin: *` header to their http responses.  

Application UI is build using [CSS3](http://www.w3.org/Style/CSS/current-work#CSS3) and features some [CSS transitions](http://www.w3.org/TR/css3-transitions/).   

TaskHug is a JavaScript cloud application without backend. It uses [YQL](1) and 
[Github Gists](2) service to manage persistence in cloud.    


Author
------
* Irakli Gozalishvili

Contributors
------------
* Irakli Gozalishvili


----------------------------
TuskHub is Copyright (c)2009 [Irakli Gozalishvili](http://gozala.github.com/)