/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
//    uglify: {
//      options: {
//        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//      },
//      build: {
//        src: 'src/controller/<%= pkg.name %>.js',
//        dest: 'build/<%= pkg.name %>.min.js'
//      }
//    }
        run: {
            server: {
                args: ['./bin/www']
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'testresults.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                    noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
                },
                src: ['./controller/*.spec.js']
            }
        },
        jslint: {// configure the task
            server: {
                src: [// some example files
                    './lib/*.js',
                    './controller/*.js',
                    './routes/*.js'
                ],
                exclude: [
                    './app.js'
                ],
                directives: {// example directives
                    node: true,
                    todo: true
                },
                options: {
                    edition: 'latest', // specify an edition of jslint or use 'dir/mycustom-jslint.js' for own path
                    junit: 'out/server-junit.xml', // write the output to a JUnit XML
                    log: 'out/server-lint.log',
                    jslintXml: 'out/server-jslint.xml',
                    errorsOnly: true, // only display errors
                    failOnError: false, // defaults to true
                    checkstyle: 'out/server-checkstyle.xml' // write a checkstyle-XML
                }
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-run');

    // Default task(s).
    grunt.registerTask('default', ['npm-install', 'mochaTest', 'jslint', 'run']);

};


