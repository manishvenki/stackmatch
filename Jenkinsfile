pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15'))
        timestamps()
    }

    environment {
        CI = 'true'
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from Git repository...'
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                echo 'Checking Node.js, npm, and Git versions on Jenkins agent...'
                script {
                    if (isUnix()) {
                        sh 'node --version'
                        sh 'npm --version'
                        sh 'git --version'
                    } else {
                        bat 'node --version'
                        bat 'npm --version'
                        bat 'git --version'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing workspace dependencies reproducibly across packages...'
                script {
                    if (isUnix()) {
                        sh 'npm --prefix packages/types ci || npm --prefix packages/types install'
                        sh 'npm --prefix backend ci || npm --prefix backend install'
                        sh 'npm --prefix apps/web ci || npm --prefix apps/web install'
                    } else {
                        bat 'npm --prefix packages/types ci || npm --prefix packages/types install'
                        bat 'npm --prefix backend ci || npm --prefix backend install'
                        bat 'npm --prefix apps/web ci || npm --prefix apps/web install'
                    }
                }
            }
        }

        stage('Build Shared Types') {
            steps {
                echo 'Compiling shared types package (@stackmatch/types)...'
                script {
                    if (isUnix()) {
                        sh 'npm --prefix packages/types run build'
                    } else {
                        bat 'npm --prefix packages/types run build'
                    }
                }
            }
        }

        stage('Test Backend & Error Handling') {
            steps {
                echo 'Executing StackMatch Backend API & Domain Separation Tests...'
                script {
                    if (isUnix()) {
                        sh 'npm --prefix backend test'
                    } else {
                        bat 'npm --prefix backend test'
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Compiling Backend TypeScript (@stackmatch/backend)...'
                script {
                    if (isUnix()) {
                        sh 'npm --prefix backend run build'
                    } else {
                        bat 'npm --prefix backend run build'
                    }
                }
            }
        }

        stage('Build Web Frontend') {
            steps {
                echo 'Building Web Frontend production bundle (@stackmatch/web)...'
                script {
                    if (isUnix()) {
                        sh 'npm --prefix apps/web run build'
                    } else {
                        bat 'npm --prefix apps/web run build'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'StackMatch CI Pipeline execution completed.'
        }
        success {
            echo 'StackMatch CI Pipeline passed successfully: All builds and tests verified.'
        }
        failure {
            echo 'StackMatch CI Pipeline failed. Review the console logs of the failing stage.'
        }
    }
}
