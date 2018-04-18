#!/usr/bin/env groovy

pipeline {
    agent any

    tools {
      nodejs 'node'
    }

    environment {
      CHROME_BIN = '/usr/bin/chromium-browser'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class                           : 'GitSCM',
                          branches                         : [[name: '*/master']],
                          browser                          : [$class: 'GithubWeb', repoUrl: 'https://github.com/suniljain524/swagger-demo-app.git'],
                          doGenerateSubmoduleConfigurations: false,
                          extensions                       : [[$class: 'CloneOption', depth: 0, noTags: true, reference: '', shallow: false],
                                                              [$class: 'LocalBranch', localBranch: 'master'],
                                                              [$class: 'WipeWorkspace']],
                          submoduleCfg                     : [],
                          userRemoteConfigs                : [[credentialsId: 'oce-build-automation', url: 'git@github.com/suniljain524/swagger-demo-app.git']]])
            }
        }

        stage('Prepare') {
            steps {
              sh 'rm -rf node_modules'
              sh 'npm i'
               sh 'npm test'
            }
        }

        stage('Build') {
            steps {
             sh 'npm build run'
            }
        }
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '15'))
        skipDefaultCheckout true
        timestamps()
        disableConcurrentBuilds()
    }
}
