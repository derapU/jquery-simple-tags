module.exports = function( grunt ) {

  // Project configuration.
  grunt.initConfig( {
    // Metadata.
    pkg: grunt.file.readJSON( 'simpletag.jquery.json' ),
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
        src: ['src/js/jquery.simpletag.js'],
        dest: 'dist/jquery.simpletag.js'
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
          sourceMapFilename: 'style.css.map'
        },
        files: {
          'dist/style.css': 'src/less/main.less',
        }
      },
      simpletag: {
        options: {
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapFilename: 'jquery-simpletag.css.map'
        },
        files: {
          'dist/jquery-simpletag.css': 'src/less/jquery-simpletag.less'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 9'],
        map: true,
        inline: false
      },
      example: {
        src: 'dist/style.css',
        dest: 'dist/style.css'
      },
      simpletag: {
        src: 'dist/jquery-simpletag.css',
        dest: 'dist/jquery-simpletag.css'
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
