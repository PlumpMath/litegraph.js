

module.exports = function (grunt) {

    var path = require('path');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat_in_order: {
            your_target: {
                files: {
                    'dist/shader_nodes.js': [ 'src/shader_nodes/**/*.js'],
                    'dist/<%= pkg.name %>.js': [ 'src/<%= pkg.name %>.js']
                },
                options: {

                }
            }
        },
        strip_code: {
            options: {
                pattern: /(require|declare)\((.*?)\);/g
            },
            your_target: {
                src: 'dist/<%= pkg.name %>.js'
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/shader_nodes.min.js': ['<%= Object.keys(concat_in_order.your_target.files)[0] %>'], // to extract the destination file from concat
                    'dist/<%= pkg.name %>.min.js': ['<%= Object.keys(concat_in_order.your_target.files)[1] %>'] // to extract the destination file from concat
                }
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        jshint: {
            files: ['src/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: false,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-concat-in-order');
    grunt.loadNpmTasks('grunt-strip-code');

    grunt.registerTask('test', ['jshint', 'qunit']);

    grunt.registerTask('default', ['qunit', 'jshint', 'concat_in_order', 'strip_code', 'uglify']);

};