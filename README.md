#squishifier#
**A script for the lazy** to **optimise**, **minify**, **remove redundancies** and **compress** any small static web project. 

By simply **copying your source folder into the 'input' folder** and running the script will create a second project folder **'output' along with a zip** - ready to deploy to your server!


##Installation##
* Clone this repo, or [download the zip from github](https://github.com/designerzen/squishifier/archive/master.zip)
* Install [NodeJS from nodejs.org](http://nodejs.org/)
* Open a Command Line / Dos Prompt in the root of this folder
* At the prompt type : npm install
* Wait patiently
* Now follow the options below to build your platform


##Instructions##
After you have followed the instructions to install this application...
In a command prompt at the root of your project, type any of the following :
	
_Squishes, Minifies and Optimises your Code_
> gulp

##Examples##

**Copying the following files into input :**
```
input/webproject/img/logo.png
input/webproject/js/script.js
input/webproject/css/style.css
input/webproject/index.html
```
> gulp 

**results in these minified versions :**
```
output/webproject/img/logo.png
output/webproject/js/script.js
output/webproject/css/style.css
output/webproject/index.html
```
**and the following zip archive :**
```
output/webproject.zip
```

##Advanced##
There are a number of tasks that can help you to build faster

> gulp scripts

> gulp css

> gulp html

> gulp fonts

> gulp images

> gulp zip