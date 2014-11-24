# World Data Center

[![Project name](http://img.shields.io/badge/wdc-widgets-blue.svg)](https://github.com/sochka/wdc)
[![Build Status](https://travis-ci.org/sochka/wdc.svg?branch=master)](https://travis-ci.org/sochka/wdc)
[![Coverage Status](https://img.shields.io/coveralls/sochka/wdc.svg)](https://coveralls.io/r/sochka/wdc)

#### Prerequisites
- maven is installed

For developers (optional):

- node.js is installed
- npm is installed
- gulp is installed `npm install -g gulp`
- karma is installed `npm install -g karma`
- protractor is installed `npm install -g protractor`
- firefox and chrome are installed


## Build
To run this project from terminal run the following command:

     mvn compile tomcat7:run

Intellij idea project has preconfigured maven run configuration.

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
  - REST (back-end + front-end)
  - travis (continuous integration)
  - heroku (PaaS, used for app deployment)

## Suggested intellij idea plugins:

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

If you are a front-end dev, you can also install TypeScript community stubs to make Idea aware of code completion when other JS libraries are used.

## Suggested Chrome extensions:

  - angularjs batarang
  - JetBrains IDE support

Also look into [src/main/webapp/README.md](src/main/webapp/README.md) for front-end documentation.
