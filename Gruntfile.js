module.exports = function(grunt) {

  var source_directory = 'src',
      target_directory = 'dist';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    coffee: {
      compile: {
        expand: true,
        cwd: source_directory + '/js',
        src: ['**/*.coffee'],
        dest: '.tmp/js',
        ext: '.js'
      }
    },
    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: source_directory,
          src: ['**/*.{jpg,ico,gif,png,js,eot,svg,ttf,woff,php,html}'],
          dest: target_directory
        }, {
          expand: true,
          cwd: '.tmp/js',
          src: ['**/*.js'],
          dest: target_directory + '/js'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: source_directory,
          src: ['**/*.{ico,eot,woff,ttf,php}'],
          dest: target_directory
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: source_directory,
          src: ['**/*.html'],
          dest: target_directory,
          ext: '.html'
        }]
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: source_directory,
          src: ['img/**/*.{png,gif,jpg}'],
          dest: target_directory,
        }]
      }
    },
    less: {
      dev: {
        options: {
          cleancss: false
        },
        files: [{
          expand: true,
          cwd: source_directory,
          src: ['css/style.less'],
          dest: target_directory,
          ext: '.css'
        }]
      },
      dist: {
        options: {
          cleancss: true
        },
        files: [{
          expand: true,
          cwd: source_directory,
          src: ['css/*.less'],
          dest: target_directory,
          ext: '.css'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: source_directory,
          src: ['**/*.svg'],
          dest: target_directory,
        }]
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '/* Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %> */\n'
        },
        files: [{
          expand: true,
          cwd: source_directory,
          src: ['js/*.js'],
          dest: target_directory,
          ext: '.js'
        }, {
          expand: true,
          cwd: '.tmp/js',
          src: ['**/*.js'],
          dest: target_directory + '/js',
          ext: '.js'
        }]
      }
    },
    
    compress: {
      pack: {
        options: {
          archive: 'distribution.zip'
        },
        files: [{
          expand: true,
          cwd: target_directory,
          src: ['**'],
          dest: '/',
        }]
      }
    },
    concurrent: {
      dev: ['copy:dev', 'less:dev'],
      dist: ['copy:dist', 'less:dist', 'imagemin:dist', 'uglify:dist', 'svgmin:dist', 'htmlmin:dist'],
      watch: ['watch:copy', 'watch:less', 'watch:coffee']
    },
    clean: {
      statics: [target_directory],
      pack: ['distribution.zip'],
      postbuild: ['.tmp']
    },
    watch: {
      copy: {
        files: [source_directory + '/**/*.{jpg,ico,gif,png,js}'],
        tasks: ['copy:dev']
      },
      coffee: {
        files: [source_directory + '/js/**/*.coffee'],
        tasks: ['coffee:compile', 'copy:dev']
      },
      less: {
        files: [source_directory + '/css/*.less'],
        tasks: ['less:dev']
      }
    },
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-svgmin');

  grunt.registerTask('default', ['clean:statics', 'coffee:compile', 'concurrent:dev', 'clean:postbuild']);
  grunt.registerTask('spy', ['clean:statics', 'coffee:compile', 'concurrent:dev', 'concurrent:watch', 'clean:postbuild']);

  grunt.registerTask('dist', ['clean:statics', 'coffee:compile', 'concurrent:dist', 'clean:postbuild']);
  grunt.registerTask('pack', ['clean:statics', 'clean:pack', 'coffee:compile', 'concurrent:dist', 'compress:pack', 'clean:postbuild']);

};