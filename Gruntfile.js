var mozjpeg = require('imagemin-mozjpeg'),
    path = require('path');

var lessCreateConfig = function(context, block) {
    var cfg = {
        files: []
    };
    var outfile = path.join(context.outDir, block.dest);
    var filesDef = {

    };

    filesDef.dest = outfile;
    filesDef.src = [];

    context.inFiles.forEach(function(inFile) {
        filesDef.src.push(path.join(context.inDir, inFile));
    });

    cfg.files.push(filesDef);
    context.outFiles = [block.dest];
    return cfg;
};

require('dotenv-safe').load({
    allowEmptyValues: true
});

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
            ' * <%= pkg.name %> (<%= pkg.description %>)\n' +
            ' * (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>.\n' +
            ' */\n\n',

        availabletasks: {
            tasks: {
                options: {
                    filter: 'include',
                    tasks: ['tasks', 'build', 'serve']
                }
            }
        },

        path: {
            pub: process.env.PATH_PUB,
            npm: process.env.PATH_NPM,
            src: process.env.PATH_SRC,
            tmp: process.env.PATH_TMP
        },

        clean: {
            dist: '<%= path.pub %>',
            mini: {
              src: ['<%= clean.minl %>/*.{css,js}'],
              filter: function(filepath) {
                return (filepath.indexOf('.min.') === -1);
              },
            },
            minl: '<%= path.pub %>/{css,js}',
            temp: '<%= path.tmp %>'
        },

        concat: {
            options: {
                sourceMap: true,
                sourceMapStyle: 'inline'
            },
            dist: {
                options: {
                    stripBanners: true,
                    sourceMap: false
                },
                files: [{
                    src: '<%= path.tmp %>/js/script.js',
                    dest: '<%= path.pub %>/js/script.js'
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= path.tmp %>',
                    src: [
                        'css/**/*.css',
                        'fonts/**/*.{eot,svg,ttf,woff,woff2}',
                        'img/**/*.{svg,webp}',
                        '*.html'
                    ],
                    dest: '<%= path.pub %>'
                }]
            },
            temp: {
                files: [{
                    expand: true,
                    cwd: '<%= path.src %>',
                    src: [
                        'fonts/**/*.{eot,svg,ttf,woff,woff2}',
                        'img/**/*.{gif,jpg,jpeg,png,svg,webp}',
                        'tpl/**/*.html'
                    ],
                    dest: '<%= path.tmp %>'
                }]
            }
        },

        connect: {
            server: {
                options: {
                    useAvailablePort: true,
                    base: '<%= path.tmp %>',
                    livereload: true,
                    open: true,
                    hostname: process.env.HOSTNAME
                }
            }
        },

        cssmin: {
            options: {
                sourceMap: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= path.tmp %>',
                    src: ['css/*.css', '!css/*.min.css'],
                    dest: '<%= path.pub %>',
                    ext: '.min.css'
                }]
            }
        },

        htmlmin: {
            options: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeOptionalTags: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeTagWhitespace: true,
                useShortDoctype: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= path.pub %>',
                    src: [
                        '*.html'
                    ],
                    dest: '<%= path.pub %>'
                }]
            }
        },

        imagemin: {
            options: {
                optimizationLevel: 3,
                svgoPlugins: [{
                    removeViewBox: false
                }],
                use: [mozjpeg()]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= path.tmp %>',
                    src: ['img/**/*.{gif,jpg,jpeg,png}'],
                    dest: '<%= path.pub %>'
                }]
            }
        },

        includereplace: {
            options: {
                prefix: '<!-- @@',
                suffix: ' -->',
                includesDir: '<%= path.tmp %>/tpl/partials',
                globals: {
                    debug: process.env.DEBUG,
                    sitename: process.env.SITENAME
                }
            },
            temp: {
                files: [{
                    expand: true,
                    cwd: '<%= path.tmp %>/tpl',
                    src: [
                        '*.html'
                    ],
                    dest: '<%= path.tmp %>'
                }]
            }
        },

        inline: {
            options: {
                tag: ''
            },
            dist: {
                src: [
                    '<%= path.pub %>/*.html'
                ],
                overwrite: true
            }
        },

        less: {
            options: {
                sourceMap: true,
                sourceMapFileInline: true
            }
        },

        replace: {
            dist: {
                src: [
                    '<%= path.pub %>/*.html'
                ],
                overwrite: true,
                replacements: [{
                    from: /(<link href="css\/|<script src="js\/)(.*?)(\.css" rel="stylesheet">|\.js"><\/script>)/g,
                    to: function (str, index, text, matches) {
                        var last = matches.pop();
                        return matches.join('') + '.min' + last;
                    }
                }, {
                    from: /\/\*([\s\S]*?)\*\/[\n]/g,
                    to: ''
                }]
            },
            temp: {
                src: [
                    '<%= path.tmp %>/**/*.{css,js}'
                ],
                overwrite: true,
                replacements: [{
                    from: /\/\*([\s\S]*?)\*\/[\n]/g,
                    to: ''
                }, {
                    from: /^(?=\n)$|^\s*|\s*$|\n\n+/gm,
                    to: ''
                }]
            }
        },

        uglify: {
            options: {
                compress: {
                    warnings: false
                },
                mangle: true
            },
            dist: {
                files: [{
                    src: '<%= path.pub %>/js/script.js',
                    dest: '<%= path.pub %>/js/script.min.js'
                }]
            }
        },

        uncss: {
            temp: {
                files: {
                    '<%= path.tmp %>/css/style.css': ['<%= path.tmp %>/*.html']
                }
            }
        },

        usebanner: {
            options: {
                position: 'top',
                banner: '<%= banner %>',
                linebreak: false
            },
            dist: {
                files: {
                    src: [
                        '<%= path.pub %>/css/*.css',
                        '<%= path.pub %>/js/*.js'
                    ]
                }
            },
            mini: {
                files: {
                    src: [
                        '<%= path.pub %>/css/*.min.css',
                        '<%= path.pub %>/js/*.min.js'
                    ]
                }
            }
        },

        usemin: {
            options: {
                assetsDirs: [
                    '<%= path.tmp %>'
                ],
                blockReplacements: {
                    less: function(block) {
                        return '<link href="' + block.dest + '" rel="stylesheet">';
                    }
                }
            },
            css: [
                '<%= path.tmp %>/assets/css/{,*/}*.css'
            ],
            html: [
                '<%= path.tmp %>/tpl/**/*.html'
            ]
        },

        useminPrepare: {
            html: '<%= path.src %>/tpl/partials/*.html',
            options: {
                dest: '<%= path.tmp %>',
                staging: '<%= path.tmp %>',
                flow: {
                    steps: {
                        js: [
                            'concat'
                        ],
                        less: [{
                            name: 'less',
                            createConfig: lessCreateConfig
                        }]
                    },
                    post: {}
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            grunt: {
                options: {
                    nospawn: true
                },
                files: ['Gruntfile.js', 'package.json'],
                tasks: ['serve']
            },
            src: {
                files: [
                    '.env',
                    '.env.example',
                    '<%= path.src %>/fonts/**/*.{eot,svg,ttf,woff,woff2}',
                    '<%= path.src %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}',
                    '<%= path.src %>/js/**/*.js',
                    '<%= path.src %>/less/**/*.less',
                    '<%= path.src %>/tpl/**/*.html'
                ],
                tasks: ['temp']
            },
            temp: {
                files: ['<%= path.tmp %>/**/*']
            }
        }
    });

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.registerTask('default', [
        'tasks'
    ]);

    grunt.registerTask('tasks', 'List available Grunt tasks & targets.', [
        'availabletasks'
    ]);

    grunt.registerTask('build', 'Build sources files into public directory.', [
        process.env.INLINE
          ? 'minl'
          : process.env.MINIFY
            ? 'mini'
            : 'dist'
    ]);

    grunt.registerTask('serve', 'Start the local server with livereload for development purposes.', [
        'temp',
        'connect',
        'watch'
    ]);

    grunt.registerTask('dist', [
        'clean',
        'temp',
        'concat:dist',
        'copy:dist',
        'imagemin:dist',
        'usebanner:dist'
    ]);

    grunt.registerTask('mini', [
        'dist',
        'cssmin:dist',
        'uglify:dist',
        'replace:dist',
        'usebanner:dist',
        'clean:mini'
    ]);

    grunt.registerTask('minl', [
        'mini',
        'inline:dist',
        'replace:dist',
        'htmlmin:dist',
        'clean:minl'
    ]);

    grunt.registerTask('temp', [
        'copy:temp',
        'useminPrepare',
        'concat:generated',
        'less:generated',
        'usemin',
        'includereplace:temp',
        'uncss:temp',
        'replace:temp'
    ]);
};
