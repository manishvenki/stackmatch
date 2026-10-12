pipeline {
    agent any

    options {
        timeout(time: 45, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15'))
        timestamps()
    }

    environment {
        CI = 'true'
        NODE_ENV = 'test'
        DOCKERHUB_NAMESPACE = 'manishvenkhi'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out StackMatch source code...'
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                echo 'Checking Node.js, npm, Git, and Docker...'
                script {
                    if (isUnix()) {
                        sh 'node --version'
                        sh 'npm --version'
                        sh 'git --version'
                        sh 'docker --version'
                        sh 'docker compose version'
                    } else {
                        bat 'node --version'
                        bat 'npm --version'
                        bat 'git --version'
                        bat 'docker --version'
                        bat 'docker compose version'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing workspace dependencies...'
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
                echo 'Building @stackmatch/types...'
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
                echo 'Running backend tests...'
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
                echo 'Building backend...'
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
                echo 'Building frontend...'
                script {
                    if (isUnix()) {
                        sh 'npm --prefix apps/web run build'
                    } else {
                        bat 'npm --prefix apps/web run build'
                    }
                }
            }
        }

        stage('Validate Docker Build') {
            steps {
                echo 'Validating Compose configuration and building images...'
                script {
                    if (isUnix()) {
                        sh 'docker compose config -q'
                        sh 'docker compose build'
                    } else {
                        bat 'docker compose config -q'
                        bat 'docker compose build'
                    }
                }
            }
        }

        stage('Publish Docker Images') {
            when {
                branch 'main'
            }

            steps {
                script {
                    def imageTag = env.GIT_COMMIT.take(12)

                    def backendImage =
                        "${env.DOCKERHUB_NAMESPACE}/stackmatch-backend"
                    def frontendImage =
                        "${env.DOCKERHUB_NAMESPACE}/stackmatch-frontend"

                    withCredentials([
                        usernamePassword(
                            credentialsId: 'dockerhub-creds',
                            usernameVariable: 'DOCKERHUB_USERNAME',
                            passwordVariable: 'DOCKERHUB_TOKEN'
                        )
                    ]) {
                        try {
                            if (isUnix()) {
                                sh '''
                                    set +x
                                    printf '%s' "$DOCKERHUB_TOKEN" |
                                        docker login \
                                        --username "$DOCKERHUB_USERNAME" \
                                        --password-stdin
                                '''
                            } else {
                                bat '''
                                    @echo off
                                    setlocal
                                    <nul set /p "=%DOCKERHUB_TOKEN%" | docker login --username "%DOCKERHUB_USERNAME%" --password-stdin
                                    exit /b %ERRORLEVEL%
                                '''
                            }

                            if (isUnix()) {
                                sh """
                                    docker tag ${backendImage}:latest ${backendImage}:${imageTag}
                                    docker tag ${frontendImage}:latest ${frontendImage}:${imageTag}

                                    docker push ${backendImage}:latest
                                    docker push ${backendImage}:${imageTag}

                                    docker push ${frontendImage}:latest
                                    docker push ${frontendImage}:${imageTag}
                                """
                            } else {
                                bat """
                                    docker tag ${backendImage}:latest ${backendImage}:${imageTag}
                                    if errorlevel 1 exit /b 1

                                    docker tag ${frontendImage}:latest ${frontendImage}:${imageTag}
                                    if errorlevel 1 exit /b 1

                                    docker push ${backendImage}:latest
                                    if errorlevel 1 exit /b 1

                                    docker push ${backendImage}:${imageTag}
                                    if errorlevel 1 exit /b 1

                                    docker push ${frontendImage}:latest
                                    if errorlevel 1 exit /b 1

                                    docker push ${frontendImage}:${imageTag}
                                    if errorlevel 1 exit /b 1
                                """
                            }
                        } finally {
                            if (isUnix()) {
                                sh 'docker logout || true'
                            } else {
                                bat 'docker logout'
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'StackMatch CI pipeline execution completed.'
        }

        success {
            echo 'StackMatch CI pipeline completed successfully.'
        }

        failure {
            echo 'StackMatch CI pipeline failed. Review the console output.'
        }
    }
}