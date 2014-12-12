# World Data Center

[![Project name](http://img.shields.io/badge/wdc-widgets-blue.svg)](https://github.com/sochka/wdc)
[![Build Status](https://travis-ci.org/sochka/wdc.svg?branch=master)](https://travis-ci.org/sochka/wdc)
[![Coverage Status](https://img.shields.io/coveralls/sochka/wdc.svg)](https://coveralls.io/r/sochka/wdc)

#### Prerequisites
- maven is installed and available in `PATH`
- git is installed and available in `PATH`

For developers (optional):

- node.js is installed
- npm is installed (1.2 doesn't work, 1.4 works fine, check with `npm --version`.
Install new npm with `npm install -g npm` and make sure new npm is in `PATH` with higher priority than the old one.
- bower is installed (run `npm install -g bower` as admin)
- gulp is installed (run `npm install -g gulp` as admin)
- karma is installed (run `npm install -g karma` as admin)
- protractor is installed (run `npm install -g protractor` as admin)
- firefox and chrome are installed


## Build
To run this project from terminal run the following command:

     mvn compile tomcat7:run

Intellij idea project has preconfigured maven run configuration.

## API docs
To generate API documentation run `gulp docs`

Open `src/main/webapp/build/docs/index.html` to access it in the browser.

## Debugging:

  If you want to debug javascript code - set your breakpoints in `src/main/webapp/build`,
  not in `src/main/webapp/resources` or `src/main/webapp/WEB-INF/`.
  Otherwise it won't work for you.

## Project style guides:

  - MOST IMPORTANT: follow the existing code style
  - Make sensible variable names
  - Don't use `git pull`, use `git pull --rebase` instead. Merge commits are evil. You can run `git config branch.master.rebase true` to make `git pull` behave like `git pull --rebase` on project basis.
  - Use commit names in format `[SUBPROJECT] explanation` or `[FEATURE] explanation` or `[FILE] explanation`. Examples:
      -  [build] Change gulp task
      -  [front-end] added new feature
      -  [hotfix] fixed mistake in previous commit
      -  [test] added new tests
      -  [hibernate] changed configs
      -  [travis] removed module
      -  [heroku] changed env variables
  - Use branches:
     - `master` branch for stable code synced from `develop` and bugfixes.
     - `develop` branch for code in development. Should be regularly merged into `master`
     - feature-branches for single features development. Should be merged into `develop`.
     - git tags on master branch to mark releases (like `v0.4.3` or `v1.0`)

## Used technologies

  - git (version control)
  - maven (back-end task-runner & dependency management system)
  - javascript (ES6)
  - java/spring (back-end)
  - databases (back-end)
  - hibernate (back-end)
  - npm (front-end dev. dependencies)
  - bower (front-end dependencies)
  - gulp (front-end task-runner)
  - karma (JS unit-test runner)
  - protractor (JS end-to-end test runner)
  - jasmine (JS test framework)
  - angularjs (front-end, MVVM framework)
  - requirejs (front-end, runtime dependency management)
  - less (front-end, css replacement)
  - jsdoc (JavaScript documentation engine)
  - REST (back-end + front-end)
  - travis (continuous integration)
  - heroku (PaaS, used for app deployment)

## Intellij Idea

  - maven
  - spring
  - NodeJS
  - gulp
  - karma
  - hibernate
  - LESS
  - gitignore (for syntax highlight)
  - angularjs
  - markdown

## Suggested Chrome extensions:

  - angularjs batarang
  - JetBrains IDE support

Also look into [src/main/webapp/README.md](src/main/webapp/README.md) for front-end documentation.
