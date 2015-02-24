# World Data Center

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/kpi-wdc?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Project name](http://img.shields.io/badge/wdc-widgets-blue.svg)](https://github.com/kpi-wdc/wdc)
[![GitHub version](https://badge.fury.io/gh/kpi-wdc%2Fwdc.svg)](http://badge.fury.io/gh/kpi-wdc%2Fwdc)
[![Build Status](https://travis-ci.org/kpi-wdc/wdc.svg?branch=master)](https://travis-ci.org/kpi-wdc/wdc)
[![Dependencies](https://david-dm.org/kpi-wdc/wdc.svg)](https://david-dm.org/kpi-wdc/wdc)
[![Coverage Status](https://coveralls.io/repos/kpi-wdc/wdc/badge.svg?branch=master)](https://coveralls.io/r/kpi-wdc/wdc?branch=master)
[![Issue Stats](http://issuestats.com/github/kpi-wdc/wdc/badge/issue)](http://issuestats.com/github/kpi-wdc/wdc)
[![Issue Stats](http://issuestats.com/github/kpi-wdc/wdc/badge/pr)](http://issuestats.com/github/kpi-wdc/wdc)
[![Stories in Ready](https://badge.waffle.io/kpi-wdc/wdc.png?label=ready&title=Ready)](https://waffle.io/kpi-wdc/wdc)

#### Prerequisites

Required software:

- node.js is installed (better 0.11.x or 0.12.x versions)
Install latest node.js using `npm install -g n; n latest` as root/admin user
- npm is installed (1.2 doesn't work, 1.4 works fine, check with `npm --version`.
Upgrade newer npm with `npm install -g npm` and make sure new npm is in `PATH` with higher priority than the old one.
- mongodb is installed

Highly recommended:
- bower is installed (run `npm install -g bower` as admin)
- gulp is installed (run `npm install -g gulp` as admin)

Optional:
- karma is installed (run `npm install -g karma` as admin)
- protractor is installed (run `npm install -g protractor` as admin)
- chrome and firefox (optional) are installed

## Build
To run this project from terminal run the following command:

     npm install
     npm start

Intellij idea project has preconfigured maven run configuration.

## API docs
To generate API documentation run `gulp docs`

Open `docs/index.html` to view documentation in the browser.

## Debugging:

  If you want to debug javascript code in Intellij Idea - set your breakpoints in `.tmp/public`,
  not in `assets/`.
  Otherwise it won't work for you.

## Project style guides:

  - MOST IMPORTANT: follow the existing code style
  - Make sensible variable names
  - Don't use `git pull`, use `git pull --rebase` instead. Merge commits are evil. You can run `git config branch.master.rebase true` to make `git pull` behave like `git pull --rebase` on project basis.
  - Use commit names in format `[SUBPROJECT] explanation` or `[FEATURE] explanation` or `[FILE] explanation`. Examples:
      - [build] Change gulp task
      - [front-end] added new feature
      - [hotfix] fixed mistake in previous commit
      - [test] added new tests
      - [travis] removed module
      - [heroku] changed env variables
  - Use branches:
     - `master` branch for stable code synced from `develop` and bugfixes.
     - `develop` branch for code in development. Should be regularly merged into `master`
     - feature-branches for single features development. Should be merged into `develop`.
     - git tags on master branch to mark releases (like `v0.4.3` or `v1.0`)

## Used technologies

  - git (version control)
  - ES6 JavaScript
  - Sails.JS (node.js MVC framework)
  - npm (front-end dev. dependencies)
  - bower (front-end dependencies)
  - gulp (front-end task-runner)
  - karma (front-end unit-test runner)
  - protractor (end-to-end test runner)
  - jasmine (test framework)
  - angularjs (MVVM front-end framework)
  - requirejs (AMD loader)
  - LESS (CSS replacement)
  - jsdoc (JS documentation engine)
  - travis (Continuous Integration)
  - heroku (PaaS)

## Intellij Idea

The following steps will make your work with Intellij Idea more productive

1. Set JavaScript version - EcmaScript 6
2. Install TypeScript community stubs for front-end javascript dependencies.

### Suggested intellij idea plugins:

  - NodeJS
  - gulp
  - karma
  - LESS
  - gitignore (for syntax highlight)
  - angularjs
  - markdown
  - EditorConfig
  - EJS

## Suggested Chrome extensions:

  - angularjs batarang
  - JetBrains IDE support

Also look into [src/main/webapp/README.md](src/main/webapp/README.md) for front-end documentation.
