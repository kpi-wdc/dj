# World Data Center

[![Build Status](https://travis-ci.org/sochka/wdc.svg)](https://travis-ci.org/sochka/wdc)

Prerequisites: maven is installed

To run this project from terminal run the following command:

     mvn compile tomcat7:run

Intellij idea project has preconfigured maven run configuration.

Project style guides:

  - MOST IMPORTANT: follow the existing code style
  - Make sensible variable names
  - Don't use `git pull`, use `git pull --rebase` instead. Merge commits are evil. You can run `git config branch.master.rebase true` to make `git pull` behave like `git pull --rebase` on project basis.
  - [NEW]: Use commit names in format `[SUBPROJECT] explanation` or `[FEATURE] explanation` or `[FILE] explanation`. Examples:
      -  [build] Change gulp task
      -  [front-end] added new feature
      -  [hotfix] fixed mistake in previous commit
      -  [test] added new tests
      -  [hibernate] changed configs
      -  [travis] removed module
      -  [heroku] changed env variables

We suggest to learn about the following technologies first:

  - git (version control)
  - maven (back-end task-runner & dependency management system)
  - java/spring (back-end)
  - databases (back-end)
  - hibernate (back-end)
  - npm (front-end dev. dependencies)
  - bower (front-end dependencies)
  - gulp (front-end task-runner)
  - karma (JS test runner)
  - angularjs (front-end, MVVM framework)
  - requirejs (front-end, runtime dependency management)
  - less (front-end, css replacement)
  - REST (back-end + front-end)

Suggested intellij idea plugins:

  - maven
  - spring
  - gulp
  - karma
  - hibernate
  - LESS
  - gitignore (for syntax highlight)
  - angularjs
  - markdown

Chrome extensions:

  - angularjs batarang
  - JetBrains IDE support

Also look into [src/main/webapp/README.md](src/main/webapp/README.md) for front-end documentation.
