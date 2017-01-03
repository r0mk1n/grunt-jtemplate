/*
 * grunt-htmljson
 * https://github.com/jonjaques/grunt-htmljson
 *
 * Copyright (c) 2012 Jon Jaques, Tom Tang
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
    "use strict";

    function filenameToKey( filename, options ) {
        if ( options && options.hasOwnProperty( 'cwd' ) ) {
            filename = filename.replace( options.cwd, '', 'gi' );
        }
        filename = filename.split('.').shift();
        return filename;//.replace(/\//gi, '.');
    }

    function makeJson(files, options) {
        var defaults, o, result;
        defaults = {separator: null};
        result = {};
        o = grunt.util._.extend(defaults, options);

        files.map(function (filepath) {
            if ( options.hasOwnProperty( 'cwd' ) ) {
                filepath = options.cwd + filepath;
            }
            var html = grunt.file.read(filepath);
            result[filenameToKey( filepath, options )] = html;
        });

        return JSON.stringify(result, null, o.separator);
    }

    grunt.task.registerMultiTask('grunt-jtemplate', 'Compile html or any txt files into a json file.', function () {
        var self = this;

        var files;

        this.files.forEach(function (file) {
            files = file.src.filter(function (filepath) {
                // Remove nonexistent files (it's up to you to filter or warn here).
                if ( self.data.hasOwnProperty( 'cwd' ) ) {
                    filepath = self.data.cwd + filepath;
                }
                if ( grunt.file.isDir( filepath ) ) {
                    //grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });
        });

        if ( !this.data.options ) {
            this.data.options = {};
        }

        if ( this.data.hasOwnProperty('cwd') ) {
            this.data.options.cwd = this.data.cwd;
        }
        // Construct the JSON file.
        var json = makeJson( files, this.data.options);

        grunt.file.write(this.data.dest, json);

        // Fail task if errors were logged.
        if (this.errorCount) {
            return false;
        }

        // Otherwise, print a success message.
        grunt.log.verbose.ok(files.forEach(function (file) {
            return 'Template "' + file + '" added.';
        }));
        grunt.log.ok('File "' + this.data.dest + '" created.');

    });
};