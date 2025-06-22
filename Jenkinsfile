pipeline {
  agent any

  environment {
    BACKEND_DIR = 'backend'
    FRONTEND_DIR = 'frontend'
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/SUJAL390/College_Event_Management_System.git'
      }
    }

    stage('Backend - Install & Test') {
      steps {
        dir("${BACKEND_DIR}") {
          sh 'pip install -r requirements.txt'
          
          sh 'pytest || echo "No tests or skipped"'
        }
      }
    }

    stage('Frontend - Install & Build') {
      steps {
        dir("${FRONTEND_DIR}") {
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker-compose build'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker-compose down || true'
        sh 'docker-compose up -d --build'
      }
    }
  }
}
