# Detailed Entity-Relationship Diagram (ERD)

This diagram represents the complete data schema used in the ElectroMinds application, including all attributes, primary keys (PK), foreign keys (FK), and relationship cardinalities.

```mermaid
erDiagram
    %% USER / CUSTOMER ENTITY
    CUSTOMER {
        string email PK "Unique identifier (e.g. rp0366685@example.com)"
        string password "Hashed or plain for demo"
        string name "Customer Name"
        string phone "Optional contact number"
        date registered_at "Registration Timestamp"
    }

    %% PRODUCT INVENTORY
    PRODUCT {
        string id PK "e.g. TV001"
        string name "Product Name"
        string category "e.g. Televisions, Laptops"
        float price "Unit Price in USD"
        int stock "Current Quantity Available"
        string description "Product Attributes/Details"
        string image_url "Path to product image"
    }

    %% SHOPPING CART (Temporary Storage)
    CART {
        string userId PK "FK to Customer Email"
        float grandTotal "Cached Total Value"
        timestamp last_updated
    }

    CART_ITEM {
        string cartId PK, FK "Refers to CART.userId"
        string productId PK, FK "Refers to PRODUCT.id"
        int quantity "Quantity in Cart"
        float price_at_add "Price snapshot"
    }

    %% ORDER MANAGEMENT
    ORDER {
        string id PK "e.g. ORD1769..."
        string customerEmail FK "Refers to CUSTOMER.email"
        timestamp date "Order Placement Time"
        string status "Enum: Confirmed, Shipped, Delivered, Cancelled, Returned"
        float total "Final Transaction Amount"
        string shippingAddress "Full Delivery Address"
        string paymentMethod "Enum: UPI, Card, COD"
        string returnReason "Nullable: Reason if returned"
    }

    ORDER_ITEM {
        string orderId PK, FK "Refers to ORDER.id"
        string productId PK, FK "Refers to PRODUCT.id"
        int quantity "Units Purchased"
        float unitPrice "Price at time of purchase"
        float subtotal "quantity * unitPrice"
    }

    %% ENGAGEMENT
    FEEDBACK {
        string id PK "System Generated ID"
        string customerEmail FK "Refers to CUSTOMER.email"
        text message "User Review/Comment"
        timestamp created_at
    }

    %% SYSTEM LOGS
    AI_CONVERSATION {
        string sessionId PK
        string userEmail FK
        text history "JSON Blob of Chat History"
        timestamp last_active
    }

    %% RELATIONSHIPS
    
    %% A Customer can have zero or many Orders
    CUSTOMER ||--o{ ORDER : "places"
    
    %% A Customer has exactly one Cart (active)
    CUSTOMER ||--|| CART : "maintains"
    
    %% A Customer writes Feedback
    CUSTOMER ||--o{ FEEDBACK : "submits"

    %% A Cart contains many Items
    CART ||--|{ CART_ITEM : "contains"
    
    %% Cart Items refer to specific Products
    CART_ITEM }|--|| PRODUCT : "references"

    %% An Order contains many Order Items
    ORDER ||--|{ ORDER_ITEM : "includes"
    
    %% Order Items refer to specific Products
    ORDER_ITEM }|--|| PRODUCT : "purchased"

    %% AI Session is linked to a Customer
    CUSTOMER ||--o{ AI_CONVERSATION : "engages in"
```
