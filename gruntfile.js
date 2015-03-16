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
        neuter: {
            nodes: {
                options:{
                    template: "{%= src %}",
                    basePath: 'src/shader_nodes/'
                },
                src: [ 'src/shader_nodes/**/*.js'],
                dest: 'dist/nodes_for_shader_editor.js'
            },
            litegraph: {
                options:{
                    template: "{%= src %}"
                },
                src: [ 'src/core/*.js', 'src/shader_lib/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        replace: {
            remove_declares: {
                src: ['dist/<%= pkg.name %>.js', 'dist/nodes_for_shader_editor.js'],
                dest: ['dist/'],
                replacements: [
                    {
                        from: /(require|declare)\((.*?)\);/g,
                        to: ''
                    }
                ],
            },
            populate_projects: {
                src: ['dist/<%= pkg.name %>.js', 'dist/nodes_for_shader_editor.js'],
                dest: ['../vik-shader-editor/js/external/'],
                replacements: [
                    {
                        from: /(require|declare)\((.*?)\);/g,
                        to: ''
                    }
                ],
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/nodes_for_shader_editor.min.js': ['<%= Object.keys(concat_in_order.your_target.files)[0] %>'], // to extract the destination file from concat
                    'dist/<%= pkg.name %>.min.js': ['<%= Object.keys(concat_in_order.your_target.files)[1] %>'], // to extract the destination file from concat
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
    grunt.loadNpmTasks('grunt-neuter');


    grunt.registerTask('default', ['qunit', 'jshint', 'concat_in_order', 'replace:remove_declares', 'uglify']);
    grunt.registerTask('build', ['qunit', 'jshint', 'neuter:nodes', 'neuter:litegraph', 'replace:remove_declares', 'uglify']);
    grunt.registerTask('build_and_fill_projects', ['qunit', 'jshint', 'neuter:nodes', 'neuter:litegraph', 'replace:populate_projects', 'uglify']);
    grunt.registerTask('fill_projects', ['qunit', 'jshint', 'concat_in_order', 'replace:populate_projects', 'uglify']);


}
;