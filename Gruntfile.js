module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dist: 'dist',
    src: 'src',
    templates: 'template',
    module: 'ng.tooltip',
    filename: 'ng-tooltip',
    meta: {
      banner: ['/*',
        ' * <%= pkg.name %>',
        ' * <%= pkg.description %>',
        ' * <%= pkg.author %>\n',
        ' * Version: <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
        ' * License: <%= pkg.license %>',
        ' */\n'].join('\n')
    },
    clean: {
      build: {
        src: ["<%= dist %>"]
      }
    },
    concat: {
      dist: {
        options: {
          banner: '<%= meta.banner %>\n'
        },
        src: ['<%= src %>/app.js', '<%= src %>/position.js', '<%= src %>/ngTooltip.js'],
        dest: '<%= dist %>/<%= filename %>.js'
      }
    },
    ngAnnotate: {
      options: {
        // Task-specific options go here.
      },
      build: {
        files: { '<%= concat.dist.dest %>': ['<%= concat.dist.dest %>'] }
      }
    },
    html2js: {
      options: {
        module: '<%= module %>.tmpl',
        base: '<%= templates %>'
      },
      main: {
        src: ['<%= templates %>/**/*.html'],
        dest: '<%= dist %>/<%= filename %>.templates.js'
      }
    },
    sass: {
      options: {
        sourceMap: true,
        outputStyle: 'compressed',
        sourceComments: false
      },
      dist: {
        files: {
          '<%= dist %>/main.css': 'style/main.scss'
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['<%= concat.dist.dest %>', '<%= html2js.main.dest %>'],
        dest: '<%= dist %>/<%= filename %>.min.js'
      }
    },
    jshint: {
      files: ['src/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      watch: {
        background: true
      },
      continuous: {
        singleRun: true
      },
      jenkins: {
        singleRun: true,
        autoWatch: false,
        colors: false,
        reporters: ['dots', 'junit'],
        browsers: ['Chrome', 'ChromeCanary', 'Firefox', 'Opera', '/Users/jenkins/bin/safari.sh']
      },
      travis: {
        singleRun: true,
        autoWatch: false,
        reporters: ['dots'],
        browsers: ['Firefox']
      },
      coverage: {
        preprocessors: {
          'src/*/*.js': 'coverage'
        },
        reporters: ['progress', 'coverage']
      }
    }

  });

  grunt.registerTask('build', ['clean', 'sass', 'concat', 'ngAnnotate', 'html2js', 'uglify']);
  grunt.registerTask('default', ['build']);

};
