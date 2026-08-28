# Magento 2 Commands - Complete Interview Guide

## Table of Contents
1. [Essential Commands](#essential-commands)
2. [Cache Management](#cache-management)
3. [Setup & Installation](#setup--installation)
4. [Module Management](#module-management)
5. [Deployment & Compilation](#deployment--compilation)
6. [Indexing](#indexing)
7. [Cron Jobs](#cron-jobs)
8. [Configuration](#configuration)
9. [Database Operations](#database-operations)
10. [Theme & Static Content](#theme--static-content)
11. [Admin & User Management](#admin--user-management)
12. [Debugging & Development](#debugging--development)
13. [Performance & Optimization](#performance--optimization)
14. [Troubleshooting Commands](#troubleshooting-commands)
15. [Interview Tips & Tricks](#interview-tips--tricks)
16. [Common Scenarios & Solutions](#common-scenarios--solutions)
17. [Advanced Commands](#advanced-commands)

---

## Essential Commands

### Check Magento Version
```bash
php bin/magento --version
```
**When to use**: Verify which Magento version is installed  
**Interview tip**: Always check version before applying patches or upgrades

### Help Command
```bash
php bin/magento list
php bin/magento help <command>
```
**When to use**: See all available commands or get help for specific command  
**Example**: `php bin/magento help setup:upgrade`

### Check System Status
```bash
php bin/magento setup:db:status
```
**When to use**: Check if database schema/data upgrade is needed  
**Returns**: `All modules are up to date` or list of pending upgrades

---

## Cache Management

### Clear Cache
```bash
# Clean cache (recommended - removes only invalidated cache)
php bin/magento cache:clean

# Flush cache (nuclear option - removes all cache)
php bin/magento cache:flush
```
**When to use**: After configuration changes, module installation, or content updates  
**Interview tip**: `clean` vs `flush` - clean is smarter, flush removes everything

### Check Cache Status
```bash
php bin/magento cache:status
```
**When to use**: See which cache types are enabled/disabled  
**Output shows**: All cache types and their status

### Enable/Disable Cache
```bash
# Disable all cache
php bin/magento cache:disable

# Enable all cache
php bin/magento cache:enable

# Disable specific cache types
php bin/magento cache:disable config layout block_html

# Enable specific cache types
php bin/magento cache:enable config layout block_html
```
**When to use**: During development (disable) or production (enable)  
**Interview tip**: Never disable cache in production!

### Common Cache Types
```
config          - Configuration cache
layout          - Layout cache
block_html      - Block HTML output
collections     - Collections data
reflection      - API reflection
db_ddl          - Database DDL operations
compiled_config - Compiled configuration
eav             - EAV types and attributes
customer_notification - Customer notifications
config_integration - Integration configuration
config_integration_api - Integration API configuration
full_page       - Full page cache
config_webservice - Web services configuration
translate       - Translations
```

### Manual Cache Clear (File System)
```bash
# Remove cache directories
rm -rf var/cache/* var/page_cache/* var/view_preprocessed/*

# Remove generated code
rm -rf generated/code/* generated/metadata/*

# Remove pub/static (except .htaccess)
rm -rf pub/static/frontend/* pub/static/adminhtml/*
```
**When to use**: When CLI cache commands fail or you have permission issues

---

## Setup & Installation

### Fresh Installation
```bash
php bin/magento setup:install \
    --base-url=http://magento.local \
    --db-host=localhost \
    --db-name=magento \
    --db-user=root \
    --db-password=password \
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
    --elasticsearch-port=9200 \
    --cleanup-database
```
**When to use**: New Magento installation  
**Interview tip**: `--cleanup-database` drops existing tables before install

### Upgrade Database Schema & Data
```bash
php bin/magento setup:upgrade
```
**When to use**: 
- After installing/updating modules
- After Magento version upgrade
- When db:status shows pending upgrades

**Interview tip**: ALWAYS run after module install/enable

### Keep Generated Files During Upgrade
```bash
php bin/magento setup:upgrade --keep-generated
```
**When to use**: To speed up upgrade by not regenerating code  
**Warning**: Use only when no code changes in new modules

### Uninstall Magento
```bash
php bin/magento setup:uninstall
```
**When to use**: Complete removal of Magento installation  
**Warning**: Drops database and removes configuration!

### Rollback Code/Database
```bash
# Rollback code
php bin/magento setup:rollback

# Rollback database
php bin/magento setup:rollback --code-file="<backup-file>" --media-file="<backup-file>" --db-file="<backup-file>"
```
**When to use**: Restore from backup after failed upgrade

---

## Module Management

### List All Modules
```bash
php bin/magento module:status
```
**When to use**: See enabled/disabled modules  
**Interview tip**: Custom modules start with capital letter (Vendor_Module)

### Enable Module
```bash
# Enable single module
php bin/magento module:enable Vendor_Module

# Enable multiple modules
php bin/magento module:enable Vendor_Module1 Vendor_Module2

# Enable all modules
php bin/magento module:enable --all
```
**When to use**: Activate a module  
**Important**: Always run `setup:upgrade` after enabling

### Disable Module
```bash
# Disable single module
php bin/magento module:disable Vendor_Module

# Disable multiple modules
php bin/magento module:disable Vendor_Module1 Vendor_Module2

# Clear static files when disabling
php bin/magento module:disable Vendor_Module --clear-static-content
```
**When to use**: Deactivate problematic module or for testing  
**Interview tip**: Check module dependencies before disabling

### Uninstall Module
```bash
# Uninstall and remove code
php bin/magento module:uninstall Vendor_Module

# Uninstall, remove code, and backup
php bin/magento module:uninstall Vendor_Module --backup-code --backup-media --backup-db

# Uninstall without removing data
php bin/magento module:uninstall Vendor_Module --non-composer
```
**When to use**: Completely remove a module  
**Interview tip**: Use `--backup-code` in production!

---

## Deployment & Compilation

### Compile Dependency Injection
```bash
php bin/magento setup:di:compile
```
**When to use**: 
- Before deployment to production
- After code changes in production mode
- After module installation

**What it does**: 
- Generates factories, proxies, and interceptors
- Creates compiled classes in `generated/` folder
- Required for production mode

**Interview tip**: Takes 5-15 minutes, plan accordingly in production

### Deploy Static Content
```bash
# Deploy for all languages and themes
php bin/magento setup:static-content:deploy

# Deploy specific language
php bin/magento setup:static-content:deploy en_US

# Deploy multiple languages
php bin/magento setup:static-content:deploy en_US es_ES fr_FR

# Force deploy (skip timestamp check)
php bin/magento setup:static-content:deploy -f

# Deploy for specific theme
php bin/magento setup:static-content:deploy --theme=Magento/luma

# Deploy with parallel jobs (faster)
php bin/magento setup:static-content:deploy -f --jobs=4

# Deploy only adminhtml area
php bin/magento setup:static-content:deploy --area=adminhtml
```
**When to use**: 
- After theme changes
- Before switching to production mode
- After module installation affecting frontend

**Interview tip**: Use `-f` to skip timestamp validation, `--jobs` for parallel processing

---

## Indexing

### Index Status
```bash
php bin/magento indexer:info
php bin/magento indexer:status
```
**When to use**: Check which indexers exist and their status  
**Output**: Shows if index is ready, processing, or requires reindex

### Reindex All
```bash
php bin/magento indexer:reindex
```
**When to use**: Update all indexes after bulk data changes  
**Interview tip**: Can be time-consuming on large catalogs

### Reindex Specific Indexer
```bash
# Catalog Product Price
php bin/magento indexer:reindex catalog_product_price

# Catalog Search (Elasticsearch)
php bin/magento indexer:reindex catalogsearch_fulltext

# Category Products
php bin/magento indexer:reindex catalog_category_product

# Customer Grid
php bin/magento indexer:reindex customer_grid
```
**When to use**: Update specific index after related data changes

### All Available Indexers
```
design_config_grid              - Design Config Grid
customer_grid                   - Customer Grid
catalog_category_product        - Category Products
catalog_product_category        - Product Categories
catalogrule_rule                - Catalog Rule Product
catalog_product_attribute       - Product EAV
inventory                       - Inventory
catalogrule_product             - Catalog Product Rule
cataloginventory_stock          - Stock
targetrule_product_rule         - Product/Target Rule
targetrule_rule_product         - Target Rule/Product
catalog_product_price           - Product Price
catalogsearch_fulltext          - Catalog Search
salesrule_rule                  - Sales Rule
```

### Set Index Mode
```bash
# Set to "Update on Save" (realtime)
php bin/magento indexer:set-mode realtime

# Set to "Update by Schedule" (cron)
php bin/magento indexer:set-mode schedule

# Set specific indexer to schedule mode
php bin/magento indexer:set-mode schedule catalog_product_price
```
**When to use**: 
- Use `schedule` for production (better performance)
- Use `realtime` for small stores or development

**Interview tip**: Schedule mode + cron is best practice for production

### Reset Indexer
```bash
php bin/magento indexer:reset
```
**When to use**: When indexer is stuck or corrupted  
**Result**: Invalidates all indexes

---

## Cron Jobs

### Run Cron Manually
```bash
# Run all cron jobs
php bin/magento cron:run

# Run specific cron group
php bin/magento cron:run --group=index
php bin/magento cron:run --group=default
```
**When to use**: Testing cron jobs or manual execution  
**Interview tip**: Don't use in production - use system cron instead

### Install Crontab
```bash
php bin/magento cron:install
```
**When to use**: Setup cron jobs in system crontab  
**What it adds**:
```
* * * * * /usr/bin/php /var/www/magento2/bin/magento cron:run 2>&1 | grep -v "Ran jobs by schedule" >> /var/www/magento2/var/log/magento.cron.log
* * * * * /usr/bin/php /var/www/magento2/update/cron.php >> /var/www/magento2/var/log/update.cron.log
* * * * * /usr/bin/php /var/www/magento2/bin/magento setup:cron:run >> /var/www/magento2/var/log/setup.cron.log
```

### Remove Crontab
```bash
php bin/magento cron:remove
```
**When to use**: Remove Magento cron jobs from system crontab

### Check Cron Status (via Database)
```bash
# Check cron schedule table
mysql -u root -p magento -e "SELECT * FROM cron_schedule ORDER BY scheduled_at DESC LIMIT 10;"

# Check pending cron jobs
mysql -u root -p magento -e "SELECT * FROM cron_schedule WHERE status='pending';"

# Check failed cron jobs
mysql -u root -p magento -e "SELECT * FROM cron_schedule WHERE status='error' ORDER BY scheduled_at DESC LIMIT 10;"

# Clean old cron entries
mysql -u root -p magento -e "DELETE FROM cron_schedule WHERE status='success' AND scheduled_at < DATE_SUB(NOW(), INTERVAL 7 DAY);"
```

### Cron Groups
- `default` - Default cron group
- `index` - Indexer updates
- `consumers` - Queue consumers
- `ddg_automation` - Dotdigital automation
- `catalog_event` - Catalog events
- `staging` - Content staging (EE)
- `magento_giftcardaccount` - Gift cards (EE)

**Interview tip**: Cron runs indexing when set to "schedule" mode

---

## Configuration

### Show Configuration Value
```bash
# Get specific config
php bin/magento config:show web/secure/base_url

# Get all configs
php bin/magento config:show
```
**When to use**: Check current configuration values

### Set Configuration Value
```bash
# Set config value
php bin/magento config:set web/unsecure/base_url "http://example.com/"

# Set with encryption
php bin/magento config:sensitive:set payment/paypal/api_password "secret123"
```
**When to use**: Change configuration via CLI  
**Interview tip**: Sensitive values are encrypted in database

### Common Configuration Paths
```bash
# Base URLs
php bin/magento config:set web/unsecure/base_url "http://example.com/"
php bin/magento config:set web/secure/base_url "https://example.com/"

# Use HTTPS
php bin/magento config:set web/secure/use_in_frontend 1
php bin/magento config:set web/secure/use_in_adminhtml 1

# Store Information
php bin/magento config:set general/store_information/name "My Store"
php bin/magento config:set general/store_information/phone "123-456-7890"

# Email Settings
php bin/magento config:set trans_email/ident_general/email "store@example.com"
php bin/magento config:set trans_email/ident_general/name "Store Owner"

# Currency
php bin/magento config:set currency/options/base USD
php bin/magento config:set currency/options/default USD

# Timezone
php bin/magento config:set general/locale/timezone "America/New_York"

# Search Engine
php bin/magento config:set catalog/search/engine elasticsearch7
php bin/magento config:set catalog/search/elasticsearch7_server_hostname localhost
php bin/magento config:set catalog/search/elasticsearch7_server_port 9200

# Cache Backend (Redis)
php bin/magento setup:config:set --cache-backend=redis --cache-backend-redis-server=127.0.0.1 --cache-backend-redis-db=0

# Session Storage (Redis)
php bin/magento setup:config:set --session-save=redis --session-save-redis-host=127.0.0.1 --session-save-redis-db=2

# Page Cache (Redis)
php bin/magento setup:config:set --page-cache=redis --page-cache-redis-server=127.0.0.1 --page-cache-redis-db=1
```

---

## Database Operations

### Database Backup
```bash
# Backup database only
php bin/magento setup:backup --db

# Backup database and media
php bin/magento setup:backup --db --media

# Backup everything (code + db + media)
php bin/magento setup:backup --code --db --media
```
**When to use**: Before major changes, upgrades, or deployments  
**Interview tip**: Backups stored in `var/backups/`

### Show Database Status
```bash
php bin/magento setup:db:status
```
**When to use**: Check if database upgrade needed  
**Output**: Shows pending schema/data upgrades

### Database Rollback
```bash
php bin/magento setup:rollback --db-file="<backup-file>"
```
**When to use**: Restore database from backup file

---

## Theme & Static Content

### List Themes
```bash
php bin/magento theme:list
```
**When to use**: See all available themes (frontend and admin)

### Deploy Theme
```bash
# Deploy specific theme
php bin/magento setup:static-content:deploy --theme Vendor/theme

# Deploy multiple themes
php bin/magento setup:static-content:deploy --theme Vendor/theme1 --theme Vendor/theme2
```
**When to use**: Deploy static assets for specific theme

---

## Admin & User Management

### Create Admin User
```bash
php bin/magento admin:user:create \
    --admin-user="newadmin" \
    --admin-password="Admin123!" \
    --admin-email="admin@example.com" \
    --admin-firstname="John" \
    --admin-lastname="Doe"
```
**When to use**: Create new administrator account  
**Interview tip**: Password must meet security requirements

### Unlock Admin User
```bash
php bin/magento admin:user:unlock adminusername
```
**When to use**: Unlock admin account after too many failed login attempts

### Change Admin URL
```bash
# Set custom admin URL
php bin/magento setup:config:set --backend-frontname="admin_custom"
```
**When to use**: Change admin URL for security  
**Default**: `/admin`  
**Interview tip**: Security best practice - use custom admin URL

### Reset Admin Password (via MySQL)
```sql
-- Find admin user
SELECT * FROM admin_user WHERE username='admin';

-- Update password (password: admin123)
UPDATE admin_user SET password = CONCAT(SHA2('xxxxxxxxxadmin123', 256), ':xxxxxxxxx:1') WHERE username = 'admin';

-- Or using Magento encryption
UPDATE admin_user SET password = CONCAT(SHA2('PasswordSalt123admin123', 256), ':PasswordSalt123:1') WHERE username = 'admin';
```
**When to use**: Emergency admin password reset  
**Interview tip**: Better to use `admin:user:create` to create new admin

---

## Debugging & Development

### Set Developer Mode
```bash
php bin/magento deploy:mode:set developer
```
**When to use**: Development environment  
**Features**: 
- Error display enabled
- No static file caching
- Enhanced logging
- Slower performance

### Set Production Mode
```bash
php bin/magento deploy:mode:set production
```
**When to use**: Production/live environment  
**Features**:
- Errors logged, not displayed
- Static files cached
- Best performance
- Requires compilation

### Set Default Mode
```bash
php bin/magento deploy:mode:set default
```
**When to use**: Between development and production  
**Interview tip**: Not recommended for any real environment

### Show Current Mode
```bash
php bin/magento deploy:mode:show
```
**When to use**: Check current deployment mode

### Enable Maintenance Mode
```bash
# Enable maintenance
php bin/magento maintenance:enable

# Enable with IP whitelist
php bin/magento maintenance:enable --ip=192.168.1.1 --ip=192.168.1.2

# Enable with custom addresses (addresses in file)
php bin/magento maintenance:enable --ip=/path/to/ip-addresses.txt
```
**When to use**: During deployment, upgrade, or maintenance  
**Interview tip**: Whitelisted IPs can access site during maintenance

### Disable Maintenance Mode
```bash
php bin/magento maintenance:disable
```
**When to use**: After maintenance is complete

### Check Maintenance Status
```bash
php bin/magento maintenance:status
```
**When to use**: Verify maintenance mode status

### Manage Maintenance IP Whitelist
```bash
# Show allowed IPs
php bin/magento maintenance:allow-ips

# Add IP to whitelist
php bin/magento maintenance:allow-ips 192.168.1.100

# Remove all IPs from whitelist
php bin/magento maintenance:allow-ips --none
```

### Enable Template Hints
```bash
# Frontend template hints
php bin/magento config:set dev/debug/template_hints_storefront 1

# Admin template hints
php bin/magento config:set dev/debug/template_hints_admin 1

# Show block names
php bin/magento config:set dev/debug/template_hints_blocks 1

# Disable template hints
php bin/magento config:set dev/debug/template_hints_storefront 0
php bin/magento config:set dev/debug/template_hints_admin 0
```
**When to use**: Development - to see which template files are used  
**Interview tip**: Never enable in production!

### Enable Profiler
```bash
php bin/magento config:set dev/debug/profiler 1
```
**When to use**: Performance debugging

### Disable JS/CSS Merging & Minification
```bash
# Disable JavaScript merge
php bin/magento config:set dev/js/merge_files 0

# Disable CSS merge
php bin/magento config:set dev/css/merge_css_files 0

# Disable JavaScript minification
php bin/magento config:set dev/js/minify_files 0

# Disable CSS minification
php bin/magento config:set dev/css/minify_files 0

# Disable HTML minification
php bin/magento config:set dev/template/minify_html 0
```
**When to use**: Development - easier debugging  
**Interview tip**: Always enable in production for performance

### Customer Data Section Invalidation
```bash
php bin/magento customer:hash:upgrade
```
**When to use**: After security updates affecting customer data

---

## Performance & Optimization

### Production Deployment (Full Process)
```bash
# 1. Enable maintenance mode
php bin/magento maintenance:enable

# 2. Update code (git pull, composer install, etc.)
git pull origin main
composer install --no-dev --optimize-autoloader

# 3. Clear var directories
rm -rf var/cache/* var/page_cache/* var/view_preprocessed/*

# 4. Database upgrade
php bin/magento setup:upgrade --keep-generated

# 5. Compile DI
php bin/magento setup:di:compile

# 6. Deploy static content
php bin/magento setup:static-content:deploy -f en_US --jobs=4

# 7. Reindex if needed
php bin/magento indexer:reindex

# 8. Flush cache
php bin/magento cache:flush

# 9. Disable maintenance mode
php bin/magento maintenance:disable
```
**Interview tip**: This is the COMPLETE deployment process - memorize this!

### Varnish VCL Export
```bash
# Export Varnish 6.x configuration
php bin/magento varnish:vcl:generate --export-version=6 > /etc/varnish/default.vcl

# Export Varnish 7.x configuration
php bin/magento varnish:vcl:generate --export-version=7 > /etc/varnish/default.vcl
```
**When to use**: Setup Varnish full page cache

### Image Resize
```bash
php bin/magento catalog:images:resize
```
**When to use**: Generate image cache for all product images  
**Interview tip**: Run after bulk product import

### Clean Static Files
```bash
php bin/magento setup:static-content:deploy -f --no-parent
```
**When to use**: Deploy only changed files (faster)

---

## Troubleshooting Commands

### Check File Permissions
```bash
# Correct ownership
sudo chown -R www-data:www-data /var/www/magento2

# Set correct permissions
sudo find /var/www/magento2 -type f -exec chmod 644 {} \;
sudo find /var/www/magento2 -type d -exec chmod 755 {} \;

# Writable directories
sudo chmod -R 777 /var/www/magento2/var
sudo chmod -R 777 /var/www/magento2/pub/static
sudo chmod -R 777 /var/www/magento2/pub/media
sudo chmod -R 777 /var/www/magento2/generated
```
**When to use**: Permission-related errors

### View Logs
```bash
# System log
tail -f var/log/system.log

# Exception log
tail -f var/log/exception.log

# Debug log
tail -f var/log/debug.log

# PHP-FPM log
sudo tail -f /var/log/php8.2-fpm.log

# Nginx error log
sudo tail -f /var/log/nginx/error.log
```
**When to use**: Debugging errors

### Clean Everything (Nuclear Option)
```bash
# Remove cache, generated, static
rm -rf var/cache/* var/page_cache/* var/view_preprocessed/* generated/* pub/static/*

# Clean cache
php bin/magento cache:clean

# Recompile
php bin/magento setup:di:compile

# Deploy static
php bin/magento setup:static-content:deploy -f

# Reindex
php bin/magento indexer:reindex
```
**When to use**: When everything is broken  
**Interview tip**: Last resort - use specific commands first

### Check Elasticsearch Connection
```bash
# Test Elasticsearch
curl -X GET "localhost:9200/"

# Check Magento Elasticsearch connection
php bin/magento catalog:search:engine:verify
```
**When to use**: Elasticsearch connection issues

### Refresh URL Rewrites
```bash
# Regenerate product URL rewrites
php bin/magento indexer:reindex catalog_product_attribute

# Regenerate category URL rewrites
php bin/magento indexer:reindex catalog_category_product
```
**When to use**: 404 errors on product/category pages

---

## Advanced Commands

### Import/Export
```bash
# Show import entities
php bin/magento import:info

# Import products
php bin/magento import:run --entity=catalog_product --behavior=append

# Export products
php bin/magento export:run --entity=catalog_product
```
**When to use**: Bulk data operations

### Queue Management
```bash
# Start consumers
php bin/magento queue:consumers:start <consumer_name>

# List consumers
php bin/magento queue:consumers:list

# Process messages
php bin/magento queue:consumers:start product_action_attribute.update
php bin/magento queue:consumers:start product_action_attribute.website.update
```
**When to use**: Async operations and message queues

### Sample Data
```bash
# Deploy sample data
php bin/magento sampledata:deploy

# Remove sample data
php bin/magento sampledata:remove
```
**When to use**: Development/demo environments

### App State
```bash
# Check app state
php bin/magento app:config:status

# Import configuration
php bin/magento app:config:import

# Dump configuration
php bin/magento app:config:dump
```
**When to use**: Configuration management and deployment

### Store Management
```bash
# Show store configuration
php bin/magento store:list

# Show website information
php bin/magento store:website:list
```
**When to use**: Multi-store setup verification

---

## Interview Tips & Tricks

### Must-Know Command Sequence for Interview

**Q: What's the complete deployment process?**
```bash
1. php bin/magento maintenance:enable
2. composer install --no-dev --optimize-autoloader
3. php bin/magento setup:upgrade
4. php bin/magento setup:di:compile
5. php bin/magento setup:static-content:deploy -f
6. php bin/magento cache:flush
7. php bin/magento maintenance:disable
```

### Critical Differences to Remember

| Topic | Key Difference | Interview Answer |
|-------|---------------|------------------|
| `cache:clean` vs `cache:flush` | Clean = smart removal<br>Flush = remove all | "Clean only removes invalidated cache, flush removes everything" |
| `realtime` vs `schedule` indexing | Realtime = immediate<br>Schedule = via cron | "Schedule mode with cron is production best practice" |
| Developer vs Production mode | Dev = errors shown<br>Prod = errors hidden | "Production mode requires compilation and deployment" |
| `setup:upgrade` vs `setup:di:compile` | Upgrade = schema/data<br>Compile = generate code | "Upgrade must run before compile" |

### Common Interview Questions & Answers

**Q: After installing a module, what commands should you run?**
```bash
php bin/magento module:enable Vendor_Module
php bin/magento setup:upgrade
php bin/magento setup:di:compile
php bin/magento setup:static-content:deploy -f
php bin/magento cache:flush
```

**Q: How to debug a Magento issue?**
```bash
1. Check logs: tail -f var/log/exception.log
2. Enable developer mode: php bin/magento deploy:mode:set developer
3. Disable cache: php bin/magento cache:disable
4. Enable template hints (if frontend issue)
5. Check Elasticsearch: curl localhost:9200
```

**Q: How to improve Magento performance?**
```bash
1. Enable production mode
2. Use Redis for cache/session
3. Enable Varnish full page cache
4. Set indexers to schedule mode
5. Use flat catalog
6. Enable JS/CSS merging and minification
7. Enable OPcache
8. Use Elasticsearch for search
```

**Q: What to do when site is slow?**
```bash
1. Check indexer status: php bin/magento indexer:status
2. Check cron: ps aux | grep cron
3. Check cache: php bin/magento cache:status
4. Check logs for errors
5. Check database queries
6. Check server resources (CPU, RAM, disk)
```

**Q: How to switch from development to production?**
```bash
php bin/magento deploy:mode:set production
# This automatically runs:
# - setup:di:compile
# - setup:static-content:deploy
```

---

## Common Scenarios & Solutions

### Scenario 1: "Admin login doesn't work"
```bash
# Check admin URL
grep -r "backend" app/etc/env.php

# Create new admin
php bin/magento admin:user:create --admin-user="newadmin" --admin-password="Admin123!" --admin-email="admin@example.com" --admin-firstname="Admin" --admin-lastname="User"

# Unlock admin
php bin/magento admin:user:unlock adminusername
```

### Scenario 2: "404 error on all pages"
```bash
# Check web server rewrites
# Nginx: verify try_files directive
# Apache: verify .htaccess and mod_rewrite

# Verify base URL
php bin/magento config:show web/unsecure/base_url
php bin/magento config:show web/secure/base_url

# Reindex URL rewrites
php bin/magento indexer:reindex
```

### Scenario 3: "Products not showing on frontend"
```bash
# Check indexer status
php bin/magento indexer:status

# Reindex
php bin/magento indexer:reindex catalog_product_price
php bin/magento indexer:reindex catalogsearch_fulltext

# Clear cache
php bin/magento cache:flush

# Check product visibility, status, stock in admin
```

### Scenario 4: "Search not working"
```bash
# Check Elasticsearch
curl localhost:9200

# Verify Elasticsearch configuration
php bin/magento config:show catalog/search/engine
php bin/magento config:show catalog/search/elasticsearch7_server_hostname

# Reindex search
php bin/magento indexer:reindex catalogsearch_fulltext

# Clear cache
php bin/magento cache:clean
```

### Scenario 5: "Static files not loading"
```bash
# Check static file signature
grep -r "static_content_deploy" app/etc/env.php

# Redeploy static content
php bin/magento setup:static-content:deploy -f

# Check permissions
ls -la pub/static/

# Clear browser cache
```

### Scenario 6: "Customer can't login"
```bash
# Check cache
php bin/magento cache:clean

# Check session configuration
grep -A 10 "session" app/etc/env.php

# Clear customer sessions
redis-cli FLUSHDB  # if using Redis for sessions
```

### Scenario 7: "Site is in maintenance mode but showing blank page"
```bash
# Check maintenance flag
ls -la var/.maintenance.flag

# Disable maintenance
php bin/magento maintenance:disable

# Or manually remove flag
rm var/.maintenance.flag
```

### Scenario 8: "Module not working after installation"
```bash
# Check if enabled
php bin/magento module:status Vendor_Module

# Enable if disabled
php bin/magento module:enable Vendor_Module

# Run setup upgrade
php bin/magento setup:upgrade

# Clear cache
php bin/magento cache:flush

# Compile (if production mode)
php bin/magento setup:di:compile
```

---

## Quick Reference Cheat Sheet

### Daily Developer Commands
```bash
# Clear cache
php bin/magento cache:clean

# Reindex
php bin/magento indexer:reindex

# Deploy static (dev)
php bin/magento setup:static-content:deploy -f

# Check logs
tail -f var/log/system.log
```

### After Module Changes
```bash
php bin/magento module:enable Vendor_Module
php bin/magento setup:upgrade
php bin/magento cache:flush
```

### Production Deployment
```bash
php bin/magento maintenance:enable
composer install --no-dev
php bin/magento setup:upgrade
php bin/magento setup:di:compile
php bin/magento setup:static-content:deploy -f --jobs=4
php bin/magento cache:flush
php bin/magento maintenance:disable
```

### Emergency Fixes
```bash
# Everything broken
rm -rf var/cache/* generated/* pub/static/*
php bin/magento setup:di:compile
php bin/magento setup:static-content:deploy -f
php bin/magento indexer:reindex

# Admin login issue
php bin/magento admin:user:create

# Search not working
php bin/magento indexer:reindex catalogsearch_fulltext

# Permission issues
sudo chown -R www-data:www-data .
sudo find . -type d -exec chmod 755 {} \;
sudo find . -type f -exec chmod 644 {} \;
sudo chmod -R 777 var pub/static pub/media generated
```

---

## Command Categories Summary

### Most Used (Memorize These!)
1. `php bin/magento cache:flush`
2. `php bin/magento setup:upgrade`
3. `php bin/magento setup:di:compile`
4. `php bin/magento setup:static-content:deploy -f`
5. `php bin/magento indexer:reindex`
6. `php bin/magento module:enable`
7. `php bin/magento deploy:mode:set`
8. `php bin/magento maintenance:enable/disable`

### Performance Critical
- `setup:di:compile` - Compile DI
- `setup:static-content:deploy` - Deploy static files
- `indexer:set-mode schedule` - Set indexing to cron
- `cache:enable` - Enable cache

### Debugging Commands
- `deploy:mode:set developer` - Enable dev mode
- `cache:disable` - Disable cache
- Config template hints
- Check logs

### Production Commands
- `maintenance:enable` - Maintenance mode
- `setup:backup` - Create backup
- `deploy:mode:set production` - Production mode
- Full deployment sequence

---

## Pro Tips for Interview

### 1. **Always Mention These Points:**
- Run `setup:upgrade` after module installation
- Run `cache:flush` after configuration changes
- Use `--keep-generated` only when appropriate
- Backup before major changes
- Never disable cache in production

### 2. **Show You Understand Performance:**
- Use `-f` flag carefully (skips validation)
- Use `--jobs` for parallel processing
- Schedule mode for indexing in production
- Redis for cache/session in production
- Varnish for full page cache

### 3. **Demonstrate Production Experience:**
- Always mention maintenance mode during deployment
- Talk about backup strategy
- Mention zero-downtime deployment
- Know the complete deployment sequence
- Understand rollback procedures

### 4. **Common Mistakes to Avoid:**
- Don't say "just clear cache" for everything
- Don't skip `setup:upgrade` after module install
- Don't run `setup:di:compile` in developer mode
- Don't forget to disable maintenance mode
- Don't enable template hints in production

### 5. **Red Flags (What NOT to Say):**
- "I always use `chmod 777` for everything"
- "I manually edit core files"
- "Cache causes issues, so I keep it disabled"
- "I never use version control"
- "I deploy directly to production without testing"

---

## Final Interview Preparation Checklist

✅ **Memorize**: Complete deployment sequence  
✅ **Understand**: Difference between cache:clean and cache:flush  
✅ **Know**: All indexer modes and when to use them  
✅ **Remember**: Setup:upgrade must run after module changes  
✅ **Master**: Developer vs Production mode differences  
✅ **Practice**: Common troubleshooting scenarios  
✅ **Learn**: Performance optimization commands  
✅ **Study**: Module management workflow  

---

**Good Luck with Your Interview!** 🚀

**Remember**: It's not just about knowing commands, but understanding WHEN and WHY to use them!

---

**Last Updated**: January 2026  
**Magento Version**: 2.4.x  
**Created for**: Interview Preparation
