/*

This handles the compilation of the source elements :

1. Read INPUT dir and fetch SOURCE folders
2. Recreate folder structures in OUTPUT
3. Minify, Uglify JS and copy to OUTPUT
4. Squish Images (png, jpeg, gif, webm, svg) to OUTPUT
5. Remove redundant CSS rules and minify to OUTPUT
6. 

For help with Globbing Patterns (the defaults should be fine!) check out :
http://gruntjs.com/configuring-tasks#globbing-patterns

*/

// =======================---------------- CONFIGURATION --------------------

var SOURCE_FOLDER 			= 'input/';			// Where the Source folder lives
var BUILD_FOLDER 			= 'output/';		// Where the build results

// Where do our source files live?
var source = 
{
	// JavaScripts
	scripts :'**/**/**/*.js',
	// Cascading Style Sheets
	styles 	: '**/**/**/*.css',
	// Html / xHtml
	html 	: '**/**/**/*.html',
	// Image Files
	images	: '**/**/**/*.+(png|jpg|jpeg|gif|webp|svg)',
	// Fonts 
	fonts	: '**/**/**/*.+(svg|eot|woff|ttf|otf)'
};

// Where shall we compile them to?
var structure = {
	scripts : '',
	styles 	: '',
	html 	: '',
	images	: '',
	fonts	: ''
};

// Where shall we compile them to?
var getDestinations = function( dir ) {
	return {
		scripts : dir + structure.scripts,
		styles 	: dir + structure.styles,
		html 	: dir + structure.html,
		images	: dir + structure.images,
		fonts	: dir + structure.fonts
	};
};

///////////////////////////////////////////////////////////////////////////////////
// File name format for creating distributions
// You can set this to however your campaign needs
// Defaults to brand-type-variant.zip
// Fetch and create a nice filename that excludes punctuation
// and spaces are a no-go too...
///////////////////////////////////////////////////////////////////////////////////
var sanitiseFileName = function( fileName, suffix ){
	var name = fileName.replace(/ +?/g, '_');
	// swap out full stops for hyphens (mainly for versioning)
	name = name.replace(/\./g, "-");
	// remove not allowed characters...
	name = name.replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#\$%&\(\)\*\+,\/:;<=>\?@\[\]\^_`\{\|\}~]/g, "_");
	// make sure we have a suffix if needed
	if (suffix) name += suffix;
	return name.toLowerCase();
};

///////////////////////////////////////////////////////////////////////////////////
// Fetch all folder names in DIR
///////////////////////////////////////////////////////////////////////////////////
var getFolders = function (dir){
    return fs.readdirSync(dir)
			.filter(function(file){
				return fs.statSync(path.join(dir, file)).isDirectory();
			});
}
// =======================---------------- IMPORT DEPENDENCIES --------------------

// Requirements for this build to work :
var config = require('./config.json');			// config file!
var gulp = require('gulp');						// gulp!
var fs = require('fs');							// read inside files
var del = require('del');						// delete things and folders
var path = require('path');						// path creating utilities
var es = require('event-stream');				// combine streams
var gulpif = require('gulp-if');				// conditional compiles
var newer = require('gulp-newer');				// deal with only modified files
var replace = require('gulp-replace');			// replace content within files
var rename = require('gulp-rename');			// rename files
var expect = require('gulp-expect-file');		// expect a certain file (more for debugging)
var sequencer = require('run-sequence');		// run synchronously
var console = require('better-console');		// sexy console output
var merge = require('merge-stream');			// combine multiple streams!

var folders = getFolders( SOURCE_FOLDER );
	
// Where shall we compile them to?
var destination = getDestinations( BUILD_FOLDER );

// Create build folder if it does not exist...
if(!fs.existsSync( BUILD_FOLDER ))
{
    fs.mkdirSync( BUILD_FOLDER, 0766, function(err){
		if(err)
		{ 
			console.log(err);
			response.send("ERROR! Can't make the directory! \n");    // echo the result back
		}
    });   
}
console.log( 'Reading ' + folders.length + ' Folders : ' + folders );
	
// =======================---------------- TASK DEFINITIONS --------------------

///////////////////////////////////////////////////////////////////////////////////
//
// TASK 	: Clean
// ACTION 	: Deletes all files and folders specified in the arguments
//
///////////////////////////////////////////////////////////////////////////////////
gulp.task('clean', function(cb) {
	// You can use multiple globbing patterns as you would with `gulp.src`
	del([BUILD_FOLDER], cb);
	
});


// Image Tasks ====================================================================
///////////////////////////////////////////////////////////////////////////////////
//
// TASK 	: Images
// ACTION 	: Compress images and copy to destinations
//
///////////////////////////////////////////////////////////////////////////////////
gulp.task('images', function(){
	
	// Image Plugins
	var imagemin = require('gulp-imagemin');		// squish images
	var pngquant = require('imagemin-pngquant');	// png squisher
	var jpegoptim = require('imagemin-jpegoptim');	// jpg squisher ( with file size imiter :) )

	var streams = folders.map(function(folder){
		
		var inputFolder 	= path.join( SOURCE_FOLDER, folder, source.images ),
			outputFolder 	= path.join( BUILD_FOLDER, folder );
	
		// now we are in each folder!
		return gulp.src( inputFolder )
			.pipe( newer( outputFolder ) )
			//.pipe( imagemin( config.images ) )
			//.pipe( pngquant({optimizationLevel: 3})() )
			//.pipe( jpegoptim({ size:MAX_SIZE_JPEG })() )
			.pipe( gulp.dest( outputFolder ) );
	});

	return es.concat.apply(null, streams);
});

// Cascading Style Sheets =========================================================
///////////////////////////////////////////////////////////////////////////////////
//
// TASK 	: CSS
// ACTION 	: Compiles a single Less files specified into a single CSS file
//
//.pipe( newer( destination.styles ) )
//		
///////////////////////////////////////////////////////////////////////////////////

gulp.task('css', function(){
	// CSS Plugins
	var prefixer = require('gulp-autoprefixer');    // add missing browser prefixes
	var uncss = require('gulp-uncss');				// remove unused css

	var streams = folders.map(function(folder){
		
		var sourceFolder 	= path.join( SOURCE_FOLDER, folder ),
			inputFolder 	= path.join( SOURCE_FOLDER, folder, source.styles ),
			outputFolder 	= path.join( BUILD_FOLDER, folder );
	
		// now we are in each folder!
		return gulp.src( inputFolder )
			// Check to see if the CSS actually has changed since last compile 
			.pipe( newer( outputFolder ) )
			// Remove unused CSS that is not referenced in index.html
			.pipe( uncss({
				html: [ outputFolder +'/index.html' ]
			}) )
			.pipe( prefixer() )
            .pipe( gulp.dest( outputFolder ) );
	});

	return es.concat.apply(null, streams);
});


// Copy Files =====================================================================
///////////////////////////////////////////////////////////////////////////////////
//
// TASK 	: Copy Fonts
// ACTION 	: Makes duplicates of specified files in the destination folders
//
///////////////////////////////////////////////////////////////////////////////////
gulp.task('fonts', function(){
	
	var streams = folders.map(function(folder){

		var inputFolder 	= path.join( SOURCE_FOLDER, folder, source.fonts ),
			outputFolder 	= path.join( BUILD_FOLDER, folder );
	
		// now we are in each folder!
		return gulp.src( inputFolder )
			.pipe( newer( outputFolder ) )
			.pipe( gulp.dest( outputFolder ) );
	});

	return es.concat.apply(null, streams);
});

// Scripts ========================================================================
///////////////////////////////////////////////////////////////////////////////////
//
// TASK 	: Scripts
// ACTION 	: Compress and concantenate our Javascript files into one file
//
///////////////////////////////////////////////////////////////////////////////////

// Test the build and zip it up
gulp.task('scripts', function(){
	
	var uglify = require('gulp-uglify');            // squash files
	var jshint = require('gulp-jshint');			// lint!
	var stripDebug = require('gulp-strip-debug');	// strip out all calls to console!
	
	var streams = folders.map(function(folder){
		
		var inputFolder 	= path.join( SOURCE_FOLDER, folder, source.scripts ),
			outputFolder 	= path.join( BUILD_FOLDER, folder );
	
		// now we are in each folder!
		return gulp.src( inputFolder )
				.pipe( jshint('.jshintrc'))
				.pipe( jshint.reporter('default') )
				.pipe( stripDebug() )
				.pipe( uglify() )
				.pipe( gulp.dest(outputFolder) );
	});

	return es.concat.apply(null, streams);
});

///////////////////////////////////////////////////////////////////////////////////
//
// TASK 	: Html
// ACTION 	: Create a Zip file for each folder in the OUTPUT folder
//
///////////////////////////////////////////////////////////////////////////////////

gulp.task('html', function(){
	
	var htmlmin = require('gulp-htmlmin');			// squish html
	var streams = folders.map(function(folder){
		
		var inputFolder 	= path.join( SOURCE_FOLDER, folder, source.html ),
			outputFolder 	= path.join( BUILD_FOLDER, folder, "/" );
	
		console.error( inputFolder, outputFolder );
			
		// now we are in each folder!
		return gulp.src( inputFolder )
				.pipe( htmlmin( config.html ) )
				.pipe( gulp.dest(outputFolder) );
	});

	return es.concat.apply(null, streams);
});

///////////////////////////////////////////////////////////////////////////////////
//
// TASK 	: Zip
// ACTION 	: Create a Zip file for each folder in the OUTPUT folder
//
///////////////////////////////////////////////////////////////////////////////////
gulp.task('zip', function (cb) {

	// show an error if they have not been built
	var builds = getFolders( BUILD_FOLDER );
	
	if ( builds.length < 1 )
	{
		console.error( 'ERROR : Cannot find any folders in '+BUILD_FOLDER+' to build' );
		console.error( 'ERROR : Perhaps you have forgotten to "gulp build" your project first?' );
	}
	
	var zip = require('gulp-zip');					// zip files
	var filesize = require('gulp-size');  			// measure the size of the project (useful if a limit is set!)
	var merged = merge();

	// Loop through each folder in output and zip...
	var streams = builds.map(function(folder){
		
		// output filename
		var fileName 		= sanitiseFileName( folder, ".zip" );
		var inputFolder 	= path.join( BUILD_FOLDER, folder, '**/*' );
		
		var zipper = gulp.src( inputFolder )
					.pipe( zip(fileName) )
					.pipe( filesize( {title:fileName, showFiles:false } ) )
					.pipe( gulp.dest( BUILD_FOLDER ) );
				
		merged.add( zipper );
	});
	
	return merged;
});

///////////////////////////////////////////////////////////////////////////////////
// COMPOSITE TASKS =====================================================
///////////////////////////////////////////////////////////////////////////////////

/*

All Available Tasks :
	
	scripts
	css
	html
	fonts
	images
	
	zip

*/

// compile all assets & squish
gulp.task('build', function(callback) {
	sequencer(
		[ 'html', 'images', 'scripts', 'fonts' ],
		'css',
    callback);
});

// The task to create the minified versions
gulp.task('compile', function(callback) {
	sequencer(
		'clean',
		'build',
		'zip',
    callback);
});

///////////////////////////////////////////////////////////////////////////////////
// The default task (called when you run 'gulp' from cli)
///////////////////////////////////////////////////////////////////////////////////
gulp.task('default', ['compile'] );