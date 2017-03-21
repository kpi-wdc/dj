import del from 'del';
import fs from 'fs';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import runSequence from 'run-sequence';

// HELPER FUNCTIONS
const isFlagPositive = (value) => value !== undefined && value !== 'false';

const isEnvEnabled = name => isFlagPositive(process.env[name]);

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// BUILD CONFIGURATION
const buildDir = '.tmp';
const buildPublicDir = '.tmp/public';
const libDir = "./assets/lib/**";
const libDestDir = buildPublicDir+'/js/lib'

// BUILD SETTINGS
const production = isEnvEnabled('PRODUCTION');
const minifyCode = production || isEnvEnabled('MINIFY_CODE');
const npmProduction = isEnvEnabled('NPM_CONFIG_PRODUCTION');

const showFilesLog = true;

// LOG SETTINGS
console.log(`Production mode: ${production}`);
console.log(`Minifying code: ${minifyCode}`);
// The following means devDependencies are not installed
console.log(`NPM in production mode: ${npmProduction}`);

// Get gulp plugins
const conf = npmProduction ? {
  scope: ['dependencies']
} : undefined;

const plugins = gulpLoadPlugins(conf);

gulp.task('default', ['build']);

gulp.task('build', [
  'build-css', 
  'build-js', 
  'build-translations', 
  'merge-widget-configs',
  'copy-templates-json', 
  'build-template-images', 
  'copy-static-files', 
  'build-deps',
  'copy-license',
  'copy-libs']);

gulp.task('bower-install', ['generate-bower-json'], () =>
  plugins.bower({cwd: '.tmp'}, [undefined, {
    'forceLatest': true
  }]).on('error', handleError)
);

// collect all bower-dependencies in collectedBowerDeps object
const widgetsWithDeps = []
const widgetBowerPackagePrefix = 'widget-';
gulp.task('collect-widgets-with-deps', () =>
  gulp.src('assets/widgets/*/bower.json')
    .pipe(plugins.jsonEditor(json => {
      widgetsWithDeps.push(json.name);
      return json;
    }))
    .on('error', handleError)
);

var bowerDeps = []
gulp.task('build-bower-deps', ['clean-deps','bower-install'], () =>
  gulp.src('.tmp/bower_components/**/.bower.json')
     .pipe(plugins.jsonEditor(json => {
      bowerDeps.push(
        { name:json.name,
          description: json.description,
          homepage : json.homepage
      });
      return json;
    }))
);  

var nodeDeps = []
gulp.task('build-node-deps', ['clean-deps',"bower-install"], () =>
  gulp.src('node_modules/*/package.json')
     .pipe(plugins.jsonEditor(json => {
      nodeDeps.push(
        { name:json.name,
          description: json.description,
          homepage : json.homepage
      }
      );
      return json;
    }))
);  


gulp.task('clean-deps', (done) => {
  bowerDeps = [];
  nodeDeps = []
  const depPath = buildPublicDir+"/dependencies.html" 
  del([depPath], done)
} 
);

gulp.task('build-deps', ['build-bower-deps', 'build-node-deps'], () =>
  gulp.src("assets/dependencies.html")
    .pipe(plugins.tap(file => {
      var _d = bowerDeps;//nodeDeps.concat(bowerDeps)
      // _d.sort((a,b)=> a.name.toLowerCase() > b.name.toLowerCase())
      _d = _d.map((d) => {
              var title = d.name;
              var href = (d.homepage) ? d.homepage : "";
              var desc = (d.description) ? d.description : (d.homepage) ? d.homepage : "";
              
              return '<div>'+((href.length>0) ?'<a href="'+href+'">'+title+'</a>':title)+'&nbsp'+desc+'</div>'
            })
         .join("\n")
      file.contents = Buffer.concat([
        file.contents,
        Buffer(_d),
        Buffer('</body>')
      ]) 
    }))
    .pipe(plugins.cached('build-deps'))
    .pipe(gulp.dest(`${buildPublicDir}`))

);  

gulp.task('copy-license', () => 
  gulp.src("assets/license.html")
    .pipe(plugins.cached('copy-license'))
    .pipe(gulp.dest(`${buildPublicDir}`))
);

gulp.task('copy-libs', () => {
    gulp.src(`${libDir}`)
      .pipe(plugins.cached('copy-libs'))
      .pipe(plugins.changed(`${libDestDir}`))
      .pipe(plugins.if(showFilesLog, plugins.size({showFiles: true, title: 'LIBS'})))
      .pipe(gulp.dest(`${libDestDir}`))
  }
);


gulp.task('generate-bower-json', ['collect-widgets-with-deps'], () =>
  gulp.src('bower.json')
    .pipe(plugins.jsonEditor(json => {
      for (let dep in widgetsWithDeps) {
        const widgetName = widgetsWithDeps[dep];
        json.dependencies[widgetBowerPackagePrefix + widgetName] = `../assets/widgets/${widgetName}/`;
      }
      json.resolutions = json.dependencies;
      return json;
    }))
    .on('error', handleError)
    .pipe(plugins.extend('bower.json'))
    .pipe(gulp.dest('.tmp'))
);

gulp.task('build-components', ['bower-install'], () => {
  const removeFilter = plugins.filter([
    '**/*',
    '!**/test/**',
    '!**/examples/**',
    '!**/grunt/**',
    '!**/tests/**',
    '!**/*.md',
    '!**/*.gzip',
    '!**/*.scss',
    '!**/*.ts',
    '!**/*.coffee',
    '!**/package.json',
    '!**/grunt.js',
    '!**/bower.json'
  ]);

  return gulp.src([
    '.tmp/bower_components/**/*',
    `!.tmp/bower_components/${widgetBowerPackagePrefix}*/**`
  ])
    .pipe(plugins.cached('build-components'))
    .pipe(removeFilter)
    .pipe(plugins.if(showFilesLog, plugins.size({showFiles: true, title: 'components'})))
    .on('error', handleError)
    .pipe(gulp.dest(`${buildPublicDir}/components`));
});

gulp.task('build-css', ['build-less', 'build-sass', 'build-components'], () => {
  if (!minifyCode) {
    return;
  }

  return gulp.src(`${buildPublicDir}/**/*.css`)
    .pipe(plugins.cached('build-css'))
    .on('error', handleError)
    .pipe(plugins.if(showFilesLog, plugins.size({showFiles: true, title: 'CSS'})))
    .pipe(gulp.dest(buildPublicDir));
});
gulp.task('build-less', () =>
  gulp.src('assets/css/**/*.less')
    .pipe(plugins.cached('build-less'))
    .pipe(gulp.dest(`${buildPublicDir}/css`))
    .pipe(plugins.lessSourcemap())
    .on('error', handleError)
    .pipe(plugins.if(showFilesLog, plugins.size({showFiles: true, title: 'LESS -> CSS'})))
    .pipe(gulp.dest(`${buildPublicDir}/css`))
);

var sass = require("gulp-sass");
gulp.task('build-sass', () =>
  gulp.src('assets/css/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest(`${buildPublicDir}/css`))
    .on('error', handleError)
    .pipe(plugins.if(showFilesLog, plugins.size({showFiles: true, title: 'SASS -> CSS'})))
    .pipe(gulp.dest(`${buildPublicDir}/css`))
);

gulp.task('build-template-cache', () =>
  gulp.src('assets/**/*.html')
    .pipe(plugins.if(minifyCode, plugins.minifyHtml({
      empty: true,
      loose: true
    })))
    .on('error', handleError)
    .pipe(gulp.dest(buildPublicDir))
    .pipe(plugins.angularTemplatecache('templates.js', {
      standalone: true,
      module: 'app.templates',
      moduleSystem: 'RequireJS'
    }))
    .pipe(gulp.dest(`${buildPublicDir}/js`))
);

gulp.task('copy-es6-polyfill', () =>
  gulp.src([
    // depending on the NPM version
    'node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js',
    'node_modules/babel-core/browser-polyfill.js'
    ])
    .pipe(plugins.rename('es6-polyfill.js'))
    .pipe(plugins.changed(`${buildPublicDir}/js`))
    .pipe(gulp.dest(`${buildPublicDir}/js`))
);

gulp.task('build-js', ['build-template-cache', 'build-widgets', 'build-components',
  'compile-js', 'annotate-js', 'copy-es6-polyfill'], () => {
  if (!minifyCode) {
    return;
  }

  gulp.src(`${buildPublicDir}/**/*.js`)
    .pipe(plugins.cached('build-js'))
    .pipe(plugins.plumber())
    .pipe(plugins.if(minifyCode, plugins.uglify()))
    .on('error', handleError)
    .pipe(plugins.if(showFilesLog, plugins.size({showFiles: true, title: 'JS'})))
    .pipe(gulp.dest(buildPublicDir));
});

gulp.task('compile-js', () =>
  gulp.src('assets/js/**/*.js')
    .pipe(plugins.cached('compile-js'))
    .pipe(plugins.changed(`${buildPublicDir}/js`))
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.react({ harmony: false, es6module: true }))
    .pipe(plugins.babel())
    .on('error', handleError)
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(`${buildPublicDir}/js`))
);

gulp.task('annotate-js', ['compile-js'], () =>
  gulp.src([`${buildPublicDir}/**/*.js`, `!${buildPublicDir}/widgets/**/*`,
      `!${buildPublicDir}/components/**/*`])
    .pipe(plugins.cached('annotate-js'))
    .pipe(plugins.ngAnnotate())
    .on('error', handleError)
    .pipe(gulp.dest(buildPublicDir))
);

gulp.task('move-widgets', () =>
  // Move everything except JS-code which is handled separately in build-widgets-js
  // and *.md files in 'help' folders which are handled in build-widgets-help
  gulp.src(['assets/widgets/**', '!assets/widgets/**/*.js', '!assets/widgets/**/help{,/*.md}'])
    .pipe(plugins.cached('move-widgets'))
    .pipe(plugins.changed(`${buildPublicDir}/widgets`))
    .pipe(gulp.dest(`${buildPublicDir}/widgets`))
);

gulp.task('build-widgets-js', () =>
  gulp.src('assets/widgets/**/*.js')
    .pipe(plugins.cached('build-widgets-js'))
    .pipe(plugins.changed(`${buildPublicDir}/widgets`))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.plumber())
    .pipe(plugins.react({ harmony: false, es6module: true }))
    .pipe(plugins.babel())
    .pipe(plugins.ngAnnotate())
    .on('error', handleError)
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(`${buildPublicDir}/widgets`))
);

gulp.task('build-widgets-help', () =>
    gulp.src('assets/widgets/**/help/*.md')
      .pipe(plugins.cached('build-widgets-help'))
      .pipe(plugins.changed(`${buildPublicDir}/widgets`))
      .pipe(plugins.markdown())
      .on('error', handleError)
      .pipe(gulp.dest(`${buildPublicDir}/widgets`))
);

gulp.task('build-widgets', ['move-widgets', 'build-widgets-js', 'build-widgets-help']);

gulp.task('build-translations', (done) => {
  fs.readdir('assets/i18n', (err, files) => {
    const supportedLanguages = files.map(file => file.slice(0, -5));
    let tasksLeft = supportedLanguages.length;
    for (let lang of supportedLanguages) {
      gulp.src(`assets/widgets/*/i18n/${lang}.json`)
        .pipe(plugins.plumber())
        .pipe(plugins.modify({
          fileModifier(file, contents) {
            const widgetName = file.history[file.history.length - 1].substr(file.base.length).split(path.sep)[0];
            return JSON.stringify({
              'WIDGET': {
                [widgetName.toUpperCase()]: JSON.parse(contents)
              }
            });
          }
        }))
        .pipe(plugins.addSrc(`assets/i18n/${lang}.json`))
        .pipe(plugins.extend(`${lang}.json`))
        .on('error', handleError)
        .pipe(gulp.dest(`${buildPublicDir}/i18n`))
        .on('end', () => {
          if (!--tasksLeft) {
            done();
          }
        });
    }
  });
});

gulp.task('merge-widget-configs', () =>
   gulp.src('assets/widgets/**/widget.json')
    .pipe(plugins.tap(file => {
      const dir = path.basename(path.dirname(file.path));
      file.contents = Buffer.concat([
        new Buffer(`{"${dir}": `),
        file.contents,
        new Buffer('}')
      ]);
    }))
    .pipe(plugins.extend('widgets.json'))
    .on('error', handleError)
    .pipe(gulp.dest(`${buildPublicDir}/widgets`))
);

gulp.task('copy-templates-json', () =>
  gulp.src('assets/templates/templates.json')
    .pipe(plugins.cached('copy-templates-json'))
    .pipe(gulp.dest(`${buildPublicDir}/templates`))
);

gulp.task('build-template-images', () =>
  gulp.src('assets/templates/**/icon.png')
    .pipe(plugins.cached('build-template-images'))
    .pipe(gulp.dest(`${buildPublicDir}/templates`))
);

gulp.task('copy-static-files', () =>
  gulp.src([
    'assets/img/**', 'assets/data/**',
    'assets/favicon.ico'], {base: 'assets'})
    .pipe(plugins.cached('copy-static-files'))
    .pipe(gulp.dest(buildPublicDir))
);

if (!npmProduction) {
  gulp.task('test', ['unit-test']);

  gulp.task('unit-test', ['copy-es6-polyfill',
    'build-template-cache',
    'build-components'], function (done) {
    const karma = require('karma').server;
    const conf = {
      configFile: `${__dirname}/karma.conf.js`,
      singleRun: true
    };
    conf.browsers = ['PhantomJS'];
    karma.start(conf, done);
  });

  gulp.task('coveralls', () =>
    gulp.src(`${buildDir}/coverage/**/lcov.info`, {base: `${buildDir}/..`})
      .pipe(plugins.coveralls())
  );

  gulp.task('e2e-test', ['e2e-run-test']);

  // Downloads the selenium webdriver
  gulp.task('webdriver-update', plugins.protractor.webdriver_update);

  gulp.task('e2e-run-test', ['webdriver-update', 'build', 'build-e2e-test'], function (cb) {
    let called = false;
    gulp.src([`${buildDir}/test/e2e/**/*Spec.js`])
      .pipe(plugins.protractor.protractor({
        configFile: `${__dirname}/protractor.conf.js`
      }))
      .on('error', e => {
        if (isEnvEnabled('CI')) {
          fs.exists('protractor.log', exists => {
            if (!exists) {
              console.log('protractor.log not found!');
              console.log('Skipping end-to-end tests...');
              if (!called) {
                called = true;
                cb();
              }
            }
          });
        } else {
          throw e;
        }
      })
      .on('end', () => {
        if (!called) {
          called = true;
          cb();
        }
      });
  });

  gulp.task('build-e2e-test', () =>
    gulp.src('test/e2e/**/*.js')
      .pipe(plugins.changed(`${buildDir}test/e2e`))
      .pipe(plugins.react({ harmony: false, es6module: true }))
      .pipe(plugins.babel())
      .on('error', handleError)
      .pipe(gulp.dest(`${buildDir}/test/e2e`))
  );

  gulp.task('docs', () =>
    plugins.shell.task([
      `node` +
      ` ${path.join('node_modules', 'angular-jsdoc', 'node_modules', 'jsdoc', 'jsdoc.js')}` +
      ` -c ${path.join('node_modules', 'angular-jsdoc', 'conf.json')}` + // config file
      ` -t ${path.join('node_modules', 'angular-jsdoc', 'template')}` + // template file
      ` -d ${path.join('docs')}` + // output directory
      ` -r ${path.join('assets', 'js')}` + // source code directory
      ` README.md`
    ])().on('error', handleError)
  );

  const bump = importance =>
    // get all the files to bump version in
    gulp.src(['./package.json', './bower.json'])
      // bump the version number in those files
      .pipe(plugins.bump({type: importance}))
      // save it back to filesystem
      .pipe(gulp.dest('./'))
      // commit the changed version number
      .pipe(plugins.git.commit('Bumps package version'))
      // read only one file to get the version number
      .pipe(plugins.filter('package.json'))
      // **tag it in the repository**
      .pipe(plugins.tagVersion());


  gulp.task('patch', () => bump('patch'));

  gulp.task('feature', () => bump('minor'));

  gulp.task('release', () => bump('major'));

  // Rerun the task when a file changes
  gulp.task('watch', ['build', 'build-e2e-test'], () =>
    gulp.watch(['assets/**', 'test/**', 'bower.json'], ['build'])//, 'build-e2e-test'])
  );

  // Rerun the task when a file changes
  gulp.task('watch-unit-test', ['build'], done => {
    const karma = require('karma').server;
    const conf = {
      configFile: `${__dirname}/karma.conf.js`,
      singleRun: false
    };
    if (process.env.CI) {
      conf.browsers = ['PhantomJS'];
    }
    karma.start(conf, done);
  });
}

gulp.task('clean', done =>
  del([buildDir], done)
);
