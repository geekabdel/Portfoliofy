# MVVM Structure in Magento 2 - Complete Guide

## Table of Contents
1. [What is MVVM?](#what-is-mvvm)
2. [Why MVVM in Magento 2?](#why-mvvm-in-magento-2)
3. [Traditional Approach vs MVVM](#traditional-approach-vs-mvvm)
4. [Model Layer](#model-layer)
5. [View Layer](#view-layer)
6. [ViewModel Layer](#viewmodel-layer)
7. [Complete Implementation Example](#complete-implementation-example)
8. [Best Practices](#best-practices)
9. [Common Use Cases](#common-use-cases)
10. [Interview Questions](#interview-questions)

---

## What is MVVM?

**MVVM** stands for **Model-View-ViewModel** - a design pattern that separates business logic from presentation logic.

### The Three Components

```
┌─────────────────────────────────────────────┐
│                   View                       │
│         (Templates - .phtml files)          │
│   - Display data                            │
│   - User interface                          │
│   - No business logic                       │
└────────────────┬────────────────────────────┘
                 │
                 │ Uses
                 ↓
┌─────────────────────────────────────────────┐
│                ViewModel                     │
│        (Presentation Logic)                 │
│   - Format data for display                 │
│   - Calculate derived values                │
│   - Prepare data for templates              │
└────────────────┬────────────────────────────┘
                 │
                 │ Uses
                 ↓
┌─────────────────────────────────────────────┐
│                  Model                       │
│           (Business Logic)                  │
│   - Data structure                          │
│   - Business rules                          │
│   - Database operations                     │
└─────────────────────────────────────────────┘
```

**Interview Tip**: MVVM separates concerns - Models handle data, ViewModels prepare it for display, Views show it.

---

## Why MVVM in Magento 2?

### Before MVVM (Traditional Approach)

**Problem**: Blocks became bloated with presentation logic

```php
// Heavy Block with mixed concerns
class Product extends Template
{
    private $productRepository;
    private $priceHelper;
    private $imageHelper;
    private $stockRegistry;
    private $catalogHelper;
    private $taxHelper;
    // ... 10 more dependencies
    
    public function __construct(
        Context $context,
        ProductRepositoryInterface $productRepository,
        PriceHelper $priceHelper,
        ImageHelper $imageHelper,
        StockRegistry $stockRegistry,
        CatalogHelper $catalogHelper,
        TaxHelper $taxHelper,
        // ... 10 more parameters
        array $data = []
    ) {
        $this->productRepository = $productRepository;
        $this->priceHelper = $priceHelper;
        // ... assign all dependencies
        parent::__construct($context, $data);
    }
    
    // Complex presentation methods
    public function getFormattedPrice() { /* ... */ }
    public function getDiscountPercentage() { /* ... */ }
    public function getStockStatus() { /* ... */ }
    // ... 20 more methods
}
```

**Issues**:
- ❌ Heavy dependency list
- ❌ Hard to test
- ❌ Mixed concerns (business + presentation)
- ❌ Not reusable
- ❌ Difficult to maintain

### After MVVM (Modern Approach)

**Solution**: Separate presentation logic into ViewModels

```php
// Light Block
class Product extends Template
{
    // Minimal or no dependencies
}

// Dedicated ViewModel
class ProductViewModel implements ArgumentInterface
{
    private $priceHelper;
    private $stockRegistry;
    
    public function __construct(
        PriceHelper $priceHelper,
        StockRegistry $stockRegistry
    ) {
        $this->priceHelper = $priceHelper;
        $this->stockRegistry = $stockRegistry;
    }
    
    public function getFormattedPrice($product)
    {
        return $this->priceHelper->currency($product->getPrice());
    }
    
    public function getStockStatus($product)
    {
        return $this->stockRegistry->getStockStatus($product->getId());
    }
}
```

**Benefits**:
- ✅ Separation of concerns
- ✅ Lightweight blocks
- ✅ Reusable ViewModels
- ✅ Easy to test
- ✅ Cleaner templates

---

## Traditional Approach vs MVVM

### Traditional Approach (Before Magento 2.2)

```
┌─────────────────────────────────────────┐
│            Template (.phtml)             │
│                                          │
│  <?= $block->getFormattedPrice() ?>     │
│  <?= $block->getDiscountPercent() ?>    │
│  <?= $block->getStockMessage() ?>       │
│                                          │
└────────────────┬─────────────────────────┘
                 │
                 │ Calls
                 ↓
┌─────────────────────────────────────────┐
│              Block Class                 │
│                                          │
│  - Presentation logic                   │
│  - Formatting methods                   │
│  - Business logic calls                 │
│  - Heavy dependencies                   │
│  - Hard to reuse                        │
│                                          │
└────────────────┬─────────────────────────┘
                 │
                 │ Uses
                 ↓
┌─────────────────────────────────────────┐
│                Model                     │
│                                          │
│  - Business logic                       │
│  - Data persistence                     │
│                                          │
└─────────────────────────────────────────┘
```

### MVVM Approach (Magento 2.2+)

```
┌─────────────────────────────────────────┐
│            Template (.phtml)             │
│                                          │
│  <?= $viewModel->getFormattedPrice() ?> │
│  <?= $viewModel->getDiscountPercent() ?>│
│  <?= $viewModel->getStockMessage() ?>   │
│                                          │
└────┬──────────────────────────────┬─────┘
     │                              │
     │ Calls                        │ Calls (minimal)
     ↓                              ↓
┌─────────────────────┐    ┌──────────────┐
│      ViewModel      │    │    Block     │
│                     │    │  (Minimal)   │
│ - Presentation      │    │              │
│ - Formatting        │    └──────────────┘
│ - Calculations      │
│ - Easy to test      │
│ - Reusable          │
└──────────┬──────────┘
           │
           │ Uses
           ↓
┌─────────────────────────────────────────┐
│                Model                     │
│                                          │
│  - Business logic                       │
│  - Data persistence                     │
│                                          │
└─────────────────────────────────────────┘
```

---

## Model Layer

### What is the Model?

The **Model** represents your business data and logic. It handles:
- Data structure and validation
- Business rules
- Database operations
- State management

### Model Example

```php
<?php
// app/code/Vendor/Module/Model/Product.php
namespace Vendor\Module\Model;

use Magento\Framework\Model\AbstractModel;

class Product extends AbstractModel
{
    const STATUS_ENABLED = 1;
    const STATUS_DISABLED = 0;
    
    /**
     * Initialize resource model
     */
    protected function _construct()
    {
        $this->_init(\Vendor\Module\Model\ResourceModel\Product::class);
    }
    
    /**
     * Get product name
     */
    public function getName()
    {
        return $this->getData('name');
    }
    
    /**
     * Set product name
     */
    public function setName($name)
    {
        return $this->setData('name', $name);
    }
    
    /**
     * Get product price
     */
    public function getPrice()
    {
        return (float) $this->getData('price');
    }
    
    /**
     * Check if product is enabled
     */
    public function isEnabled()
    {
        return $this->getData('status') == self::STATUS_ENABLED;
    }
    
    /**
     * Calculate discount price (Business Logic)
     */
    public function getDiscountPrice($discountPercent)
    {
        $price = $this->getPrice();
        return $price - ($price * $discountPercent / 100);
    }
    
    /**
     * Validate before save (Business Rule)
     */
    public function beforeSave()
    {
        if (empty($this->getName())) {
            throw new \Exception('Product name is required');
        }
        
        if ($this->getPrice() < 0) {
            throw new \Exception('Price cannot be negative');
        }
        
        return parent::beforeSave();
    }
}
```

**Model Responsibilities**:
- ✅ Define data structure
- ✅ Implement business rules
- ✅ Validate data
- ✅ Handle persistence
- ❌ NO formatting for display
- ❌ NO UI-specific logic

---

## View Layer

### What is the View?

The **View** is the template file (.phtml) that displays data to users. It handles:
- HTML structure
- Displaying data
- User interface elements
- Minimal PHP logic (loops, conditionals)

### View Example (Template)

```php
<?php
/**
 * Product view template
 * 
 * @var $block \Magento\Framework\View\Element\Template
 * @var $viewModel \Vendor\Module\ViewModel\ProductViewModel
 */

// Get ViewModel from block
$viewModel = $block->getData('view_model');
$product = $block->getProduct();
?>

<div class="product-view">
    <!-- Product Name -->
    <h1 class="product-name">
        <?= $escaper->escapeHtml($viewModel->getProductName($product)) ?>
    </h1>
    
    <!-- Product Price -->
    <div class="product-price">
        <span class="price">
            <?= /* @noEscape */ $viewModel->getFormattedPrice($product) ?>
        </span>
        
        <?php if ($viewModel->hasDiscount($product)): ?>
            <span class="old-price">
                <?= /* @noEscape */ $viewModel->getFormattedOriginalPrice($product) ?>
            </span>
            <span class="discount-badge">
                <?= $escaper->escapeHtml($viewModel->getDiscountPercentage($product)) ?>
            </span>
        <?php endif; ?>
    </div>
    
    <!-- Stock Status -->
    <div class="stock-status <?= $viewModel->getStockStatusClass($product) ?>">
        <?= $escaper->escapeHtml($viewModel->getStockStatusMessage($product)) ?>
    </div>
    
    <!-- Product Description -->
    <?php if ($viewModel->hasDescription($product)): ?>
        <div class="product-description">
            <?= /* @noEscape */ $viewModel->getFormattedDescription($product) ?>
        </div>
    <?php endif; ?>
    
    <!-- Add to Cart Button -->
    <?php if ($viewModel->canAddToCart($product)): ?>
        <button class="btn-cart" 
                data-product-id="<?= $escaper->escapeHtmlAttr($product->getId()) ?>">
            <?= $escaper->escapeHtml($viewModel->getAddToCartLabel()) ?>
        </button>
    <?php endif; ?>
</div>
```

**View Responsibilities**:
- ✅ Display data
- ✅ HTML structure
- ✅ Simple conditionals
- ✅ Loops for collections
- ❌ NO complex calculations
- ❌ NO business logic
- ❌ NO database queries
- ❌ NO heavy processing

**Interview Tip**: Templates should be "dumb" - they only display data, all logic is in ViewModel.

---

## ViewModel Layer

### What is ViewModel?

**ViewModel** contains presentation logic - preparing data for display. It handles:
- Formatting data (prices, dates, etc.)
- Calculating derived values
- Preparing data structures
- UI-specific logic

**Key Feature**: ViewModels implement `ArgumentInterface` (marker interface).

### ViewModel Example

```php
<?php
// app/code/Vendor/Module/ViewModel/ProductViewModel.php
namespace Vendor\Module\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\Pricing\Helper\Data as PriceHelper;
use Magento\CatalogInventory\Api\StockRegistryInterface;
use Magento\Framework\Stdlib\DateTime\TimezoneInterface;

class ProductViewModel implements ArgumentInterface
{
    private $priceHelper;
    private $stockRegistry;
    private $timezone;
    
    /**
     * Constructor
     */
    public function __construct(
        PriceHelper $priceHelper,
        StockRegistryInterface $stockRegistry,
        TimezoneInterface $timezone
    ) {
        $this->priceHelper = $priceHelper;
        $this->stockRegistry = $stockRegistry;
        $this->timezone = $timezone;
    }
    
    /**
     * Get formatted product name
     */
    public function getProductName($product)
    {
        return strtoupper($product->getName());
    }
    
    /**
     * Get formatted price with currency
     */
    public function getFormattedPrice($product)
    {
        return $this->priceHelper->currency($product->getPrice(), true, false);
    }
    
    /**
     * Get formatted original price (before discount)
     */
    public function getFormattedOriginalPrice($product)
    {
        $originalPrice = $product->getOriginalPrice() ?: $product->getPrice();
        return $this->priceHelper->currency($originalPrice, true, false);
    }
    
    /**
     * Check if product has discount
     */
    public function hasDiscount($product)
    {
        $originalPrice = $product->getOriginalPrice();
        $currentPrice = $product->getPrice();
        
        return $originalPrice && $currentPrice < $originalPrice;
    }
    
    /**
     * Calculate and format discount percentage
     */
    public function getDiscountPercentage($product)
    {
        if (!$this->hasDiscount($product)) {
            return '';
        }
        
        $originalPrice = $product->getOriginalPrice();
        $currentPrice = $product->getPrice();
        $discount = (($originalPrice - $currentPrice) / $originalPrice) * 100;
        
        return sprintf('-%d%%', round($discount));
    }
    
    /**
     * Get stock status message
     */
    public function getStockStatusMessage($product)
    {
        $stockItem = $this->stockRegistry->getStockItem($product->getId());
        
        if (!$stockItem->getIsInStock()) {
            return __('Out of Stock');
        }
        
        $qty = $stockItem->getQty();
        
        if ($qty > 10) {
            return __('In Stock');
        } elseif ($qty > 0) {
            return __('Only %1 left!', $qty);
        } else {
            return __('Out of Stock');
        }
    }
    
    /**
     * Get CSS class for stock status
     */
    public function getStockStatusClass($product)
    {
        $stockItem = $this->stockRegistry->getStockItem($product->getId());
        
        if (!$stockItem->getIsInStock()) {
            return 'out-of-stock';
        }
        
        $qty = $stockItem->getQty();
        
        if ($qty > 10) {
            return 'in-stock';
        } else {
            return 'low-stock';
        }
    }
    
    /**
     * Check if product has description
     */
    public function hasDescription($product)
    {
        return !empty($product->getDescription());
    }
    
    /**
     * Get formatted description
     */
    public function getFormattedDescription($product)
    {
        $description = $product->getDescription();
        
        // Truncate if too long
        if (strlen($description) > 500) {
            $description = substr($description, 0, 497) . '...';
        }
        
        return $description;
    }
    
    /**
     * Check if product can be added to cart
     */
    public function canAddToCart($product)
    {
        $stockItem = $this->stockRegistry->getStockItem($product->getId());
        return $stockItem->getIsInStock() && $stockItem->getQty() > 0;
    }
    
    /**
     * Get add to cart button label
     */
    public function getAddToCartLabel()
    {
        return __('Add to Cart');
    }
    
    /**
     * Format date for display
     */
    public function getFormattedDate($date)
    {
        return $this->timezone->formatDate($date, \IntlDateFormatter::MEDIUM);
    }
}
```

**ViewModel Responsibilities**:
- ✅ Format data for display
- ✅ Calculate derived values
- ✅ Prepare data structures
- ✅ UI-specific logic
- ✅ Call helper/service methods
- ❌ NO direct database operations
- ❌ NO changing business state
- ❌ NO HTML generation (return data, not HTML)

---

## Complete Implementation Example

### Step 1: Define the Model

```php
<?php
// app/code/Vendor/Blog/Model/Post.php
namespace Vendor\Blog\Model;

use Magento\Framework\Model\AbstractModel;

class Post extends AbstractModel
{
    const STATUS_ENABLED = 1;
    const STATUS_DISABLED = 0;
    
    protected function _construct()
    {
        $this->_init(\Vendor\Blog\Model\ResourceModel\Post::class);
    }
    
    public function getTitle()
    {
        return $this->getData('title');
    }
    
    public function getContent()
    {
        return $this->getData('content');
    }
    
    public function getAuthor()
    {
        return $this->getData('author');
    }
    
    public function getCreatedAt()
    {
        return $this->getData('created_at');
    }
    
    public function getViewCount()
    {
        return (int) $this->getData('view_count');
    }
    
    public function isPublished()
    {
        return $this->getData('status') == self::STATUS_ENABLED;
    }
}
```

### Step 2: Create the ViewModel

```php
<?php
// app/code/Vendor/Blog/ViewModel/PostViewModel.php
namespace Vendor\Blog\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\Stdlib\DateTime\TimezoneInterface;

class PostViewModel implements ArgumentInterface
{
    private $timezone;
    
    public function __construct(TimezoneInterface $timezone)
    {
        $this->timezone = $timezone;
    }
    
    /**
     * Get formatted title
     */
    public function getFormattedTitle($post)
    {
        return ucwords(strtolower($post->getTitle()));
    }
    
    /**
     * Get post excerpt (first 200 characters)
     */
    public function getExcerpt($post, $length = 200)
    {
        $content = strip_tags($post->getContent());
        
        if (strlen($content) <= $length) {
            return $content;
        }
        
        return substr($content, 0, $length) . '...';
    }
    
    /**
     * Get formatted date (e.g., "January 15, 2024")
     */
    public function getFormattedDate($post)
    {
        return $this->timezone->formatDate(
            $post->getCreatedAt(),
            \IntlDateFormatter::LONG
        );
    }
    
    /**
     * Get relative date (e.g., "2 days ago")
     */
    public function getRelativeDate($post)
    {
        $now = new \DateTime();
        $createdAt = new \DateTime($post->getCreatedAt());
        $diff = $now->diff($createdAt);
        
        if ($diff->d == 0) {
            return __('Today');
        } elseif ($diff->d == 1) {
            return __('Yesterday');
        } elseif ($diff->d < 7) {
            return __('%1 days ago', $diff->d);
        } else {
            return $this->getFormattedDate($post);
        }
    }
    
    /**
     * Get reading time estimate
     */
    public function getReadingTime($post)
    {
        $wordCount = str_word_count(strip_tags($post->getContent()));
        $minutes = ceil($wordCount / 200); // Average reading speed
        
        return __('%1 min read', $minutes);
    }
    
    /**
     * Check if post is popular
     */
    public function isPopular($post)
    {
        return $post->getViewCount() > 1000;
    }
    
    /**
     * Get formatted view count
     */
    public function getFormattedViewCount($post)
    {
        $count = $post->getViewCount();
        
        if ($count >= 1000000) {
            return number_format($count / 1000000, 1) . 'M';
        } elseif ($count >= 1000) {
            return number_format($count / 1000, 1) . 'K';
        }
        
        return number_format($count);
    }
    
    /**
     * Get author badge color based on name
     */
    public function getAuthorBadgeClass($post)
    {
        $colors = ['primary', 'success', 'info', 'warning'];
        $index = ord($post->getAuthor()[0]) % count($colors);
        
        return 'badge-' . $colors[$index];
    }
}
```

### Step 3: Create the Block

```php
<?php
// app/code/Vendor/Blog/Block/Post/View.php
namespace Vendor\Blog\Block\Post;

use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Vendor\Blog\Model\PostFactory;

class View extends Template
{
    private $postFactory;
    private $post;
    
    public function __construct(
        Context $context,
        PostFactory $postFactory,
        array $data = []
    ) {
        $this->postFactory = $postFactory;
        parent::__construct($context, $data);
    }
    
    /**
     * Get current post
     */
    public function getPost()
    {
        if (!$this->post) {
            $postId = $this->getRequest()->getParam('id');
            $this->post = $this->postFactory->create()->load($postId);
        }
        
        return $this->post;
    }
}
```

### Step 4: Configure ViewModel in Layout

```xml
<?xml version="1.0"?>
<!-- app/code/Vendor/Blog/view/frontend/layout/blog_post_view.xml -->
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceContainer name="content">
            <block class="Vendor\Blog\Block\Post\View" 
                   name="blog.post.view" 
                   template="Vendor_Blog::post/view.phtml">
                <arguments>
                    <argument name="view_model" xsi:type="object">Vendor\Blog\ViewModel\PostViewModel</argument>
                </arguments>
            </block>
        </referenceContainer>
    </body>
</page>
```

**Interview Tip**: ViewModel is passed to block via layout XML as an argument.

### Step 5: Use ViewModel in Template

```php
<?php
/**
 * Blog post view template
 * 
 * @var $block \Vendor\Blog\Block\Post\View
 * @var $viewModel \Vendor\Blog\ViewModel\PostViewModel
 * @var $escaper \Magento\Framework\Escaper
 */

$viewModel = $block->getData('view_model');
$post = $block->getPost();
?>

<article class="blog-post">
    <!-- Post Header -->
    <header class="post-header">
        <h1 class="post-title">
            <?= $escaper->escapeHtml($viewModel->getFormattedTitle($post)) ?>
        </h1>
        
        <div class="post-meta">
            <!-- Author -->
            <span class="author <?= $escaper->escapeHtmlAttr($viewModel->getAuthorBadgeClass($post)) ?>">
                <?= $escaper->escapeHtml($post->getAuthor()) ?>
            </span>
            
            <!-- Date -->
            <time class="date" datetime="<?= $escaper->escapeHtmlAttr($post->getCreatedAt()) ?>">
                <?= $escaper->escapeHtml($viewModel->getRelativeDate($post)) ?>
            </time>
            
            <!-- Reading Time -->
            <span class="reading-time">
                <?= $escaper->escapeHtml($viewModel->getReadingTime($post)) ?>
            </span>
            
            <!-- View Count -->
            <span class="view-count">
                <?= $escaper->escapeHtml($viewModel->getFormattedViewCount($post)) ?> views
            </span>
            
            <!-- Popular Badge -->
            <?php if ($viewModel->isPopular($post)): ?>
                <span class="badge badge-popular">
                    <?= $escaper->escapeHtml(__('Popular')) ?>
                </span>
            <?php endif; ?>
        </div>
    </header>
    
    <!-- Post Content -->
    <div class="post-content">
        <?= /* @noEscape */ $post->getContent() ?>
    </div>
</article>
```

---

## Best Practices

### ✅ DO

1. **Keep ViewModels Stateless**
```php
// ✅ GOOD - Pass data as parameters
public function getFormattedPrice($product)
{
    return $this->priceHelper->currency($product->getPrice());
}
```

2. **Use Dependency Injection**
```php
// ✅ GOOD - Inject dependencies
public function __construct(
    PriceHelper $priceHelper,
    TimezoneInterface $timezone
) {
    $this->priceHelper = $priceHelper;
    $this->timezone = $timezone;
}
```

3. **Return Data, Not HTML**
```php
// ✅ GOOD - Return data
public function getStockStatus($product)
{
    return $product->isInStock() ? 'In Stock' : 'Out of Stock';
}

// ❌ BAD - Return HTML
public function getStockStatus($product)
{
    return '<span class="stock">' . $status . '</span>';
}
```

4. **Single Responsibility**
```php
// ✅ GOOD - Focused ViewModel
class ProductPriceViewModel
{
    public function getFormattedPrice($product) { }
    public function getDiscountPercentage($product) { }
    public function hasDiscount($product) { }
}
```

5. **Use Type Hints**
```php
// ✅ GOOD - Type hints
public function getFormattedPrice(ProductInterface $product): string
{
    return $this->priceHelper->currency($product->getPrice());
}
```

### ❌ DON'T

1. **Don't Store State**
```php
// ❌ BAD - Storing state
class ProductViewModel
{
    private $currentProduct; // Don't do this
    
    public function setProduct($product)
    {
        $this->currentProduct = $product;
    }
}
```

2. **Don't Access Database Directly**
```php
// ❌ BAD - Direct database access
public function getProducts()
{
    return $this->connection->fetchAll('SELECT * FROM products');
}

// ✅ GOOD - Use repositories
public function getProducts()
{
    return $this->productRepository->getList($criteria);
}
```

3. **Don't Include Business Logic**
```php
// ❌ BAD - Business logic in ViewModel
public function createProduct($data)
{
    $product = $this->productFactory->create();
    $product->setData($data);
    $product->save(); // Business operation
}

// ✅ GOOD - Only presentation logic
public function getFormattedProductName($product)
{
    return ucwords($product->getName()); // Formatting only
}
```

4. **Don't Make ViewModels Depend on Blocks**
```php
// ❌ BAD - ViewModel depends on Block
public function __construct(Template $block)
{
    $this->block = $block;
}

// ✅ GOOD - ViewModel is independent
public function __construct(PriceHelper $priceHelper)
{
    $this->priceHelper = $priceHelper;
}
```

---

## Common Use Cases

### 1. Price Formatting

```php
class PriceViewModel implements ArgumentInterface
{
    private $priceHelper;
    
    public function __construct(PriceHelper $priceHelper)
    {
        $this->priceHelper = $priceHelper;
    }
    
    public function getFormattedPrice($product)
    {
        return $this->priceHelper->currency($product->getPrice(), true, false);
    }
    
    public function getFormattedPriceRange($minPrice, $maxPrice)
    {
        return sprintf(
            '%s - %s',
            $this->priceHelper->currency($minPrice, true, false),
            $this->priceHelper->currency($maxPrice, true, false)
        );
    }
}
```

### 2. Date/Time Formatting

```php
class DateViewModel implements ArgumentInterface
{
    private $timezone;
    
    public function __construct(TimezoneInterface $timezone)
    {
        $this->timezone = $timezone;
    }
    
    public function getFormattedDate($date)
    {
        return $this->timezone->formatDate($date, \IntlDateFormatter::LONG);
    }
    
    public function getRelativeTime($date)
    {
        $now = new \DateTime();
        $past = new \DateTime($date);
        $diff = $now->diff($past);
        
        if ($diff->d == 0) return __('Today');
        if ($diff->d == 1) return __('Yesterday');
        if ($diff->d < 7) return __('%1 days ago', $diff->d);
        
        return $this->getFormattedDate($date);
    }
}
```

### 3. Image URL Generation

```php
class ImageViewModel implements ArgumentInterface
{
    private $imageHelper;
    
    public function __construct(ImageHelper $imageHelper)
    {
        $this->imageHelper = $imageHelper;
    }
    
    public function getProductImageUrl($product, $imageType = 'product_page_image_large')
    {
        return $this->imageHelper->init($product, $imageType)->getUrl();
    }
    
    public function getResizedImageUrl($product, $width, $height)
    {
        return $this->imageHelper
            ->init($product, 'product_page_image_large')
            ->resize($width, $height)
            ->getUrl();
    }
}
```

### 4. URL Generation

```php
class UrlViewModel implements ArgumentInterface
{
    private $urlBuilder;
    
    public function __construct(UrlInterface $urlBuilder)
    {
        $this->urlBuilder = $urlBuilder;
    }
    
    public function getProductUrl($product)
    {
        return $this->urlBuilder->getUrl('catalog/product/view', [
            'id' => $product->getId()
        ]);
    }
    
    public function getAddToCartUrl($product)
    {
        return $this->urlBuilder->getUrl('checkout/cart/add', [
            'product' => $product->getId()
        ]);
    }
}
```

### 5. Collection Data Preparation

```php
class CategoryViewModel implements ArgumentInterface
{
    private $productCollectionFactory;
    
    public function __construct(CollectionFactory $productCollectionFactory)
    {
        $this->productCollectionFactory = $productCollectionFactory;
    }
    
    public function getProductsData($category)
    {
        $collection = $this->productCollectionFactory->create();
        $collection->addCategoryFilter($category)
                   ->addAttributeToSelect('*')
                   ->setPageSize(12);
        
        $products = [];
        foreach ($collection as $product) {
            $products[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'price' => $product->getPrice(),
                'image' => $product->getImage()
            ];
        }
        
        return $products;
    }
}
```

---

## Interview Questions

### Q1: What is MVVM and why does Magento 2 use it?

**Answer**: 
MVVM (Model-View-ViewModel) is a design pattern that separates business logic from presentation logic:
- **Model**: Business data and rules
- **View**: Template files that display data
- **ViewModel**: Presentation logic and data formatting

Magento 2 introduced ViewModels in version 2.2 to:
- Reduce bloated Blocks
- Improve code reusability
- Make code more testable
- Better separation of concerns

**Interview Tip**: Mention this was introduced in Magento 2.2+

---

### Q2: How do you create and use a ViewModel?

**Answer**:
1. Create ViewModel class implementing `ArgumentInterface`
2. Add presentation logic methods
3. Configure in layout XML as block argument
4. Use in template via `$block->getData('view_model')`

Example:
```xml
<block name="product.view" template="product.phtml">
    <arguments>
        <argument name="view_model" xsi:type="object">Vendor\Module\ViewModel\ProductViewModel</argument>
    </arguments>
</block>
```

```php
// In template
$viewModel = $block->getData('view_model');
echo $viewModel->getFormattedPrice($product);
```

---

### Q3: What's the difference between Block and ViewModel?

**Answer**:

| Aspect | Block | ViewModel |
|--------|-------|-----------|
| Purpose | Connects template to data | Presentation logic only |
| Inheritance | Extends Template/AbstractBlock | Implements ArgumentInterface |
| State | Can maintain state | Stateless (best practice) |
| Dependencies | Can have many | Should be minimal |
| When to use | Page structure, data loading | Formatting, calculations |

**Key Difference**: Blocks manage page structure and data loading, ViewModels handle data presentation.

---

### Q4: Can you have multiple ViewModels in one template?

**Answer**: 
Yes! You can inject multiple ViewModels:

```xml
<block name="product.view" template="product.phtml">
    <arguments>
        <argument name="price_view_model" xsi:type="object">Vendor\Module\ViewModel\PriceViewModel</argument>
        <argument name="image_view_model" xsi:type="object">Vendor\Module\ViewModel\ImageViewModel</argument>
        <argument name="date_view_model" xsi:type="object">Vendor\Module\ViewModel\DateViewModel</argument>
    </arguments>
</block>
```

```php
$priceViewModel = $block->getData('price_view_model');
$imageViewModel = $block->getData('image_view_model');
```

This follows Single Responsibility Principle - each ViewModel has one focused purpose.

---

### Q5: Should ViewModels access the database?

**Answer**:
**No, not directly.** ViewModels should:
- ✅ Use repositories for data access
- ✅ Use helper classes
- ✅ Call service methods
- ❌ NOT use direct database queries
- ❌ NOT use resource models directly

```php
// ❌ BAD
public function getProducts()
{
    return $this->connection->fetchAll('SELECT...');
}

// ✅ GOOD
public function getProducts()
{
    return $this->productRepository->getList($criteria);
}
```

ViewModels should focus on presentation, not data retrieval.

---

### Q6: What are best practices for ViewModels?

**Answer**:
1. **Implement ArgumentInterface** - Required marker interface
2. **Keep them stateless** - Don't store data in properties
3. **Pass data as parameters** - Don't use setters
4. **Return data, not HTML** - Let template handle markup
5. **Single responsibility** - One ViewModel per concern
6. **Use dependency injection** - For helpers and services
7. **Type hint everything** - For better code quality
8. **Make them reusable** - Not tied to specific templates

---

### Q7: When should you use Block vs ViewModel?

**Answer**:
**Use Block when**:
- Managing page structure
- Loading data from database
- Handling child blocks
- Need to maintain state

**Use ViewModel when**:
- Formatting data for display
- Calculating derived values
- Presentation logic
- UI-specific calculations

**Best Practice**: Use lightweight Blocks for structure, ViewModels for logic.

---

## Summary

### MVVM Flow Diagram

```
User Request
     ↓
Controller (loads data)
     ↓
Block (page structure, loads Model data)
     ↓
     ├─→ Model (business data)
     │
     ├─→ ViewModel (formats data)
     │        ↓
     └─────→ Template (displays formatted data)
                ↓
         HTML Response to User
```

### Key Takeaways

1. **Model** = Business logic and data
2. **View** = Templates that display data
3. **ViewModel** = Presentation logic and formatting
4. ViewModels must implement `ArgumentInterface`
5. Inject ViewModels via layout XML
6. Keep ViewModels stateless and focused
7. Return data, not HTML
8. Use for formatting, calculations, UI logic
9. Don't access database directly
10. Introduced in Magento 2.2+

---

**Interview Success Tips**:
- Explain WHY MVVM is better than old approach
- Give real-world examples
- Show understanding of separation of concerns
- Mention it's Magento 2.2+ feature
- Emphasize testability and reusability

**Good luck with your interview!** 🎯

---

**Last Updated**: January 2026  
**Magento Version**: 2.4.x (MVVM since 2.2)
