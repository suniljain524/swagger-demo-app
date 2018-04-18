
pipeline {
    agent any

    tools {
        node {
  def nodeHome = tool name: 'node-6.10.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
  sh "${nodeHome}/bin/node -v"
}
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
                          userRemoteConfigs                : [[credentialsId: 'rahul', url: '']]])
            }
        }

        stage('Prepare') {
            steps {
                sh 'npm i'
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run start'
            }
            post {
                success {
                    junit testResults: '**/target/surefire-reports/**/*.xml', allowEmptyResults: true
                }
            }
        }
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '15'))
        skipDefaultCheckout true
        timestamps()
    }
}
