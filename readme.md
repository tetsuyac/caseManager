caseManager.1 Nov/3/2015, Tetsuya Chiba
===============

###### installation (osx, linux) modify accordingly in case of windows.
1. download caseManager.zip from <https://github.com/tetsuyac/caseManager.git>
1. unzip caseManager.zip
1. cd caseManager
1. npm install
1. cd server
1. mongo  (mongodb needs to be started already)
1. \> load("initMongoData.js")
1. \> exit
1. node server.js (node.js needs to be started already)
1. http://localhost:3000/ (once asked, password is 6 characters or more)
1. have a fun!

* a case can be created / edited / searched / deleted.
* a case set can be viewed through a style of card or list.
* the app behaves in responsive way for a series of size of devices.

1. feature set is incomplete in being process to be finalized.
1. no testings has been performed yet so the feature set in this app is still rough (a very first add case failed for example) this version of code set is for a code reviewing purpose only. 
1. MIT license to the code set based on this project will be lifted once code refactoring is completed.
1. /