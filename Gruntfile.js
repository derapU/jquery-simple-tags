module.exports = function( grunt ) {

  // Project configuration.
  grunt.initConfig( {
    // Metadata.
    pkg: grunt.file.readJSON( 'simple-tags.jquery.json' ),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/js/jquery.simple-tags.js'],
        dest: 'dist/jquery.simple-tags.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        sourceMap: true,
        sourceMapIncludeSources: true
      },
      dist: {
        src: 'src/js/**/*.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
    },
    less: {
      example: {
        options: {
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapUrl: 'style.css.map',
          sourceMapFilename: 'dist/style.css.map'
        },
        files: {
          'dist/style.css': 'src/less/main.less',
        }
      },
      simpletag: {
        options: {
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapUrl: 'jquery-simple-tags.css.map',
          sourceMapFilename: 'dist/jquery-simple-tags.css.map'
        },
        files: {
          'dist/jquery-simple-tags.css': 'src/less/jquery-simple-tags.less'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 9'],
        map: {
          prev: 'dist/',
          inline: false
        }
      },
      example: {
        src: 'dist/style.css',
        dest: 'dist/style.css'
      },
      simpletag: {
        src: 'dist/jquery-simple-tags.css',
        dest: 'dist/jquery-simple-tags.css'
      }
    },
    watch: {
      scripts: {
        files: ['src/js/**/*.js'],
        tasks: ['uglify'],
        options: {
          spawn: false,
        },
      },
      less: {
        files: ['src/less/**/*.less'],
        tasks: ['less','autoprefixer'],
        options: {
          spawn: false,
        },
      },
    },
  } );

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks( 'grunt-contrib-less' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-autoprefixer' );
  grunt.loadNpmTasks( 'grunt-contrib-clean' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );

  // Default task.
  grunt.registerTask( 'default', ['clean', 'concat', 'uglify'] );

};
