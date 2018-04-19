#!/usr/bin/env groovy

pipeline {
    agent any

    tools {
      nodejs 'node'
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
            // sh 'sh ./script/build.sh'
              //  sh 'npm start'
              echo 'build'
            }
        }
        
        stage('Publish to QA') {
            steps {
            
              sh  'NODE_ENV=qa npm run publish'
            }
        }
        
                stage('Publish to dev') {
            steps {
              // sh ./script/publish.sh dev
              sh  'NODE_ENV=dev npm run publish'
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
