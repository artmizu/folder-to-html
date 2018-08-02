# Generate static HTML overview of folder
Allows you to create a static HTML page from a folder.

Folder:

![alt text](https://raw.githubusercontent.com/artmizu/folder-to-html/master/readme/input.png)


Output HTML:

![alt text](https://raw.githubusercontent.com/artmizu/folder-to-html/master/readme/output.png)

If you send along with other files to a remote server and then open folder overview through a browser, you can see which files are on the server. I use it with [Surge](http://surge.sh/).

### [Demo](http://05.dev.artmizu.ru)

## You can use script in Gulp task
```javascript
directoryOverview = require('folder-to-html');

gulp.task('overview', function() {
  directoryOverview({
    exclude: [
      /\.git/,
      /node_modules/
    ]
  });
});
```

## Options
You can pass options to function:
```javascript
directoryOverview({ opts });
```

### Available
* __folder__ (String) path to folder. Default value is _./_;
* __extensions__ (RegExp|RegExp[]) A RegExp or an array of RegExp to test for exlusion of directories;
* __exclude__ (RegExp) A RegExp to test for exclusion of files with the matching extension;
* __fileName__ (String) output HTML file name;
