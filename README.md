#squishifier#
**A script for the lazy** to **optimise**, **minify**, **remove redundancies** and **compress** any small static web project. 

By simply **copying your source folder into the 'input' folder** and running the script will create a second project folder **'output' _along with a zip_** - ready to deploy to your server!


##Installation##
* Clone this repo, or [download the zip from github](https://github.com/designerzen/squishifier/archive/master.zip)
* Install [NodeJS from nodejs.org](http://nodejs.org/) if you have not done so already
* Open a Command Line / Dos Prompt in the root of this folder
* At the prompt type : **npm install**
* _Wait patiently_
* Now follow the options below to optimise your application


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
Check out the **config.json** file for a variety of _advanced options_ that you can set to alter the behaviour of your app.
For documentation for the config file, please check out the **config.json.txt file**.

There are a number of indivual tasks that can help you to test compile faster.
NB. These are all run if you run just gulp on its own.

**Minifies, Uglifies and Squishes Javascript**
> gulp scripts

**Minifies, Optimises, Prefixes and removes redundant rules from CSS**
> gulp css

**Minifies html**
> gulp html

**Copies fonts**
> gulp fonts

**Copies images and compresses them accepts: jpg, png, gif,svg and webm**
> gulp images

**Creates a zip file of the folder's contents**
_**NB.** Does NOT contain the root folder_
> gulp zip