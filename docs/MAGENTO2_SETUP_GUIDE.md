# Magento 2 Setup Guide - Complete Reference

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Methods Comparison](#installation-methods-comparison)
3. [Method 1: Manual Installation](#method-1-manual-installation)
4. [Method 2: Docker Installation](#method-2-docker-installation)
5. [Method 3: CloudPanel Installation](#method-3-cloudpanel-installation)
6. [Common Database Errors & Solutions](#common-database-errors--solutions)
7. [Common Elasticsearch Errors & Solutions](#common-elasticsearch-errors--solutions)
8. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements (Magento 2.4.x)
- **Operating System**: Linux (Ubuntu 20.04/22.04, CentOS 7/8)
- **Web Server**: Nginx 1.x or Apache 2.4
- **PHP**: 8.1 or 8.2
- **Database**: MySQL 8.0 or MariaDB 10.4+
- **Search Engine**: Elasticsearch 7.17 or OpenSearch 1.2
- **Cache**: Redis 6.0+ or Varnish 6.x
- **Memory**: Minimum 2GB RAM (4GB+ recommended)
- **Composer**: 2.x

### PHP Extensions Required
```bash
php-bcmath
php-ctype
php-curl
php-dom
php-gd
php-hash
php-iconv
php-intl
php-mbstring
php-openssl
php-pdo_mysql
php-simplexml
php-soap
php-xsl
php-zip
php-sockets
php-sodium
php-redis
```

---

## Installation Methods Comparison

| Method | Difficulty | Best For | Pros | Cons |
|--------|-----------|----------|------|------|
| **Manual** | Hard | Production servers | Full control, optimized | Time-consuming, complex |
| **Docker** | Medium | Development & Testing | Fast setup, isolated | Resource intensive |
| **CloudPanel** | Easy | Quick deployment | User-friendly GUI | Less control |

---

## Method 1: Manual Installation

### Step 1: Install Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install PHP 8.2 and extensions
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install php8.2-fpm php8.2-common php8.2-mysql \
    php8.2-xml php8.2-curl php8.2-gd php8.2-cli \
    php8.2-dev php8.2-imap php8.2-mbstring php8.2-soap \
    php8.2-zip php8.2-bcmath php8.2-intl php8.2-redis -y

# Install MySQL 8.0
sudo apt install mysql-server -y

# Install Composer
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

### Step 2: Configure MySQL

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create Magento database
sudo mysql -u root -p
```

```sql
CREATE DATABASE magento2;
CREATE USER 'magento2'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON magento2.* TO 'magento2'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Install Elasticsearch

```bash
# Install Java
sudo apt install openjdk-11-jdk -y

# Add Elasticsearch repository
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt update
sudo apt install elasticsearch -y

# Configure Elasticsearch
sudo nano /etc/elasticsearch/elasticsearch.yml
```

Add these configurations:
```yaml
cluster.name: magento
network.host: localhost
http.port: 9200
discovery.type: single-node
xpack.security.enabled: false
```

```bash
# Start Elasticsearch
sudo systemctl enable elasticsearch
sudo systemctl start elasticsearch

# Verify
curl -X GET "localhost:9200/"
```

### Step 4: Install Magento 2

```bash
# Create web directory
sudo mkdir -p /var/www/magento2
cd /var/www/magento2

# Get Magento authentication keys from https://marketplace.magento.com/
composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition .

# Set permissions
sudo chown -R www-data:www-data /var/www/magento2
sudo find . -type f -exec chmod 644 {} \;
sudo find . -type d -exec chmod 755 {} \;
sudo chmod -R 777 var/ pub/static pub/media app/etc/

# Install Magento
php bin/magento setup:install \
    --base-url=http://your-domain.com \
    --db-host=localhost \
    --db-name=magento2 \
    --db-user=magento2 \
    --db-password=StrongPassword123! \
    --admin-firstname=Admin \
    --admin-lastname=User \
    --admin-email=admin@example.com \
    --admin-user=admin \
    --admin-password=Admin123! \
    --language=en_US \
    --currency=USD \
    --timezone=America/Chicago \
    --use-rewrites=1 \
    --search-engine=elasticsearch7 \
    --elasticsearch-host=localhost \
    --elasticsearch-port=9200
```

### Step 5: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/magento2
```

```nginx
upstream fastcgi_backend {
    server unix:/run/php/php8.2-fpm.sock;
}

server {
    listen 80;
    server_name your-domain.com;
    
    set $MAGE_ROOT /var/www/magento2;
    set $MAGE_MODE developer; # Change to production for live
    
    root $MAGE_ROOT/pub;
    
    index index.php;
    autoindex off;
    charset UTF-8;
    error_page 404 403 = /errors/404.php;
    
    # Deny access to sensitive files
    location ~* (\.php$|\.htaccess$|\.git) {
        deny all;
    }
    
    location /static/ {
        expires max;
        location ~ ^/static/version {
            rewrite ^/static/(version\d*/)?(.*)$ /static/$2 last;
        }
        location ~* \.(ico|jpg|jpeg|png|gif|svg|js|css|swf|eot|ttf|otf|woff|woff2|json)$ {
            add_header Cache-Control "public";
            expires +1y;
            if (!-f $request_filename) {
                rewrite ^/static/(version\d*/)?(.*)$ /static.php?resource=$2 last;
            }
        }
        location ~* \.(zip|gz|gzip|bz2|csv|xml)$ {
            add_header Cache-Control "no-store";
            expires off;
            if (!-f $request_filename) {
                rewrite ^/static/(version\d*/)?(.*)$ /static.php?resource=$2 last;
            }
        }
        if (!-f $request_filename) {
            rewrite ^/static/(version\d*/)?(.*)$ /static.php?resource=$2 last;
        }
    }
    
    location /media/ {
        try_files $uri $uri/ /get.php$is_args$args;
        location ~ ^/media/theme_customization/.*\.xml {
            deny all;
        }
        location ~* \.(ico|jpg|jpeg|png|gif|svg|js|css|swf|eot|ttf|otf|woff|woff2)$ {
            add_header Cache-Control "public";
            expires +1y;
            try_files $uri $uri/ /get.php$is_args$args;
        }
        location ~* \.(zip|gz|gzip|bz2|csv|xml)$ {
            add_header Cache-Control "no-store";
            expires off;
            try_files $uri $uri/ /get.php$is_args$args;
        }
    }
    
    location /media/customer/ {
        deny all;
    }
    
    location /media/downloadable/ {
        deny all;
    }
    
    location ~ cron\.php {
        deny all;
    }
    
    location ~ (index|get|static|report|404|503|health_check)\.php$ {
        try_files $uri =404;
        fastcgi_pass fastcgi_backend;
        fastcgi_buffers 1024 4k;
        fastcgi_param PHP_FLAG "session.auto_start=off \n suhosin.session.cryptua=off";
        fastcgi_param PHP_VALUE "memory_limit=756M \n max_execution_time=18000";
        fastcgi_read_timeout 600s;
        fastcgi_connect_timeout 600s;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    gzip on;
    gzip_disable "msie6";
    gzip_comp_level 6;
    gzip_min_length 1100;
    gzip_buffers 16 8k;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/x-javascript
        application/json
        application/xml
        application/xml+rss
        image/svg+xml;
    gzip_vary on;
    
    location ~* (\.php$|\.htaccess$|\.git) {
        deny all;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/magento2 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl restart php8.2-fpm
```

### Step 6: Post-Installation

```bash
# Deploy static content
php bin/magento setup:static-content:deploy -f

# Enable production mode (when ready)
php bin/magento deploy:mode:set production

# Setup cron
crontab -e
# Add these lines:
* * * * * /usr/bin/php /var/www/magento2/bin/magento cron:run 2>&1 | grep -v "Ran jobs by schedule" >> /var/www/magento2/var/log/magento.cron.log
* * * * * /usr/bin/php /var/www/magento2/update/cron.php >> /var/www/magento2/var/log/update.cron.log
* * * * * /usr/bin/php /var/www/magento2/bin/magento setup:cron:run >> /var/www/magento2/var/log/setup.cron.log
```

---

## Method 2: Docker Installation

### Recommended: Using Official Magento Docker

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    image: magento/magento-cloud-docker-nginx:1.9-1.0
    hostname: web
    depends_on:
      - fpm
    volumes:
      - ./:/app:delegated
    ports:
      - "80:80"
      - "443:443"
    networks:
      - magento

  fpm:
    image: magento/magento-cloud-docker-php:8.2-fpm-1.3.7
    hostname: fpm
    depends_on:
      - db
      - elasticsearch
    volumes:
      - ./:/app:delegated
    environment:
      PHP_MEMORY_LIMIT: 4G
      PHP_IDE_CONFIG: serverName=magento
    networks:
      - magento

  db:
    image: mysql:8.0
    hostname: db
    environment:
      MYSQL_ROOT_PASSWORD: magento2
      MYSQL_DATABASE: magento2
      MYSQL_USER: magento2
      MYSQL_PASSWORD: magento2
    volumes:
      - db-data:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - magento

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.9
    hostname: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - es-data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    networks:
      - magento

  redis:
    image: redis:6.2-alpine
    hostname: redis
    ports:
      - "6379:6379"
    networks:
      - magento

  rabbitmq:
    image: rabbitmq:3.9-management-alpine
    hostname: rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    ports:
      - "5672:5672"
      - "15672:15672"
    networks:
      - magento

  mailhog:
    image: mailhog/mailhog:latest
    hostname: mailhog
    ports:
      - "1025:1025"
      - "8025:8025"
    networks:
      - magento

volumes:
  db-data:
  es-data:

networks:
  magento:
    driver: bridge
```

### Installation Commands

```bash
# Start containers
docker-compose up -d

# Install Magento
docker-compose exec fpm bash
composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition /app

# Install Magento
php bin/magento setup:install \
    --base-url=http://localhost \
    --db-host=db \
    --db-name=magento2 \
    --db-user=magento2 \
    --db-password=magento2 \
    --admin-firstname=Admin \
    --admin-lastname=User \
    --admin-email=admin@example.com \
    --admin-user=admin \
    --admin-password=Admin123! \
    --language=en_US \
    --currency=USD \
    --timezone=America/Chicago \
    --use-rewrites=1 \
    --search-engine=elasticsearch7 \
    --elasticsearch-host=elasticsearch \
    --elasticsearch-port=9200 \
    --cache-backend=redis \
    --cache-backend-redis-server=redis \
    --cache-backend-redis-db=0 \
    --page-cache=redis \
    --page-cache-redis-server=redis \
    --page-cache-redis-db=1 \
    --session-save=redis \
    --session-save-redis-host=redis \
    --session-save-redis-db=2
```

---

## Method 3: CloudPanel Installation

### Prerequisites
- Ubuntu 20.04/22.04 server
- Root access
- Clean server (no existing web servers)

### Step 1: Install CloudPanel

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install CloudPanel
curl -sSL https://installer.cloudpanel.io/ce/v2/install.sh | sudo bash

# Access: https://SERVER_IP:8443
# Default credentials will be created during installation
```

### Step 2: Create PHP Site

1. Log into CloudPanel (https://YOUR_IP:8443)
2. Go to **Sites** → **Add Site**
3. Select **PHP** as Application
4. Choose **PHP 8.2**
5. Enter domain name
6. Create site

### Step 3: Configure Database

1. Go to **Databases** → **Add Database**
2. Create database named `magento2`
3. Create user and assign to database
4. Note credentials

### Step 4: Install Elasticsearch

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Install Elasticsearch
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt update
sudo apt install elasticsearch -y

# Configure
sudo nano /etc/elasticsearch/elasticsearch.yml
# Add: discovery.type: single-node

sudo systemctl enable elasticsearch
sudo systemctl start elasticsearch
```

### Step 5: Install Magento via SSH

```bash
# Navigate to site directory
cd /home/YOUR_SITE/htdocs/www.yourdomain.com

# Remove default files
rm -rf *

# Install Magento
composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition .

# Run installation
php bin/magento setup:install \
    --base-url=https://www.yourdomain.com \
    --db-host=localhost \
    --db-name=magento2 \
    --db-user=magento2 \
    --db-password=YOUR_PASSWORD \
    --admin-firstname=Admin \
    --admin-lastname=User \
    --admin-email=admin@yourdomain.com \
    --admin-user=admin \
    --admin-password=Admin123! \
    --language=en_US \
    --currency=USD \
    --timezone=America/Chicago \
    --use-rewrites=1 \
    --search-engine=elasticsearch7 \
    --elasticsearch-host=localhost \
    --elasticsearch-port=9200

# Fix permissions
chown -R clp:clp .
chmod -R 755 .
```

---

## Common Database Errors & Solutions

### Error 1: "SQLSTATE[HY000] [2002] Connection refused"

**Cause**: MySQL service not running or incorrect host

**Solution**:
```bash
# Check MySQL status
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql

# Check connection
mysql -u root -p -e "SELECT VERSION();"

# Verify host in app/etc/env.php
# Should be 'localhost' or '127.0.0.1'
```

### Error 2: "General error: 1205 Lock wait timeout exceeded"

**Cause**: Long-running transactions or deadlocks

**Solution**:
```sql
-- Check running queries
SHOW FULL PROCESSLIST;

-- Kill problematic query
KILL <process_id>;

-- Increase timeout
SET GLOBAL innodb_lock_wait_timeout = 120;
```

Add to `/etc/mysql/mysql.conf.d/mysqld.cnf`:
```ini
[mysqld]
innodb_lock_wait_timeout = 120
max_allowed_packet = 256M
innodb_buffer_pool_size = 1G
```

### Error 3: "SQLSTATE[HY000]: General error: 1449 The user specified as a definer does not exist"

**Cause**: User permissions issues

**Solution**:
```sql
-- Grant all privileges
GRANT ALL PRIVILEGES ON magento2.* TO 'magento2'@'localhost';
GRANT TRIGGER ON magento2.* TO 'magento2'@'localhost';
FLUSH PRIVILEGES;
```

### Error 4: "MySQL server has gone away"

**Cause**: Packet size too small or timeout

**Solution**:
```ini
# /etc/mysql/mysql.conf.d/mysqld.cnf
[mysqld]
max_allowed_packet = 256M
wait_timeout = 28800
interactive_timeout = 28800
```

```bash
sudo systemctl restart mysql
```

### Error 5: "Too many connections"

**Solution**:
```sql
-- Check current connections
SHOW STATUS WHERE Variable_name = 'Threads_connected';

-- Increase max connections
SET GLOBAL max_connections = 500;
```

```ini
# /etc/mysql/mysql.conf.d/mysqld.cnf
[mysqld]
max_connections = 500
```

---

## Common Elasticsearch Errors & Solutions

### Error 1: "Connection refused to Elasticsearch"

**Cause**: Elasticsearch not running

**Solution**:
```bash
# Check status
sudo systemctl status elasticsearch

# Start service
sudo systemctl start elasticsearch
sudo systemctl enable elasticsearch

# Check if listening
curl -X GET "localhost:9200/"

# Check logs
sudo tail -f /var/log/elasticsearch/elasticsearch.log
```

### Error 2: "master_not_discovered_exception"

**Cause**: Cluster configuration issue

**Solution**:
```yaml
# /etc/elasticsearch/elasticsearch.yml
discovery.type: single-node
cluster.name: magento
node.name: node-1
network.host: 0.0.0.0
```

```bash
sudo systemctl restart elasticsearch
```

### Error 3: "Out of memory" or "heap size"

**Cause**: Insufficient Java heap

**Solution**:
```bash
# Edit JVM options
sudo nano /etc/elasticsearch/jvm.options

# Set heap size (50% of RAM, max 32GB)
-Xms2g
-Xmx2g

sudo systemctl restart elasticsearch
```

### Error 4: "Unable to create native thread"

**Cause**: System limits too low

**Solution**:
```bash
# Edit limits
sudo nano /etc/security/limits.conf
```

Add:
```
elasticsearch soft nofile 65536
elasticsearch hard nofile 65536
elasticsearch soft nproc 4096
elasticsearch hard nproc 4096
```

```bash
# Edit sysctl
sudo nano /etc/sysctl.conf
```

Add:
```
vm.max_map_count=262144
```

```bash
sudo sysctl -p
sudo systemctl restart elasticsearch
```

### Error 5: "Flood stage disk watermark exceeded"

**Cause**: Disk space low

**Solution**:
```bash
# Clean up old indices
curl -X DELETE "localhost:9200/magento2_product_*?pretty"

# Temporary fix
curl -X PUT "localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "cluster.routing.allocation.disk.threshold_enabled": false
  }
}
'

# Free up disk space
sudo apt autoremove
sudo apt autoclean
```

### Error 6: "Search engine not configured"

**Cause**: Magento not configured to use Elasticsearch

**Solution**:
```bash
# Configure via CLI
php bin/magento config:set catalog/search/engine elasticsearch7
php bin/magento config:set catalog/search/elasticsearch7_server_hostname localhost
php bin/magento config:set catalog/search/elasticsearch7_server_port 9200

# Reindex
php bin/magento indexer:reindex catalogsearch_fulltext
```

---

## CI/CD Pipeline Setup

### Option 1: GitHub Actions

Create `.github/workflows/magento2-deploy.yml`:

```yaml
name: Magento 2 CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: magento
          MYSQL_DATABASE: magento_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
      
      elasticsearch:
        image: docker.elastic.co/elasticsearch/elasticsearch:7.17.9
        env:
          discovery.type: single-node
          xpack.security.enabled: false
        ports:
          - 9200:9200
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.2'
        extensions: bcmath, ctype, curl, dom, gd, hash, iconv, intl, mbstring, openssl, pdo_mysql, simplexml, soap, xsl, zip
        coverage: none
    
    - name: Install Composer dependencies
      run: composer install --prefer-dist --no-progress --no-suggest
    
    - name: Run PHP CodeSniffer
      run: vendor/bin/phpcs --standard=Magento2 app/code
    
    - name: Run PHPUnit tests
      run: vendor/bin/phpunit -c dev/tests/unit/phpunit.xml.dist
    
    - name: Run Static Tests
      run: php bin/magento dev:tests:run static

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Production
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.PROD_HOST }}
        username: ${{ secrets.PROD_USERNAME }}
        key: ${{ secrets.PROD_SSH_KEY }}
        script: |
          cd /var/www/magento2
          git pull origin main
          composer install --no-dev --optimize-autoloader
          php bin/magento setup:upgrade
          php bin/magento setup:di:compile
          php bin/magento setup:static-content:deploy -f
          php bin/magento cache:flush
          php bin/magento indexer:reindex
```

### Option 2: GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  MYSQL_ROOT_PASSWORD: magento
  MYSQL_DATABASE: magento_test

cache:
  paths:
    - vendor/

test:
  stage: test
  image: php:8.2-fpm
  services:
    - mysql:8.0
    - docker.elastic.co/elasticsearch/elasticsearch:7.17.9
  before_script:
    - apt-get update && apt-get install -y git unzip libzip-dev libicu-dev libxml2-dev
    - docker-php-ext-install pdo pdo_mysql intl soap zip bcmath
    - curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
    - composer install --prefer-dist --no-progress
  script:
    - vendor/bin/phpcs --standard=Magento2 app/code
    - vendor/bin/phpunit -c dev/tests/unit/phpunit.xml.dist
  only:
    - merge_requests
    - main

build:
  stage: build
  script:
    - composer install --no-dev --optimize-autoloader
    - php bin/magento setup:di:compile
    - php bin/magento setup:static-content:deploy -f
  artifacts:
    paths:
      - generated/
      - pub/static/
    expire_in: 1 hour
  only:
    - main

deploy_production:
  stage: deploy
  script:
    - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $PROD_HOST >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts
    - |
      ssh $PROD_USERNAME@$PROD_HOST << 'EOF'
        cd /var/www/magento2
        git pull origin main
        composer install --no-dev --optimize-autoloader
        php bin/magento maintenance:enable
        php bin/magento setup:upgrade
        php bin/magento setup:di:compile
        php bin/magento setup:static-content:deploy -f en_US
        php bin/magento cache:flush
        php bin/magento indexer:reindex
        php bin/magento maintenance:disable
      EOF
  environment:
    name: production
    url: https://your-domain.com
  only:
    - main
  when: manual
```

### Option 3: Jenkins Pipeline

Create `Jenkinsfile`:

```groovy
pipeline {
    agent any
    
    environment {
        MAGENTO_ROOT = '/var/www/magento2'
        PHP_BIN = '/usr/bin/php'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'composer install --prefer-dist --no-progress'
            }
        }
        
        stage('Code Quality') {
            parallel {
                stage('PHPCS') {
                    steps {
                        sh 'vendor/bin/phpcs --standard=Magento2 app/code'
                    }
                }
                stage('PHPMD') {
                    steps {
                        sh 'vendor/bin/phpmd app/code text phpmd.xml'
                    }
                }
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'vendor/bin/phpunit -c dev/tests/unit/phpunit.xml.dist'
            }
        }
        
        stage('Static Tests') {
            steps {
                sh "${PHP_BIN} bin/magento dev:tests:run static"
            }
        }
        
        stage('Build') {
            when {
                branch 'main'
            }
            steps {
                sh 'composer install --no-dev --optimize-autoloader'
                sh "${PHP_BIN} bin/magento setup:di:compile"
                sh "${PHP_BIN} bin/magento setup:static-content:deploy -f"
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                sshagent(['staging-ssh-key']) {
                    sh '''
                        ssh user@staging-server << EOF
                            cd ${MAGENTO_ROOT}
                            git pull origin develop
                            composer install --no-dev
                            ${PHP_BIN} bin/magento setup:upgrade
                            ${PHP_BIN} bin/magento cache:flush
                        EOF
                    '''
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                sshagent(['production-ssh-key']) {
                    sh '''
                        ssh user@production-server << EOF
                            cd ${MAGENTO_ROOT}
                            ${PHP_BIN} bin/magento maintenance:enable
                            git pull origin main
                            composer install --no-dev --optimize-autoloader
                            ${PHP_BIN} bin/magento setup:upgrade
                            ${PHP_BIN} bin/magento setup:di:compile
                            ${PHP_BIN} bin/magento setup:static-content:deploy -f
                            ${PHP_BIN} bin/magento cache:flush
                            ${PHP_BIN} bin/magento indexer:reindex
                            ${PHP_BIN} bin/magento maintenance:disable
                        EOF
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
```

### Deployment Script (deploy.sh)

```bash
#!/bin/bash

# Magento 2 Deployment Script
set -e

# Configuration
MAGENTO_ROOT="/var/www/magento2"
PHP_BIN="/usr/bin/php"
BACKUP_DIR="/backups/magento2"
DATE=$(date +%Y%m%d_%H%M%S)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Starting Magento 2 Deployment${NC}"

# Backup database
echo -e "${YELLOW}Creating database backup...${NC}"
mkdir -p $BACKUP_DIR
php bin/magento setup:backup --db --media

# Enable maintenance mode
echo -e "${YELLOW}Enabling maintenance mode...${NC}"
$PHP_BIN $MAGENTO_ROOT/bin/magento maintenance:enable

# Pull latest code
echo -e "${YELLOW}Pulling latest code...${NC}"
cd $MAGENTO_ROOT
git pull origin main

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
composer install --no-dev --optimize-autoloader --no-interaction

# Upgrade database
echo -e "${YELLOW}Running setup:upgrade...${NC}"
$PHP_BIN bin/magento setup:upgrade --keep-generated

# Compile DI
echo -e "${YELLOW}Compiling dependency injection...${NC}"
$PHP_BIN bin/magento setup:di:compile

# Deploy static content
echo -e "${YELLOW}Deploying static content...${NC}"
$PHP_BIN bin/magento setup:static-content:deploy -f en_US

# Clear cache
echo -e "${YELLOW}Clearing cache...${NC}"
$PHP_BIN bin/magento cache:clean
$PHP_BIN bin/magento cache:flush

# Reindex
echo -e "${YELLOW}Reindexing...${NC}"
$PHP_BIN bin/magento indexer:reindex

# Set permissions
echo -e "${YELLOW}Setting permissions...${NC}"
chown -R www-data:www-data $MAGENTO_ROOT
find $MAGENTO_ROOT -type d -exec chmod 755 {} \;
find $MAGENTO_ROOT -type f -exec chmod 644 {} \;

# Disable maintenance mode
echo -e "${YELLOW}Disabling maintenance mode...${NC}"
$PHP_BIN bin/magento maintenance:disable

echo -e "${GREEN}Deployment completed successfully!${NC}"
```

---

## Performance Optimization

### PHP Configuration

```ini
# /etc/php/8.2/fpm/php.ini
memory_limit = 4G
max_execution_time = 18000
zlib.output_compression = On
opcache.enable = 1
opcache.memory_consumption = 512
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 60000
opcache.validate_timestamps = 0
opcache.save_comments = 1
opcache.fast_shutdown = 1
realpath_cache_size = 10M
realpath_cache_ttl = 7200
```

### MySQL Optimization

```ini
# /etc/mysql/mysql.conf.d/mysqld.cnf
[mysqld]
innodb_buffer_pool_size = 2G
innodb_log_file_size = 512M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1
max_connections = 500
query_cache_size = 0
query_cache_type = 0
tmp_table_size = 256M
max_heap_table_size = 256M
thread_cache_size = 50
table_open_cache = 4000
```

### Redis Configuration

```bash
# Install Redis
sudo apt install redis-server -y

# Configure Magento to use Redis
php bin/magento setup:config:set --cache-backend=redis --cache-backend-redis-server=127.0.0.1 --cache-backend-redis-db=0
php bin/magento setup:config:set --page-cache=redis --page-cache-redis-server=127.0.0.1 --page-cache-redis-db=1
php bin/magento setup:config:set --session-save=redis --session-save-redis-host=127.0.0.1 --session-save-redis-db=2
```

### Varnish Cache

```bash
# Install Varnish
sudo apt install varnish -y

# Export Varnish configuration
php bin/magento varnish:vcl:generate --export-version=7 > /etc/varnish/default.vcl

# Configure Magento
php bin/magento config:set --scope=default --scope-code=0 system/full_page_cache/caching_application 2
php bin/magento setup:config:set --http-cache-hosts=127.0.0.1:6081

# Restart Varnish
sudo systemctl restart varnish
```

---

## Troubleshooting

### General Commands

```bash
# Check logs
tail -f var/log/system.log
tail -f var/log/exception.log
tail -f var/log/debug.log

# Clear cache
php bin/magento cache:clean
php bin/magento cache:flush
rm -rf var/cache/* var/page_cache/* var/view_preprocessed/*

# Reindex all
php bin/magento indexer:reindex

# Fix permissions
sudo chown -R www-data:www-data .
sudo find . -type f -exec chmod 644 {} \;
sudo find . -type d -exec chmod 755 {} \;
sudo chmod -R 777 var/ pub/static pub/media app/etc/

# Compile
php bin/magento setup:di:compile

# Deploy static content
php bin/magento setup:static-content:deploy -f

# Check setup:upgrade needed
php bin/magento setup:db:status
```

### Debugging Mode

```bash
# Enable developer mode
php bin/magento deploy:mode:set developer

# Enable error display
php bin/magento config:set dev/debug/template_hints_storefront 1
php bin/magento config:set dev/debug/template_hints_admin 1

# Disable minification
php bin/magento config:set dev/js/merge_files 0
php bin/magento config:set dev/css/merge_css_files 0
php bin/magento config:set dev/js/minify_files 0
php bin/magento config:set dev/css/minify_files 0
```

### Health Check Script

```bash
#!/bin/bash
# magento-health-check.sh

echo "=== Magento 2 Health Check ==="
echo ""

echo "PHP Version:"
php -v | head -1

echo ""
echo "MySQL Status:"
sudo systemctl status mysql | grep Active

echo ""
echo "Elasticsearch Status:"
curl -s localhost:9200 | grep cluster_name

echo ""
echo "Disk Space:"
df -h | grep -E 'Filesystem|/dev/root'

echo ""
echo "Memory Usage:"
free -h

echo ""
echo "Magento Cron Jobs:"
ps aux | grep cron | grep -v grep

echo ""
echo "Indexer Status:"
php bin/magento indexer:status

echo ""
echo "Cache Status:"
php bin/magento cache:status

echo ""
echo "Module Status:"
php bin/magento module:status | head -20
```

---

## Recommended Setup: Production Best Practices

### Best Overall Setup for Production:

1. **Hosting**: Dedicated server or VPS (minimum 4GB RAM, 4 CPU cores)
2. **OS**: Ubuntu 22.04 LTS
3. **Web Server**: Nginx + PHP-FPM
4. **Database**: MySQL 8.0 with optimized configuration
5. **Search**: Elasticsearch 7.17
6. **Cache**: Redis (for cache, sessions, and full page cache) + Varnish
7. **SSL**: Let's Encrypt with auto-renewal
8. **Monitoring**: New Relic or Datadog
9. **Backups**: Daily automated backups (database + media)
10. **CI/CD**: GitHub Actions or GitLab CI

### Quick Start Recommendation by Use Case:

- **Development**: Docker (fastest setup, isolated environment)
- **Small Business**: CloudPanel (easiest management, GUI)
- **Enterprise/Production**: Manual Installation (full control, optimized)

---

## Useful Resources

- Official Documentation: https://devdocs.magento.com/
- Magento Stack Exchange: https://magento.stackexchange.com/
- GitHub Repository: https://github.com/magento/magento2
- Marketplace: https://marketplace.magento.com/
- DevDocs: https://developer.adobe.com/commerce/

---

**Last Updated**: January 2026
**Magento Version**: 2.4.x
