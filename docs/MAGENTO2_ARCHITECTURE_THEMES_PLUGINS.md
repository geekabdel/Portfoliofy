# Magento 2 Architecture, Structure, Themes & Plugins - Interview Guide

## Table of Contents
1. [Magento 2 Architecture Overview](#magento-2-architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Module Structure](#module-structure)
4. [Theme Development](#theme-development)
5. [Plugins (Interceptors)](#plugins-interceptors)
6. [Dependency Injection](#dependency-injection)
7. [Code Layers](#code-layers)
8. [Design Patterns in Magento](#design-patterns-in-magento)
9. [Interview Questions & Answers](#interview-questions--answers)
10. [Best Practices](#best-practices)

---

## Magento 2 Architecture Overview

### Core Architectural Principles

Magento 2 follows these key principles:

1. **Modularity** - Divided into independent modules
2. **Service Contracts** - API interfaces for business logic
3. **Dependency Injection** - Loose coupling between components
4. **Events & Observers** - Event-driven architecture
5. **Plugins (Interceptors)** - Method modification without class rewrites
6. **Layout & UI Components** - Flexible presentation layer

### Architectural Layers

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                   │
│  (Web UI, Themes, Blocks, Controllers)      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Service Layer                        │
│  (Service Contracts, APIs, Business Logic)  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Domain Layer                         │
│  (Business Logic, Models, Resource Models)  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Persistence Layer                    │
│  (Database, File System, Cache)             │
└─────────────────────────────────────────────┘
```

**Interview Tip**: Explain that this layered architecture allows for flexibility, maintainability, and testability.

---

## Directory Structure

### Root Directory Structure

```
magento2/
├── app/                          # Application code
│   ├── code/                     # Custom modules
│   │   └── Vendor/
│   │       └── Module/
│   ├── design/                   # Custom themes
│   │   ├── frontend/
│   │   │   └── Vendor/
│   │   │       └── theme/
│   │   └── adminhtml/
│   ├── etc/                      # Application configuration
│   │   ├── config.php           # Module enable/disable list
│   │   ├── env.php              # Environment configuration
│   │   └── di.xml               # Global DI configuration
│   └── i18n/                     # Translation files
│
├── bin/                          # Magento CLI tool
│   └── magento                   # Main executable
│
├── dev/                          # Development tools & tests
│   ├── tests/                    # Test files
│   └── tools/                    # Development utilities
│
├── generated/                    # Auto-generated code
│   ├── code/                     # Factories, Proxies, Interceptors
│   └── metadata/                 # Metadata cache
│
├── lib/                          # Magento libraries
│   ├── internal/                 # Internal libraries
│   └── web/                      # JavaScript libraries
│
├── phpserver/                    # Built-in PHP server router
│
├── pub/                          # Public files (document root)
│   ├── static/                   # Static files (CSS, JS, images)
│   │   ├── frontend/
│   │   └── adminhtml/
│   ├── media/                    # Uploaded media files
│   │   ├── catalog/              # Product images
│   │   ├── customer/             # Customer files
│   │   └── wysiwyg/              # CMS images
│   ├── index.php                 # Application entry point
│   └── cron.php                  # Cron entry point
│
├── setup/                        # Installation scripts
│
├── var/                          # Variable/temporary files
│   ├── cache/                    # Cache files
│   ├── page_cache/               # Full page cache
│   ├── log/                      # Log files
│   │   ├── system.log
│   │   ├── exception.log
│   │   └── debug.log
│   ├── session/                  # Session files
│   ├── view_preprocessed/        # Preprocessed view files
│   ├── composer_home/            # Composer home
│   └── tmp/                      # Temporary files
│
└── vendor/                       # Composer dependencies
    └── magento/                  # Magento core modules
```

**Interview Tip**: Mention that `pub/` is the web server document root for security.

### Important Directory Explanations

| Directory | Purpose | Interview Answer |
|-----------|---------|------------------|
| `app/code/` | Custom and third-party modules | "Where we place custom modules following Vendor/Module structure" |
| `app/design/` | Custom themes | "Frontend and adminhtml themes, organized by Vendor/Theme" |
| `generated/` | Auto-generated code | "Contains factories, proxies, interceptors - should never be edited manually" |
| `pub/static/` | Deployed static files | "CSS, JS, images after deployment - can be cleared and regenerated" |
| `pub/media/` | User uploaded files | "Product images, customer uploads - must be backed up" |
| `var/` | Temporary/cache files | "Can be deleted and regenerated, except logs which should be archived" |
| `vendor/magento/` | Core Magento code | "Never modify - use preferences, plugins, or events instead" |

---

## Module Structure

### Standard Module Structure

```
app/code/Vendor/Module/
├── Api/                          # Service contracts (interfaces)
│   ├── Data/
│   │   └── ProductInterface.php
│   └── ProductRepositoryInterface.php
│
├── Block/                        # View blocks (presentation logic)
│   ├── Product/
│   │   └── View.php
│   └── Index.php
│
├── Console/                      # CLI commands
│   └── Command/
│       └── CustomCommand.php
│
├── Controller/                   # Controllers (handle requests)
│   ├── Adminhtml/               # Admin controllers
│   │   └── Index/
│   │       ├── Index.php
│   │       └── Save.php
│   └── Index/                   # Frontend controllers
│       └── Index.php
│
├── Cron/                        # Cron jobs
│   └── SyncData.php
│
├── etc/                         # Module configuration
│   ├── module.xml              # Module declaration
│   ├── di.xml                  # Dependency injection
│   ├── config.xml              # Default config values
│   ├── acl.xml                 # Access control list
│   ├── events.xml              # Event observers
│   ├── crontab.xml             # Cron jobs
│   ├── routes.xml              # URL routes
│   ├── adminhtml/
│   │   ├── di.xml
│   │   ├── events.xml
│   │   ├── menu.xml            # Admin menu
│   │   └── routes.xml
│   └── frontend/
│       ├── di.xml
│       ├── events.xml
│       └── routes.xml
│
├── Helper/                      # Helper classes
│   └── Data.php
│
├── i18n/                        # Translations
│   ├── en_US.csv
│   └── es_ES.csv
│
├── Model/                       # Business logic & data models
│   ├── Product.php             # Model
│   ├── ResourceModel/          # Resource models (DB interaction)
│   │   ├── Product.php
│   │   └── Product/
│   │       └── Collection.php  # Collection
│   └── Config/
│       └── Source/             # Config source models
│
├── Observer/                    # Event observers
│   └── ProductSaveAfter.php
│
├── Plugin/                      # Plugins (interceptors)
│   └── ProductPlugin.php
│
├── Setup/                       # Installation/upgrade scripts
│   ├── InstallSchema.php       # (Deprecated in 2.3+)
│   ├── UpgradeSchema.php       # (Deprecated in 2.3+)
│   ├── InstallData.php
│   ├── UpgradeData.php
│   ├── Recurring.php
│   └── Patch/                  # Declarative patches (2.3+)
│       ├── Data/
│       │   └── AddDefaultData.php
│       └── Schema/
│           └── AddCustomTable.php
│
├── Test/                        # Unit & integration tests
│   ├── Unit/
│   └── Integration/
│
├── Ui/                          # UI components
│   ├── Component/
│   └── DataProvider/
│
├── ViewModel/                   # View models (2.2+)
│   └── ProductViewModel.php
│
├── view/                        # View layer files
│   ├── adminhtml/
│   │   ├── layout/             # Admin layouts
│   │   │   └── module_index_index.xml
│   │   ├── templates/          # Admin templates
│   │   │   └── index.phtml
│   │   ├── ui_component/       # UI components (grids, forms)
│   │   │   └── product_form.xml
│   │   └── web/
│   │       ├── css/
│   │       ├── js/
│   │       └── images/
│   ├── frontend/
│   │   ├── layout/             # Frontend layouts
│   │   │   ├── default.xml
│   │   │   ├── catalog_product_view.xml
│   │   │   └── checkout_cart_index.xml
│   │   ├── templates/          # Frontend templates
│   │   │   └── product/
│   │   │       └── view.phtml
│   │   ├── web/
│   │   │   ├── css/
│   │   │   │   └── source/
│   │   │   │       └── _module.less
│   │   │   ├── js/
│   │   │   │   └── custom.js
│   │   │   └── images/
│   │   └── requirejs-config.js # RequireJS configuration
│   └── base/                   # Base area (shared)
│
├── composer.json                # Module dependencies
├── registration.php            # Module registration
└── README.md
```

### Essential Module Files

#### 1. registration.php (Required)
```php
<?php
use Magento\Framework\Component\ComponentRegistrar;

ComponentRegistrar::register(
    ComponentRegistrar::MODULE,
    'Vendor_Module',
    __DIR__
);
```
**Purpose**: Registers the module with Magento  
**Interview Tip**: This file is REQUIRED for Magento to recognize the module

#### 2. etc/module.xml (Required)
```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">
    <module name="Vendor_Module" setup_version="1.0.0">
        <sequence>
            <module name="Magento_Catalog"/>
            <module name="Magento_Customer"/>
        </sequence>
    </module>
</config>
```
**Purpose**: Declares module and dependencies  
**Interview Tip**: `<sequence>` defines load order dependencies

#### 3. etc/di.xml (Dependency Injection)
```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:noNamespaceSchemaLocation="urn:magento:framework:ObjectManager/etc/config.xsd">
    
    <!-- Preference (Class Override) -->
    <preference for="Magento\Catalog\Model\Product" 
                type="Vendor\Module\Model\CustomProduct"/>
    
    <!-- Plugin -->
    <type name="Magento\Catalog\Model\Product">
        <plugin name="vendor_module_product_plugin" 
                type="Vendor\Module\Plugin\ProductPlugin" 
                sortOrder="10" 
                disabled="false"/>
    </type>
    
    <!-- Virtual Type -->
    <virtualType name="CustomProductCollection" 
                 type="Magento\Catalog\Model\ResourceModel\Product\Collection">
        <arguments>
            <argument name="limit" xsi:type="number">10</argument>
        </arguments>
    </virtualType>
    
</config>
```

---

## Theme Development

### Theme Structure

```
app/design/frontend/Vendor/theme/
├── Magento_Theme/                    # Module-specific theme files
│   ├── layout/
│   │   └── default.xml
│   ├── templates/
│   │   └── html/
│   │       └── header.phtml
│   └── web/
│       └── css/
│           └── source/
│               └── _extend.less
│
├── Magento_Catalog/
│   ├── layout/
│   │   ├── catalog_product_view.xml
│   │   └── catalog_category_view.xml
│   ├── templates/
│   │   └── product/
│   │       ├── view.phtml
│   │       └── list.phtml
│   └── web/
│       ├── css/
│       └── js/
│
├── web/                             # Theme static files
│   ├── css/
│   │   └── source/
│   │       ├── _extend.less        # Extend parent styles
│   │       ├── _theme.less         # Main theme styles
│   │       └── _variables.less     # Override variables
│   ├── js/
│   │   └── theme.js
│   ├── images/
│   │   ├── logo.svg
│   │   └── favicon.ico
│   └── fonts/
│
├── etc/
│   └── view.xml                    # Theme configuration
│
├── i18n/                           # Theme translations
│   └── en_US.csv
│
├── media/                          # Theme preview images
│   └── preview.jpg
│
├── composer.json                   # Theme dependencies
├── registration.php               # Theme registration
└── theme.xml                      # Theme declaration
```

### Required Theme Files

#### 1. registration.php
```php
<?php
use Magento\Framework\Component\ComponentRegistrar;

ComponentRegistrar::register(
    ComponentRegistrar::THEME,
    'frontend/Vendor/theme',
    __DIR__
);
```

#### 2. theme.xml
```xml
<?xml version="1.0"?>
<theme xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
       xsi:noNamespaceSchemaLocation="urn:magento:framework:Config/etc/theme.xsd">
    <title>Vendor Theme</title>
    <parent>Magento/luma</parent>
    <media>
        <preview_image>media/preview.jpg</preview_image>
    </media>
</theme>
```
**Interview Tip**: `<parent>` defines theme inheritance - child themes extend parent themes

#### 3. etc/view.xml
```xml
<?xml version="1.0"?>
<view xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xsi:noNamespaceSchemaLocation="urn:magento:framework:Config/etc/view.xsd">
    <media>
        <images module="Magento_Catalog">
            <image id="category_page_grid" type="small_image">
                <width>240</width>
                <height>300</height>
            </image>
            <image id="product_page_image_large" type="image">
                <width>700</width>
                <height>700</height>
            </image>
        </images>
    </media>
</view>
```
**Purpose**: Configure image sizes, gallery settings

### Theme Hierarchy & Fallback

```
Custom Theme (app/design/frontend/Vendor/theme)
        ↓ (if not found)
Parent Theme (vendor/magento/theme-frontend-luma)
        ↓ (if not found)
Module Theme (Vendor/Module/view/frontend)
        ↓ (if not found)
Base Theme (lib/web)
```

**Interview Tip**: Magento uses fallback mechanism to find templates and layouts.

### Layout XML Files

#### Types of Layout Files

1. **Page Layout** - Overall page structure
```xml
<!-- Magento_Theme/page_layout/2columns-left.xml -->
<layout xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <update handle="1column"/>
    <referenceContainer name="columns">
        <container name="div.sidebar.main" 
                   htmlTag="div" 
                   htmlClass="sidebar sidebar-main" 
                   after="main">
            <container name="sidebar.main" as="sidebar_main" label="Sidebar Main"/>
        </container>
    </referenceContainer>
</layout>
```

2. **Page Configuration** - Page-specific layout
```xml
<!-- catalog_product_view.xml -->
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      layout="1column" 
      xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <!-- Add block -->
        <referenceContainer name="content">
            <block class="Magento\Catalog\Block\Product\View" 
                   name="product.info" 
                   template="Magento_Catalog::product/view.phtml"/>
        </referenceContainer>
        
        <!-- Move block -->
        <move element="product.info.review" destination="content" after="product.info"/>
        
        <!-- Remove block -->
        <referenceBlock name="product.info.upsell" remove="true"/>
        
        <!-- Update block arguments -->
        <referenceBlock name="product.info">
            <arguments>
                <argument name="custom_param" xsi:type="string">value</argument>
            </arguments>
        </referenceBlock>
    </body>
</page>
```

#### Layout XML Instructions

| Instruction | Purpose | Example |
|-------------|---------|---------|
| `<block>` | Add a block | `<block class="..." name="..." template="..."/>` |
| `<container>` | Add a container | `<container name="..." htmlTag="div" htmlClass="..."/>` |
| `<referenceBlock>` | Reference existing block | `<referenceBlock name="product.info">` |
| `<referenceContainer>` | Reference existing container | `<referenceContainer name="content">` |
| `<move>` | Move element | `<move element="..." destination="..." after="..."/>` |
| `<remove>` | Remove element | `<remove name="..."/>` or `remove="true"` |
| `<arguments>` | Pass arguments to block | `<argument name="..." xsi:type="...">value</argument>` |
| `<action>` | Call block method | `<action method="setTitle">` (deprecated) |

**Interview Tip**: Layout XML uses instructions to modify page structure without rewriting templates.

### Template Files (.phtml)

```php
<?php
/**
 * @var $block \Magento\Catalog\Block\Product\View
 * @var $escaper \Magento\Framework\Escaper
 */
?>
<div class="product-info-main">
    <h1 class="page-title">
        <?= $escaper->escapeHtml($block->getProduct()->getName()) ?>
    </h1>
    
    <div class="product-info-price">
        <?= /* @noEscape */ $block->getChildHtml('product.price') ?>
    </div>
    
    <div class="product-add-form">
        <?= $block->getChildHtml('product.info.form') ?>
    </div>
    
    <?php if ($block->getProduct()->getDescription()): ?>
        <div class="product-description">
            <?= /* @noEscape */ $block->getProduct()->getDescription() ?>
        </div>
    <?php endif; ?>
</div>
```

#### Template Best Practices

1. **Always escape output**
```php
// Escape HTML
<?= $escaper->escapeHtml($string) ?>

// Escape URL
<?= $escaper->escapeUrl($url) ?>

// Escape JS
<?= $escaper->escapeJs($string) ?>

// Don't escape (use with caution)
<?= /* @noEscape */ $html ?>
```

2. **Get child blocks**
```php
// Get child HTML
<?= $block->getChildHtml('block.name') ?>

// Get all children
<?= $block->getChildChildHtml() ?>

// Check if child exists
<?php if ($block->getChildBlock('block.name')): ?>
```

3. **Get URLs**
```php
// Get URL by route
<?= $block->getUrl('catalog/product/view', ['id' => 123]) ?>

// Get base URL
<?= $block->getBaseUrl() ?>

// Get media URL
<?= $block->getMediaUrl() ?>

// Get static view file URL
<?= $block->getViewFileUrl('Magento_Catalog::images/product.png') ?>
```

### CSS/LESS in Themes

#### _extend.less (Extend Parent Styles)
```less
// app/design/frontend/Vendor/theme/web/css/source/_extend.less

// Import module styles
@import 'module/_custom.less';

// Override variables
@primary__color: #007bff;
@font-family__base: 'Open Sans', sans-serif;

// Add custom styles
.product-info-main {
    background: @primary__color;
    padding: 20px;
    
    .product-name {
        font-size: 24px;
        color: @text__color;
    }
}
```

#### _theme.less (Override All Styles)
```less
// app/design/frontend/Vendor/theme/web/css/source/_theme.less

// This file replaces parent theme completely
@import 'source/_reset.less';
@import 'source/_variables.less';
@import 'source/layout/_grid.less';
```

**Interview Tip**: Use `_extend.less` to add to parent styles, `_theme.less` to replace them entirely.

---

## Plugins (Interceptors)

### What are Plugins?

**Plugins (Interceptors)** allow you to modify the behavior of public methods WITHOUT modifying the original class. They are the preferred way to customize Magento functionality.

**Interview Tip**: Plugins are better than preferences (class overrides) because they allow multiple modules to modify the same method.

### Plugin Types

#### 1. Before Plugin
```php
<?php
namespace Vendor\Module\Plugin;

class ProductPlugin
{
    /**
     * Before setName - modify input arguments
     *
     * @param \Magento\Catalog\Model\Product $subject
     * @param string $name
     * @return array Modified arguments
     */
    public function beforeSetName(
        \Magento\Catalog\Model\Product $subject,
        $name
    ) {
        // Modify the argument
        $name = strtoupper($name);
        
        // Return modified arguments as array
        return [$name];
    }
}
```
**When to use**: Modify input parameters before method execution  
**Interview Tip**: Must return array of modified arguments

#### 2. After Plugin
```php
<?php
namespace Vendor\Module\Plugin;

class ProductPlugin
{
    /**
     * After getName - modify return value
     *
     * @param \Magento\Catalog\Model\Product $subject
     * @param string $result Original return value
     * @return string Modified return value
     */
    public function afterGetName(
        \Magento\Catalog\Model\Product $subject,
        $result
    ) {
        // Modify the result
        $result .= ' - Custom Suffix';
        
        return $result;
    }
}
```
**When to use**: Modify return value after method execution  
**Interview Tip**: Second parameter is the original return value

#### 3. Around Plugin
```php
<?php
namespace Vendor\Module\Plugin;

class ProductPlugin
{
    /**
     * Around save - wrap method execution
     *
     * @param \Magento\Catalog\Model\Product $subject
     * @param \Closure $proceed Original method
     * @param mixed ...$args Method arguments
     * @return mixed
     */
    public function aroundSave(
        \Magento\Catalog\Model\Product $subject,
        \Closure $proceed,
        ...$args
    ) {
        // Before original method
        $name = $subject->getName();
        
        // Call original method
        $result = $proceed(...$args);
        
        // After original method
        // Log or do something
        
        return $result;
    }
}
```
**When to use**: Execute code before AND after method, or prevent method execution  
**Interview Tip**: MUST call `$proceed()` to execute original method (unless you want to prevent it)

### Plugin Configuration (di.xml)

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <type name="Magento\Catalog\Model\Product">
        <plugin name="vendor_module_product_plugin" 
                type="Vendor\Module\Plugin\ProductPlugin" 
                sortOrder="10" 
                disabled="false"/>
    </type>
</config>
```

**Attributes**:
- `name` - Unique plugin identifier
- `type` - Plugin class
- `sortOrder` - Execution order (lower = earlier)
- `disabled` - Enable/disable plugin

### Plugin Limitations

**Plugins CANNOT be used on**:
- Final methods/classes
- Non-public methods (private, protected)
- Static methods
- `__construct()` methods
- Virtual types
- Objects instantiated before DI (like registration.php)

**Interview Tip**: If plugin doesn't work, check if method is public and non-final.

### Plugin vs Preference vs Observer

| Feature | Plugin | Preference | Observer |
|---------|--------|------------|----------|
| Modify method behavior | ✅ Yes | ✅ Yes | ❌ No |
| Multiple modifications | ✅ Yes | ❌ No | ✅ Yes |
| Modify return value | ✅ Yes | ✅ Yes | ❌ No |
| Listen to events | ❌ No | ❌ No | ✅ Yes |
| Override entire class | ❌ No | ✅ Yes | ❌ No |
| Recommended approach | ✅ Yes | ⚠️ Avoid | ✅ Yes |

**Interview Tip**: Use plugins for method modification, observers for event handling, avoid preferences when possible.

### Complete Plugin Example

#### 1. Create Plugin Class
```php
<?php
// app/code/Vendor/Module/Plugin/Catalog/ProductPlugin.php
namespace Vendor\Module\Plugin\Catalog;

use Magento\Catalog\Model\Product;
use Psr\Log\LoggerInterface;

class ProductPlugin
{
    private $logger;
    
    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
    
    /**
     * Before save - validate product name
     */
    public function beforeSave(Product $subject)
    {
        $name = $subject->getName();
        
        if (strlen($name) < 3) {
            throw new \Exception('Product name too short');
        }
        
        return null; // No argument modification
    }
    
    /**
     * After save - log activity
     */
    public function afterSave(Product $subject, $result)
    {
        $this->logger->info('Product saved: ' . $subject->getId());
        
        return $result;
    }
    
    /**
     * Around getPrice - add custom logic
     */
    public function aroundGetPrice(Product $subject, \Closure $proceed)
    {
        // Get original price
        $price = $proceed();
        
        // Add custom markup
        if ($subject->getCustomAttribute('premium')) {
            $price = $price * 1.2;
        }
        
        return $price;
    }
}
```

#### 2. Configure Plugin (di.xml)
```xml
<?xml version="1.0"?>
<!-- app/code/Vendor/Module/etc/di.xml -->
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <type name="Magento\Catalog\Model\Product">
        <plugin name="vendor_module_product_plugin" 
                type="Vendor\Module\Plugin\Catalog\ProductPlugin" 
                sortOrder="10"/>
    </type>
</config>
```

#### 3. Plugin Execution Order

If multiple plugins on same method:
```xml
<type name="Magento\Catalog\Model\Product">
    <plugin name="plugin_a" type="..." sortOrder="10"/>
    <plugin name="plugin_b" type="..." sortOrder="20"/>
    <plugin name="plugin_c" type="..." sortOrder="30"/>
</type>
```

Execution order:
1. `plugin_a->beforeMethod()`
2. `plugin_b->beforeMethod()`
3. `plugin_c->beforeMethod()`
4. `plugin_c->aroundMethod()` start
5. `plugin_b->aroundMethod()` start
6. `plugin_a->aroundMethod()` start
7. **Original Method**
8. `plugin_a->aroundMethod()` end
9. `plugin_b->aroundMethod()` end
10. `plugin_c->aroundMethod()` end
11. `plugin_a->afterMethod()`
12. `plugin_b->afterMethod()`
13. `plugin_c->afterMethod()`

**Interview Tip**: Before plugins execute in sortOrder, around plugins nest, after plugins execute in sortOrder.

---

## Dependency Injection

### What is Dependency Injection?

**Dependency Injection (DI)** is a design pattern where objects receive their dependencies from external sources rather than creating them internally.

**Interview Tip**: Magento uses constructor injection - dependencies are passed through `__construct()`.

### Constructor Injection Example

```php
<?php
namespace Vendor\Module\Model;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Psr\Log\LoggerInterface;

class ProductService
{
    private $productRepository;
    private $scopeConfig;
    private $logger;
    
    /**
     * Constructor injection
     */
    public function __construct(
        ProductRepositoryInterface $productRepository,
        ScopeConfigInterface $scopeConfig,
        LoggerInterface $logger
    ) {
        $this->productRepository = $productRepository;
        $this->scopeConfig = $scopeConfig;
        $this->logger = $logger;
    }
    
    public function getProduct($id)
    {
        try {
            return $this->productRepository->getById($id);
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            return null;
        }
    }
}
```

**Interview Tip**: Always inject interfaces, not concrete classes (follow programming to interface principle).

### DI Configuration (di.xml)

#### 1. Preference (Interface to Class Mapping)
```xml
<config>
    <!-- Map interface to implementation -->
    <preference for="Magento\Catalog\Api\ProductRepositoryInterface" 
                type="Magento\Catalog\Model\ProductRepository"/>
    
    <!-- Override class -->
    <preference for="Magento\Catalog\Model\Product" 
                type="Vendor\Module\Model\CustomProduct"/>
</config>
```

#### 2. Type Configuration (Constructor Arguments)
```xml
<config>
    <type name="Vendor\Module\Model\ProductService">
        <arguments>
            <!-- String argument -->
            <argument name="cacheTtl" xsi:type="number">3600</argument>
            
            <!-- Object argument -->
            <argument name="logger" xsi:type="object">Vendor\Module\Logger</argument>
            
            <!-- Array argument -->
            <argument name="config" xsi:type="array">
                <item name="enabled" xsi:type="boolean">true</item>
                <item name="timeout" xsi:type="number">30</item>
            </argument>
        </arguments>
    </type>
</config>
```

#### 3. Virtual Types
```xml
<config>
    <!-- Create virtual type without PHP class -->
    <virtualType name="CustomProductCollection" 
                 type="Magento\Catalog\Model\ResourceModel\Product\Collection">
        <arguments>
            <argument name="limit" xsi:type="number">10</argument>
        </arguments>
    </virtualType>
    
    <!-- Inject virtual type -->
    <type name="Vendor\Module\Block\Products">
        <arguments>
            <argument name="collection" xsi:type="object">CustomProductCollection</argument>
        </arguments>
    </type>
</config>
```

**Interview Tip**: Virtual types allow creating specialized versions without creating new PHP classes.

### ObjectManager Anti-Pattern

```php
// ❌ WRONG - Never do this
$objectManager = \Magento\Framework\App\ObjectManager::getInstance();
$product = $objectManager->create('Magento\Catalog\Model\Product');

// ✅ CORRECT - Use dependency injection
class MyClass
{
    private $productFactory;
    
    public function __construct(
        \Magento\Catalog\Model\ProductFactory $productFactory
    ) {
        $this->productFactory = $productFactory;
    }
    
    public function createProduct()
    {
        return $this->productFactory->create();
    }
}
```

**Interview Tip**: ObjectManager should NEVER be used directly except in integration tests and certain core classes.

---

## Code Layers

### Presentation Layer

**Components**: Controllers, Blocks, Templates, Layout XML

**Controller Example**:
```php
<?php
namespace Vendor\Module\Controller\Index;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\View\Result\PageFactory;

class Index extends Action
{
    private $pageFactory;
    
    public function __construct(
        Context $context,
        PageFactory $pageFactory
    ) {
        parent::__construct($context);
        $this->pageFactory = $pageFactory;
    }
    
    public function execute()
    {
        return $this->pageFactory->create();
    }
}
```

**Block Example**:
```php
<?php
namespace Vendor\Module\Block;

use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Vendor\Module\Model\ProductService;

class ProductList extends Template
{
    private $productService;
    
    public function __construct(
        Context $context,
        ProductService $productService,
        array $data = []
    ) {
        $this->productService = $productService;
        parent::__construct($context, $data);
    }
    
    public function getProducts()
    {
        return $this->productService->getProductList();
    }
}
```

### Service Layer

**Components**: Service contracts (API interfaces), Repositories

**Repository Interface**:
```php
<?php
namespace Vendor\Module\Api;

interface CustomRepositoryInterface
{
    /**
     * @param int $id
     * @return \Vendor\Module\Api\Data\CustomInterface
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function getById($id);
    
    /**
     * @param \Vendor\Module\Api\Data\CustomInterface $entity
     * @return \Vendor\Module\Api\Data\CustomInterface
     * @throws \Magento\Framework\Exception\CouldNotSaveException
     */
    public function save(\Vendor\Module\Api\Data\CustomInterface $entity);
    
    /**
     * @param \Vendor\Module\Api\Data\CustomInterface $entity
     * @return bool
     * @throws \Magento\Framework\Exception\CouldNotDeleteException
     */
    public function delete(\Vendor\Module\Api\Data\CustomInterface $entity);
}
```

**Interview Tip**: Service contracts ensure backward compatibility and enable API access.

### Domain Layer

**Components**: Models, Resource Models, Collections

**Model**:
```php
<?php
namespace Vendor\Module\Model;

use Magento\Framework\Model\AbstractModel;
use Vendor\Module\Api\Data\CustomInterface;

class Custom extends AbstractModel implements CustomInterface
{
    protected function _construct()
    {
        $this->_init(\Vendor\Module\Model\ResourceModel\Custom::class);
    }
    
    public function getName()
    {
        return $this->getData(self::NAME);
    }
    
    public function setName($name)
    {
        return $this->setData(self::NAME, $name);
    }
}
```

**Resource Model**:
```php
<?php
namespace Vendor\Module\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;

class Custom extends AbstractDb
{
    protected function _construct()
    {
        $this->_init('vendor_custom_table', 'entity_id');
    }
}
```

**Collection**:
```php
<?php
namespace Vendor\Module\Model\ResourceModel\Custom;

use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;

class Collection extends AbstractCollection
{
    protected function _construct()
    {
        $this->_init(
            \Vendor\Module\Model\Custom::class,
            \Vendor\Module\Model\ResourceModel\Custom::class
        );
    }
}
```

---

## Design Patterns in Magento

### 1. Factory Pattern

**Purpose**: Create objects without specifying exact class

```php
// Factory is auto-generated
$product = $this->productFactory->create();

// Factory with data
$product = $this->productFactory->create(['data' => ['name' => 'Test']]);
```

**Interview Tip**: Factories are auto-generated in `generated/code/` directory.

### 2. Repository Pattern

**Purpose**: Centralize data access logic

```php
// Load entity
$product = $this->productRepository->getById($id);

// Save entity
$product->setName('New Name');
$this->productRepository->save($product);

// Delete entity
$this->productRepository->delete($product);
```

### 3. Proxy Pattern

**Purpose**: Lazy loading of objects

```php
// Injecting proxy
public function __construct(
    \Magento\Catalog\Model\Product\Proxy $product
) {
    $this->product = $product; // Not instantiated yet
}

public function doSomething()
{
    $this->product->load(1); // Now instantiated
}
```

**Interview Tip**: Proxies prevent circular dependencies and improve performance.

### 4. Observer Pattern

**Purpose**: Event-driven programming

```php
// Dispatch event
$this->eventManager->dispatch('custom_event', ['product' => $product]);

// Observe event (etc/events.xml)
<event name="custom_event">
    <observer name="vendor_module_observer" 
              instance="Vendor\Module\Observer\CustomObserver"/>
</event>

// Observer class
class CustomObserver implements ObserverInterface
{
    public function execute(Observer $observer)
    {
        $product = $observer->getData('product');
        // Do something
    }
}
```

### 5. Singleton Pattern

**Purpose**: Single instance per request

```php
// Configured in di.xml
<type name="Vendor\Module\Model\Config" shared="true"/>

// Or in PHP (not recommended)
class Config
{
    private static $instance;
    
    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}
```

---

## Interview Questions & Answers

### Architecture Questions

**Q: Explain Magento 2 architecture layers**

**A**: Magento 2 has four layers:
1. **Presentation Layer** - Controllers, Blocks, Templates, Layouts (handles UI)
2. **Service Layer** - Service contracts, APIs (business logic interfaces)
3. **Domain Layer** - Models, Resource Models, Collections (business logic implementation)
4. **Persistence Layer** - Database, cache, file system (data storage)

This separation allows flexibility - you can change presentation without touching business logic.

---

**Q: What is the difference between app/code and vendor directories?**

**A**: 
- `app/code/` - Custom and third-party modules we develop or install manually
- `vendor/` - Composer-managed dependencies including Magento core
- Never modify `vendor/` - changes will be lost on composer update
- Custom code goes in `app/code/` following Vendor/Module structure

---

**Q: Explain Magento 2 module structure**

**A**: A module requires:
1. `registration.php` - Registers module with Magento
2. `etc/module.xml` - Declares module name, version, dependencies
3. `composer.json` - Defines composer dependencies

Optional but common directories:
- `Controller/` - Handle requests
- `Model/` - Business logic
- `Block/` - Presentation logic
- `view/` - Templates, layouts, static files
- `etc/di.xml` - Dependency injection configuration
- `Setup/` - Installation/upgrade scripts

---

**Q: How does Magento know which modules to load and in what order?**

**A**: 
1. Magento reads `registration.php` from all registered modules
2. Reads `etc/module.xml` to get dependencies via `<sequence>` tag
3. Creates dependency graph and loads modules in correct order
4. `app/etc/config.php` stores enabled/disabled status

---

### Theme Questions

**Q: Explain theme inheritance and fallback mechanism**

**A**: Magento uses a fallback system to find templates and layouts:
1. Custom theme (`app/design/frontend/Vendor/theme`)
2. Parent theme (defined in `theme.xml`)
3. Module view files (`Module/view/frontend`)
4. Base library (`lib/web`)

If a template isn't found in custom theme, Magento looks in parent, then module, then base.

---

**Q: What files are required to create a theme?**

**A**: Minimum required files:
1. `registration.php` - Register theme with Magento
2. `theme.xml` - Declare theme title and parent
3. `composer.json` - Define dependencies

For functionality:
4. `etc/view.xml` - Image sizes, gallery config
5. `web/css/source/_extend.less` - Custom styles

---

**Q: How do you override a template in a theme?**

**A**: Place template in same path structure under theme:
- Original: `vendor/magento/module-catalog/view/frontend/templates/product/view.phtml`
- Override: `app/design/frontend/Vendor/theme/Magento_Catalog/templates/product/view.phtml`

Magento's fallback system will use theme template instead of module template.

---

**Q: Explain difference between _extend.less and _theme.less**

**A**:
- `_extend.less` - **Extends** parent theme styles (recommended)
- `_theme.less` - **Replaces** parent theme styles completely

Use `_extend.less` to add custom styles while keeping parent styles.
Use `_theme.less` only if you want to rewrite all styles from scratch.

---

**Q: What are the main layout XML instructions?**

**A**: Main instructions:
- `<block>` - Add new block
- `<container>` - Add container (wrapper)
- `<referenceBlock>` - Modify existing block
- `<referenceContainer>` - Modify existing container
- `<move>` - Move block/container
- `<remove>` - Remove block/container
- `<arguments>` - Pass data to blocks

These allow modifying page structure without changing templates.

---

### Plugin Questions

**Q: What are plugins (interceptors) and why use them?**

**A**: Plugins allow modifying public method behavior without rewriting the class. Benefits:
- Multiple modules can modify same method
- No class inheritance needed
- Maintainable and upgrade-safe
- Follows Open/Closed principle

Better than preferences (class overrides) which only allow one override.

---

**Q: Explain the three types of plugins**

**A**:
1. **Before Plugin** - Modifies input arguments before method execution
   - Returns array of modified arguments
   
2. **After Plugin** - Modifies return value after method execution
   - Receives original return value as parameter
   
3. **Around Plugin** - Wraps method execution
   - Can execute code before AND after
   - Must call `$proceed()` to execute original method
   - Can prevent original method execution

---

**Q: What are plugin limitations?**

**A**: Plugins cannot be used on:
- Final methods/classes
- Non-public methods (private/protected)
- Static methods
- `__construct()` method
- Virtual types
- Objects created before dependency injection

If plugin doesn't work, check if method is public and non-final.

---

**Q: What is sortOrder in plugins?**

**A**: SortOrder determines plugin execution order when multiple plugins on same method:
- Lower sortOrder executes first (10 before 20)
- Before plugins: execute in sortOrder
- Around plugins: nest in sortOrder (lower wraps inner)
- After plugins: execute in sortOrder

Example: sortOrder 10, 20, 30
- Execution: before-10, before-20, before-30, around-30(start), around-20(start), around-10(start), METHOD, around-10(end), around-20(end), around-30(end), after-10, after-20, after-30

---

**Q: Plugin vs Preference vs Observer - when to use each?**

**A**:
- **Plugin** - Modify specific method behavior, preferred approach
- **Preference** - Override entire class, use as last resort
- **Observer** - React to events, don't modify return values

Use plugins when possible - they're more flexible and maintainable.

---

### Dependency Injection Questions

**Q: What is Dependency Injection and why use it?**

**A**: DI is a design pattern where objects receive dependencies from external sources rather than creating them. Benefits:
- Loose coupling
- Easy testing (mock dependencies)
- Configuration flexibility
- Code reusability

Magento uses constructor injection - dependencies passed via `__construct()`.

---

**Q: What is the difference between preference and type in di.xml?**

**A**:
- **Preference** - Maps interface to implementation OR overrides class entirely
  ```xml
  <preference for="InterfaceA" type="ClassB"/>
  ```
  
- **Type** - Configures constructor arguments for specific class
  ```xml
  <type name="ClassA">
      <arguments>
          <argument name="param" xsi:type="string">value</argument>
      </arguments>
  </type>
  ```

---

**Q: What are Virtual Types?**

**A**: Virtual types create specialized versions of classes without creating PHP files:
```xml
<virtualType name="SpecializedCollection" type="BaseCollection">
    <arguments>
        <argument name="limit" xsi:type="number">10</argument>
    </arguments>
</virtualType>
```

Benefits:
- No new PHP class needed
- Reduce code duplication
- Easy configuration

---

**Q: Why should you never use ObjectManager directly?**

**A**: ObjectManager is Magento's internal dependency container. Direct use causes:
- Hard to test code
- Breaks dependency injection
- Hidden dependencies
- Code analysis tools can't detect dependencies

Exception: Only use in integration tests and certain core framework classes.

Always use constructor injection instead.

---

**Q: What is the difference between Model and ResourceModel?**

**A**:
- **Model** - Business logic, data manipulation, validation
- **ResourceModel** - Database operations (CRUD)

Separation of concerns:
- Model doesn't know about database structure
- ResourceModel handles all database interactions
- Allows changing database without touching business logic

---

### Code Structure Questions

**Q: Explain Model-View-ViewModel (MVVM) in Magento**

**A**: MVVM separates concerns:
- **Model** - Business data and logic
- **View** - Template files (.phtml)
- **ViewModel** - Presentation logic (Magento 2.2+)

ViewModels replace complex Blocks:
```php
class ProductViewModel implements ArgumentInterface
{
    public function getFormattedPrice($product)
    {
        return '$' . number_format($product->getPrice(), 2);
    }
}
```

Benefits: Testable, reusable, cleaner templates.

---

**Q: What is the Service Contract pattern?**

**A**: Service contracts are interfaces that define module APIs:
- **Data interfaces** - Define data structures
- **Service interfaces** - Define operations (Repository, Management)

Benefits:
- Backward compatibility
- API access (REST/SOAP)
- Clear public API
- Implementation can change

Example: `ProductRepositoryInterface` is service contract, `ProductRepository` is implementation.

---

**Q: Explain the Repository pattern in Magento**

**A**: Repositories centralize data access:
```php
$product = $repository->getById($id);      // Load
$repository->save($product);                // Save
$repository->delete($product);              // Delete
$list = $repository->getList($criteria);    // Search
```

Benefits:
- Single source of truth
- Caching in one place
- Business logic separation
- Easy testing with mocks

---

## Best Practices

### Module Development

✅ **DO**:
- Use dependency injection
- Program to interfaces
- Use plugins instead of preferences
- Follow PSR coding standards
- Create service contracts for APIs
- Use repositories for data access
- Write unit and integration tests

❌ **DON'T**:
- Modify core files
- Use ObjectManager directly
- Create god classes (too many responsibilities)
- Use preferences when plugins work
- Hard-code values (use configuration)
- Ignore backward compatibility

### Theme Development

✅ **DO**:
- Extend parent themes
- Use _extend.less for styles
- Override only necessary templates
- Use layout XML when possible
- Escape all output in templates
- Use responsive design
- Optimize images

❌ **DON'T**:
- Copy entire templates when overriding
- Hardcode URLs or text
- Ignore mobile devices
- Skip accessibility
- Inline CSS/JS in templates

### Plugin Development

✅ **DO**:
- Use before/after plugins when possible
- Call $proceed() in around plugins
- Use specific plugin type (before/after/around)
- Set appropriate sortOrder
- Document plugin behavior

❌ **DON'T**:
- Overuse around plugins
- Forget to call $proceed()
- Plugin final methods (won't work)
- Plugin constructors
- Create circular dependencies

---

## Quick Reference

### Module Checklist
- [ ] `registration.php` created
- [ ] `etc/module.xml` created
- [ ] `composer.json` created
- [ ] Module enabled: `php bin/magento module:enable`
- [ ] Setup upgrade: `php bin/magento setup:upgrade`
- [ ] Cache cleared: `php bin/magento cache:flush`

### Theme Checklist
- [ ] `registration.php` created
- [ ] `theme.xml` created with parent
- [ ] `composer.json` created
- [ ] `etc/view.xml` for images (optional)
- [ ] Theme deployed: `php bin/magento setup:static-content:deploy`
- [ ] Theme activated in admin

### Plugin Checklist
- [ ] Plugin class created in `Plugin/` directory
- [ ] Plugin configured in `etc/di.xml`
- [ ] Correct plugin type (before/after/around)
- [ ] `$proceed()` called in around plugin
- [ ] SortOrder set appropriately
- [ ] Code compiled: `php bin/magento setup:di:compile`

---

## Pro Interview Tips

### What Interviewers Look For

1. **Understanding WHY, not just HOW**
   - Don't just list commands, explain purpose
   - Explain advantages of plugins over preferences
   - Discuss performance implications

2. **Real-world Experience**
   - Mention specific scenarios you've solved
   - Discuss challenges and solutions
   - Talk about debugging approaches

3. **Best Practices Knowledge**
   - Know when NOT to use something
   - Understand trade-offs
   - Follow Magento standards

4. **Architecture Understanding**
   - Explain layer separation
   - Discuss design patterns
   - Understand data flow

### Sample Interview Answers

**"Tell me about your Magento 2 experience"**

"I've worked with Magento 2 for [X] years, primarily developing custom modules and themes. I'm comfortable with the module structure - registration.php, module.xml, dependency injection. I use plugins for customization rather than preferences, and I follow service contract patterns for APIs. I've worked with both frontend themes - extending Luma, customizing layouts and templates - and backend development with custom admin grids using UI components."

**"How would you customize product price calculation?"**

"I'd use a plugin on the getPrice() method. Specifically, an after plugin on `\Magento\Catalog\Model\Product::getPrice()` to modify the returned price. I'd configure it in di.xml with appropriate sortOrder, and the plugin would receive the original price and return the modified value. This approach is upgrade-safe and allows other modules to also modify prices."

**"How do you debug a Magento issue?"**

"First, I check exception.log and system.log in var/log/. If needed, I enable developer mode to see errors on screen. For frontend issues, I use template hints to identify which blocks and templates are involved. For logic issues, I use Xdebug with step debugging. I also check the database for data issues and verify cache is cleared. For performance, I use the built-in profiler or New Relic."

---

**Good Luck with Your Interview!** 🎯

**Remember**: 
- Understand concepts, don't just memorize
- Explain trade-offs and alternatives
- Show real-world problem-solving ability
- Demonstrate best practices knowledge

---

**Last Updated**: January 2026  
**Magento Version**: 2.4.x  
**Created for**: Interview Preparation
