module.exports = function (grunt) {


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat_in_order: {
            your_target: {
                files: {
                    'dist/nodes_for_shader_editor.js': [ 'src/shader_nodes/**/*.js'],
                    'dist/<%= pkg.name %>.js': [ 'src/core/*.js', 'src/shader_lib/**/*.js']
                },
                options: {

                }
            }
        },
        replace: {
            remove_declares: {
                src: ['dist/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js',
                replacements: [
                    {
                        from: /(require|declare)\((.*?)\);/g,
                        to: ''
                    }
                ],
            },
            union_shaders: {
                src: ['dist/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js',
                replacements: [
                    {
                        from: /(require|declare)\((.*?)\);/g,
                        to: ''
                    }
                ],
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/nodes_for_shader_editor.min.js': ['<%= Object.keys(concat_in_order.your_target.files)[0] %>'], // to extract the destination file from concat
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
    })
    ;

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-concat-in-order');
    grunt.loadNpmTasks('grunt-text-replace');



    grunt.registerTask('default', ['qunit', 'jshint', 'concat_in_order', 'replace:remove_declares', 'uglify']);

}
;