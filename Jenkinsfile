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
                          browser                          : [$class: 'GithubWeb', repoUrl: 'https://github.com/suniljain524/swagger-demo-app'],
                          doGenerateSubmoduleConfigurations: false,
                          extensions                       : [[$class: 'CloneOption', depth: 0, noTags: true, reference: '', shallow: false],
                                                              [$class: 'LocalBranch', localBranch: 'master'],
                                                              [$class: 'WipeWorkspace']],
                          submoduleCfg                     : [],
                          userRemoteConfigs                : [[credentialsId: 'sunil-jain-test-id', url: 'https://github.com/suniljain524/swagger-demo-app']]])
            }
        }

        stage('Prepare') {
            steps {
              sh 'rm -rf node_modules'
              sh 'npm i'
              // sh 'npm test'
            }
        }

        stage('Build') {
            steps {
            // sh 'npm start'
            //sh 'sh ./script/build.sh'
                sudo 'npm run build'
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
