import "../css/Documentation.css";


const ApiEndpoint = ({
  method,
  path,
  title,
  description,
  auth = true,
  roles,
  request,
  success,
  errors = [],
}) => {
  return (
    <article className="api-endpoint">
      <div className="api-endpoint-header">
        <span className={`api-method ${method.toLowerCase()}`}>
          {method}
        </span>

        <code className="api-path">{path}</code>
      </div>

      <h3>{title}</h3>

      <p className="api-description">{description}</p>

      <div className="api-meta">
        <span>
          <strong>Authentication:</strong>{" "}
          {auth ? "Required" : "Not required"}
        </span>

        {roles && (
          <span>
            <strong>Roles:</strong> {roles}
          </span>
        )}
      </div>

      {request && (
        <div className="api-block">
          <h4>Request Body</h4>

          <pre>
            <code>{request}</code>
          </pre>
        </div>
      )}

      <div className="api-block">
        <h4 className="success-title">
          Success Response
        </h4>

        <pre>
          <code>{success}</code>
        </pre>
      </div>

      {errors.length > 0 && (
        <div className="api-errors">
          <h4 className="error-title">
            Error Responses
          </h4>

          {errors.map((error, index) => (
            <div className="api-error" key={index}>
              <div className="error-status">
                {error.status}
              </div>

              <div className="error-content">
                <strong>{error.title}</strong>

                <pre>
                  <code>{error.body}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default function Documentation() {
  return (
    <div className="documentation-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="documentation-header">

        <div>
          <p className="documentation-label">
            TECHNICAL DOCUMENTATION
          </p>

          <h1>ERP & CRM Management System</h1>

          <p className="documentation-subtitle">
            Complete technical documentation covering the
            architecture, authentication, business workflows,
            database design, REST APIs, deployment and setup.
          </p>
        </div>

        <div className="documentation-actions">
          <a
            href="https://erp-crm223.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Live Application →
          </a>
        </div>

      </header>


      <main className="documentation-content">

        {/* =====================================================
            PROJECT OVERVIEW
        ===================================================== */}

        <section className="doc-section">

          <h2>1. Project Overview</h2>

          <p>
            ERP & CRM Management System is a full-stack business
            management application for managing customers,
            products, warehouses, inventory, stock movements and
            sales challans.
          </p>

          <p>
            The backend is built using Node.js and Express.js,
            with Prisma ORM connected to PostgreSQL. The frontend
            is built using React and Vite.
          </p>

        </section>


        {/* =====================================================
            TECHNOLOGY STACK
        ===================================================== */}

        <section className="doc-section">

          <h2>2. Technology Stack</h2>

          <div className="tech-table">

            <div>
              <span>Frontend</span>
              <strong>React + Vite</strong>
            </div>

            <div>
              <span>Backend</span>
              <strong>Node.js + Express.js</strong>
            </div>

            <div>
              <span>ORM</span>
              <strong>Prisma</strong>
            </div>

            <div>
              <span>Database</span>
              <strong>PostgreSQL</strong>
            </div>

            <div>
              <span>Authentication</span>
              <strong>JWT</strong>
            </div>

            <div>
              <span>Containerization</span>
              <strong>Docker</strong>
            </div>

            <div>
              <span>Frontend Hosting</span>
              <strong>Netlify</strong>
            </div>

            <div>
              <span>Backend Hosting</span>
              <strong>Render</strong>
            </div>

            <div>
              <span>Database Hosting</span>
              <strong>Supabase</strong>
            </div>

          </div>

        </section>


        {/* =====================================================
            ARCHITECTURE
        ===================================================== */}

        <section className="doc-section">

          <h2>3. System Architecture</h2>

          <div className="architecture">

            <div className="architecture-box">
              <small>CLIENT</small>
              <strong>React + Vite</strong>
              <span>Hosted on Netlify</span>
            </div>

            <div className="architecture-arrow">
              →
            </div>

            <div className="architecture-box">
              <small>API SERVER</small>
              <strong>Node.js + Express</strong>
              <span>Docker + Render</span>
            </div>

            <div className="architecture-arrow">
              →
            </div>

            <div className="architecture-box">
              <small>DATABASE</small>
              <strong>PostgreSQL</strong>
              <span>Supabase</span>
            </div>

          </div>

        </section>


        {/* =====================================================
            AUTHENTICATION
        ===================================================== */}

        <section className="doc-section">

          <h2>4. Authentication & Authorization</h2>

          <p>
            The application uses JWT-based authentication.
            Protected backend routes validate the authenticated
            user before allowing access.
          </p>

          <div className="flow">

            <div>Login</div>
            <span>→</span>

            <div>Validate Credentials</div>
            <span>→</span>

            <div>Generate JWT</div>
            <span>→</span>

            <div>Authenticated Request</div>
            <span>→</span>

            <div>Role Check</div>

          </div>

          <h3>Supported Roles</h3>

          <div className="roles">

            <div className="role-card">
              <h3>ADMIN</h3>
              <p>
                Administrative operations and system management.
              </p>
            </div>

            <div className="role-card">
              <h3>SALES</h3>
              <p>
                Customer and sales/challan operations.
              </p>
            </div>

            <div className="role-card">
              <h3>WAREHOUSE</h3>
              <p>
                Product and inventory operations.
              </p>
            </div>

          </div>

        </section>


        {/* =====================================================
            API DOCUMENTATION
        ===================================================== */}

        <section className="doc-section api-documentation">

          <div className="api-documentation-heading">

            <div>

              <p className="documentation-label">
                REST API
              </p>

              <h2>5. API Documentation</h2>

              <p>
                The following APIs represent the core backend
                functionality of the ERP & CRM system.
              </p>

            </div>

            <div className="api-base-url">

              <span>Production Backend</span>

              <code>
                https://erp-crm-backend-g1p7.onrender.com
              </code>

            </div>

          </div>


          {/* =================================================
              AUTH
          ================================================= */}

          <div className="api-category">

            <div className="api-category-heading">

              <span className="category-number">
                01
              </span>

              <div>
                <h2>Authentication</h2>

                <p>
                  Authentication and user session APIs.
                </p>
              </div>

            </div>


            <ApiEndpoint
              method="POST"
              path="/api/auth/login"
              title="Login"
              description="Authenticates a user using email and password."
              auth={false}
              request={`{
  "email": "admin@example.com",
  "password": "your-password"
}`}
              success={`{
  "success": true,
  "message": "Login successful"
}`}
              errors={[
                {
                  status: "400",
                  title: "Invalid request",
                  body: `{
  "success": false,
  "message": "Invalid request"
}`,
                },
                {
                  status: "401",
                  title: "Invalid credentials",
                  body: `{
  "success": false,
  "message": "Invalid credentials"
}`,
                },
              ]}
            />

          </div>


          {/* =================================================
              CUSTOMERS
          ================================================= */}

          <div className="api-category">

            <div className="api-category-heading">

              <span className="category-number">
                02
              </span>

              <div>
                <h2>Customers</h2>

                <p>
                  Customer management and CRM operations.
                </p>
              </div>

            </div>


            <ApiEndpoint
              method="GET"
              path="/api/customers"
              title="Get All Customers"
              description="Returns the customers available to the authenticated user."
              roles="ADMIN, SALES"
              success={`{
  "success": true,
  "customers": []
}`}
              errors={[
                {
                  status: "401",
                  title: "Unauthorized",
                  body: `{
  "success": false,
  "message": "Unauthorized"
}`,
                },
              ]}
            />


            <ApiEndpoint
              method="GET"
              path="/api/customers/:id"
              title="Get Customer"
              description="Returns a single customer by ID."
              roles="ADMIN, SALES"
              success={`{
  "success": true,
  "customer": {}
}`}
              errors={[
                {
                  status: "404",
                  title: "Customer not found",
                  body: `{
  "success": false,
  "message": "Customer not found"
}`,
                },
              ]}
            />


            <ApiEndpoint
              method="POST"
              path="/api/customers"
              title="Create Customer"
              description="Creates a new customer."
              roles="ADMIN, SALES"
              request={`{
  "name": "ABC Traders",
  "mobile": "9876543210",
  "email": "abc@example.com",
  "businessName": "ABC Traders",
  "gstNumber": "GST123",
  "customerType": "WHOLESALE",
  "address": "Delhi"
}`}
              success={`{
  "success": true,
  "customer": {}
}`}
              errors={[
                {
                  status: "400",
                  title: "Validation error",
                  body: `{
  "success": false,
  "message": "Validation error"
}`,
                },
              ]}
            />


            <ApiEndpoint
              method="PUT"
              path="/api/customers/:id"
              title="Update Customer"
              description="Updates an existing customer."
              roles="ADMIN, SALES"
              request={`{
  "name": "ABC Traders Updated",
  "mobile": "9876543210",
  "email": "updated@example.com"
}`}
              success={`{
  "success": true,
  "customer": {}
}`}
              errors={[
                {
                  status: "404",
                  title: "Customer not found",
                  body: `{
  "success": false,
  "message": "Customer not found"
}`,
                },
              ]}
            />


            <ApiEndpoint
              method="DELETE"
              path="/api/customers/:id"
              title="Delete Customer"
              description="Deletes a customer."
              roles="ADMIN"
              success={`{
  "success": true,
  "message": "Customer deleted successfully"
}`}
              errors={[
                {
                  status: "404",
                  title: "Customer not found",
                  body: `{
  "success": false,
  "message": "Customer not found"
}`,
                },
              ]}
            />

          </div>


          {/* =================================================
              CUSTOMER FOLLOWUPS
          ================================================= */}

          <div className="api-category">

            <div className="api-category-heading">

              <span className="category-number">
                03
              </span>

              <div>
                <h2>Customer Follow-ups</h2>

                <p>
                  Manage customer follow-up activities.
                </p>
              </div>

            </div>


            <ApiEndpoint
              method="POST"
              path="/api/customers/:id/followups"
              title="Create Follow-up"
              description="Creates a follow-up note for a customer."
              roles="ADMIN, SALES"
              request={`{
  "note": "Call customer regarding new order",
  "followUpDate": "2026-08-15"
}`}
              success={`{
  "success": true,
  "followUp": {}
}`}
              errors={[
                {
                  status: "404",
                  title: "Customer not found",
                  body: `{
  "success": false,
  "message": "Customer not found"
}`,
                },
              ]}
            />


            <ApiEndpoint
              method="GET"
              path="/api/customers/:id/followups"
              title="Get Customer Follow-ups"
              description="Returns follow-up records for a customer."
              roles="ADMIN, SALES"
              success={`{
  "success": true,
  "followups": []
}`}
              errors={[
                {
                  status: "404",
                  title: "Customer not found",
                  body: `{
  "success": false,
  "message": "Customer not found"
}`,
                },
              ]}
            />

          </div>


          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="api-category">

            <div className="api-category-heading">

              <span className="category-number">
                04
              </span>

              <div>
                <h2>Products</h2>

                <p>
                  Product, SKU, category and warehouse management.
                </p>
              </div>

            </div>


            <ApiEndpoint
              method="GET"
              path="/api/products"
              title="Get Products"
              description="Returns all products."
              roles="ADMIN, SALES, WAREHOUSE"
              success={`{
  "success": true,
  "products": []
}`}
              errors={[
                {
                  status: "500",
                  title: "Internal server error",
                  body: `{
  "success": false,
  "message": "Internal server error"
}`,
                },
              ]}
            />


            <ApiEndpoint
              method="GET"
              path="/api/products/:id"
              title="Get Product"
              description="Returns a product by ID."
              roles="ADMIN, SALES, WAREHOUSE"
              success={`{
  "success": true,
  "product": {}
}`}
              errors={[
                {
                  status: "404",
                  title: "Product not found",
                  body: `{
  "success": false,
  "message": "Product not found"
}`,
                },
              ]}
            />


            <ApiEndpoint
              method="POST"
              path="/api/products"
              title="Create Product"
              description="Creates a new product."
              roles="ADMIN, WAREHOUSE"
              request={`{
  "name": "Product Name",
  "sku": "SKU-001",
  "categoryId": 1,
  "unitPrice": 500,
  "minimumStock": 10,
  "warehouseId": 1
}`}
              success={`{
  "success": true,
  "product": {}
}`}
              errors={[
                {
                  status: "400",
                  title: "Validation error",
                  body: `{
  "success": false,
  "message": "Validation error"
}`,
                },
              ]}
            />


            <ApiEndpoint
              method="PUT"
              path="/api/products/:id"
              title="Update Product"
              description="Updates an existing product."
              roles="ADMIN, WAREHOUSE"
              request={`{
  "name": "Updated Product",
  "unitPrice": 550,
  "minimumStock": 15
}`}
              success={`{
  "success": true,
  "product": {}
}`}
              errors={[
                {
                  status: "404",
                  title: "Product not found",
                  body: `{
  "success": false,
  "message": "Product not found"
}`,
                },
              ]}
            />


            <ApiEndpoint
              method="DELETE"
              path="/api/products/:id"
              title="Delete Product"
              description="Deletes a product."
              roles="ADMIN"
              success={`{
  "success": true,
  "message": "Product deleted successfully"
}`}
              errors={[
                {
                  status: "404",
                  title: "Product not found",
                  body: `{
  "success": false,
  "message": "Product not found"
}`,
                },
              ]}
            />

          </div>


          {/* =================================================
              CATEGORIES
          ================================================= */}

          <div className="api-category">

            <div className="api-category-heading">

              <span className="category-number">
                05
              </span>

              <div>
                <h2>Categories</h2>

                <p>
                  Product category management.
                </p>
              </div>

            </div>


            <ApiEndpoint
              method="GET"
              path="/api/categories"
              title="Get Categories"
              description="Returns all product categories."
              roles="ADMIN, SALES, WAREHOUSE"
              success={`{
  "success": true,
  "categories": []
}`}
              errors={[]}
            />


            <ApiEndpoint
              method="POST"
              path="/api/categories"
              title="Create Category"
              description="Creates a new product category."
              roles="ADMIN, WAREHOUSE"
              request={`{
  "name": "Electronics"
}`}
              success={`{
  "success": true,
  "category": {}
}`}
              errors={[
                {
                  status: "400",
                  title: "Validation error",
                  body: `{
  "success": false,
  "message": "Validation error"
}`,
                },
              ]}
            />

          </div>


          {/* =================================================
              WAREHOUSES
          ================================================= */}

          <div className="api-category">

            <div className="api-category-heading">

              <span className="category-number">
                06
              </span>

              <div>
                <h2>Warehouses</h2>

                <p>
                  Warehouse management.
                </p>
              </div>

            </div>


            <ApiEndpoint
              method="GET"
              path="/api/warehouses"
              title="Get Warehouses"
              description="Returns available warehouses."
              roles="ADMIN, SALES, WAREHOUSE"
              success={`{
  "success": true,
  "warehouses": []
}`}
              errors={[]}
            />


            <ApiEndpoint
              method="POST"
              path="/api/warehouses"
              title="Create Warehouse"
              description="Creates a new warehouse."
              roles="ADMIN"
              request={`{
  "name": "Main Warehouse",
  "location": "Delhi"
}`}
              success={`{
  "success": true,
  "warehouse": {}
}`}
              errors={[
                {
                  status: "400",
                  title: "Validation error",
                  body: `{
  "success": false,
  "message": "Validation error"
}`,
                },
              ]}
            />

          </div>


          {/* =================================================
              INVENTORY
          ================================================= */}

          <div className="api-category">

            <div className="api-category-heading">

              <span className="category-number">
                07
              </span>

              <div>
                <h2>Inventory</h2>

                <p>
                  Stock movements and inventory management.
                </p>
              </div>

            </div>


            <ApiEndpoint
              method="POST"
              path="/api/inventory/:productId"
              title="Create Stock Movement"
              description="Creates an IN or OUT stock movement and updates current product stock."
              roles="ADMIN, WAREHOUSE"
              request={`{
  "movementType": "IN",
  "quantity": 10,
  "reason": "New stock received"
}`}
              success={`{
  "success": true,
  "message": "Stock updated successfully"
}`}
              errors={[
                {
                  status: "400",
                  title: "Invalid quantity",
                  body: `{
  "success": false,
  "message": "Quantity must be greater than 0"
}`,
                },
                {
                  status: "400",
                  title: "Insufficient stock",
                  body: `{
  "success": false,
  "message": "Insufficient stock"
}`,
                },
              ]}
            />


            <ApiEndpoint
              method="GET"
              path="/api/inventory/:productId"
              title="Get Inventory Movements"
              description="Returns stock movement history for a product."
              roles="ADMIN, WAREHOUSE"
              success={`{
  "success": true,
  "movements": []
}`}
              errors={[
                {
                  status: "404",
                  title: "Product not found",
                  body: `{
  "success": false,
  "message": "Product not found"
}`,
                },
              ]}
            />

          </div>


          {/* =================================================
              CHALLANS
          ================================================= */}

          <div className="api-category">

            <div className="api-category-heading">

              <span className="category-number">
                08
              </span>

              <div>
                <h2>Sales Challans</h2>

                <p>
                  Challan creation, editing, listing and
                  confirmation.
                </p>
              </div>

            </div>


            {/* CREATE */}

            <ApiEndpoint
              method="POST"
              path="/api/challans"
              title="Create Challan"
              description="Creates a new challan in DRAFT status."
              roles="ADMIN, SALES"
              request={`{
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 5
    },
    {
      "productId": 2,
      "quantity": 3
    }
  ]
}`}
              success={`{
  "success": true,
  "message": "Challan created successfully",
  "challan": {
    "id": 1,
    "challanNumber": "CH-XXXXXXXX",
    "customerId": 1,
    "totalQuantity": 8,
    "status": "DRAFT",
    "items": []
  }
}`}
              errors={[
                {
                  status: "400",
                  title: "Invalid customer",
                  body: `{
  "success": false,
  "message": "Invalid customer ID"
}`,
                },
                {
                  status: "400",
                  title: "No items",
                  body: `{
  "success": false,
  "message": "At least one product is required"
}`,
                },
                {
                  status: "400",
                  title: "Invalid product",
                  body: `{
  "success": false,
  "message": "Invalid product ID"
}`,
                },
                {
                  status: "400",
                  title: "Invalid quantity",
                  body: `{
  "success": false,
  "message": "Quantity must be a positive integer"
}`,
                },
                {
                  status: "400",
                  title: "Duplicate product",
                  body: `{
  "success": false,
  "message": "Same product cannot be added twice"
}`,
                },
                {
                  status: "404",
                  title: "Customer not found",
                  body: `{
  "success": false,
  "message": "Customer not found"
}`,
                },
              ]}
            />


            {/* LIST */}

            <ApiEndpoint
              method="GET"
              path="/api/challans?page=1&limit=10"
              title="Get Challans"
              description="Returns a paginated list of challans."
              auth={true}
              success={`{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 2,
  "totalPages": 1,
  "challans": []
}`}
              errors={[
                {
                  status: "500",
                  title: "Internal server error",
                  body: `{
  "success": false,
  "message": "Internal server error"
}`,
                },
              ]}
            />


            {/* GET SINGLE */}

            <ApiEndpoint
              method="GET"
              path="/api/challans/:id"
              title="Get Challan By ID"
              description="Returns a single challan with its customer, creator and items."
              auth={true}
              success={`{
  "success": true,
  "challan": {
    "id": 1,
    "challanNumber": "CH-XXXXXXXX",
    "status": "DRAFT",
    "customer": {},
    "createdBy": {},
    "items": []
  }
}`}
              errors={[
                {
                  status: "400",
                  title: "Invalid challan ID",
                  body: `{
  "success": false,
  "message": "Invalid challan ID"
}`,
                },
                {
                  status: "404",
                  title: "Challan not found",
                  body: `{
  "success": false,
  "message": "Challan not found"
}`,
                },
              ]}
            />


            {/* UPDATE */}

            <ApiEndpoint
              method="PUT"
              path="/api/challans/:id"
              title="Update Draft Challan"
              description="Updates a challan while it is in DRAFT status."
              roles="ADMIN, SALES"
              request={`{
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 10
    }
  ]
}`}
              success={`{
  "success": true,
  "message": "Challan updated successfully",
  "challan": {}
}`}
              errors={[
                {
                  status: "400",
                  title: "Invalid challan ID",
                  body: `{
  "success": false,
  "message": "Invalid challan ID"
}`,
                },
                {
                  status: "404",
                  title: "Challan not found",
                  body: `{
  "success": false,
  "message": "Challan not found"
}`,
                },
                {
                  status: "400",
                  title: "Cannot edit confirmed challan",
                  body: `{
  "success": false,
  "message": "Only draft challans can be edited"
}`,
                },
                {
                  status: "400",
                  title: "Duplicate product",
                  body: `{
  "success": false,
  "message": "Same product cannot be added twice in one challan"
}`,
                },
              ]}
            />


            {/* CONFIRM */}

            <ApiEndpoint
              method="POST"
              path="/api/challans/:id/confirm"
              title="Confirm Challan"
              description="Confirms a draft challan, snapshots customer information, decreases inventory and creates OUT stock movements."
              roles="ADMIN, SALES"
              success={`{
  "success": true,
  "message": "Challan confirmed successfully",
  "challan": {
    "id": 1,
    "status": "CONFIRMED"
  }
}`}
              errors={[
                {
                  status: "400",
                  title: "Invalid challan ID",
                  body: `{
  "success": false,
  "message": "Invalid challan ID"
}`,
                },
                {
                  status: "404",
                  title: "Challan not found",
                  body: `{
  "success": false,
  "message": "Challan not found"
}`,
                },
                {
                  status: "400",
                  title: "Invalid status",
                  body: `{
  "success": false,
  "message": "Only draft challans can be confirmed"
}`,
                },
                {
                  status: "400",
                  title: "Insufficient stock",
                  body: `{
  "success": false,
  "message": "Insufficient stock for {productName}"
}`,
                },
                {
                  status: "500",
                  title: "Internal server error",
                  body: `{
  "success": false,
  "message": "Internal server error"
}`,
                },
              ]}
            />

          </div>

        </section>


        {/* =====================================================
            BUSINESS LOGIC
        ===================================================== */}

        <section className="doc-section">

          <h2>6. Important Business Workflows</h2>

          <h3>Inventory Movement</h3>

          <div className="flow">

            <div>Request</div>
            <span>→</span>

            <div>Validate Quantity</div>
            <span>→</span>

            <div>Update Stock</div>
            <span>→</span>

            <div>Create Movement</div>

          </div>


          <h3>Challan Confirmation</h3>

          <div className="flow">

            <div>DRAFT</div>
            <span>→</span>

            <div>Validate Stock</div>
            <span>→</span>

            <div>Snapshot Customer</div>
            <span>→</span>

            <div>Decrease Stock</div>
            <span>→</span>

            <div>OUT Movement</div>
            <span>→</span>

            <div>CONFIRMED</div>

          </div>

          <p className="doc-note">
            The challan confirmation process performs the related
            database operations as a transaction so that the
            challan, inventory and stock movement records remain
            consistent.
          </p>

        </section>


        {/* =====================================================
            DATABASE
        ===================================================== */}

        <section className="doc-section">

          <h2>7. Database Design</h2>

          <p>
            The application uses PostgreSQL with Prisma ORM.
          </p>

          <div className="entity-list">

            <span>User</span>
            <span>Customer</span>
            <span>CustomerFollowup</span>
            <span>Category</span>
            <span>Product</span>
            <span>Warehouse</span>
            <span>StockMovement</span>
            <span>Challan</span>
            <span>ChallanItem</span>

          </div>

        </section>


        {/* =====================================================
            ENVIRONMENT
        ===================================================== */}

        <section className="doc-section">

          <h2>8. Environment Variables</h2>

          <h3>Backend</h3>

          <pre>
{`DATABASE_URL=
DIRECT_URL=
PORT=
JWT_SECRET=
NODE_ENV=
FRONTEND_URL=`}
          </pre>

          <h3>Frontend</h3>

          <pre>
{`VITE_API_URL=`}
          </pre>

          <p className="doc-note">
            Secret values are managed through environment
            variables and are not committed to source control.
          </p>

        </section>


        {/* =====================================================
            LOCAL SETUP
        ===================================================== */}

        <section className="doc-section">

          <h2>9. Local Setup</h2>

          <h3>Backend</h3>

          <pre>
{`cd backend
npm install

npx prisma generate
npx prisma migrate deploy

npm run dev`}
          </pre>

          <h3>Frontend</h3>

          <pre>
{`cd frontend
npm install
npm run dev`}
          </pre>

        </section>


        {/* =====================================================
            DOCKER
        ===================================================== */}

        <section className="doc-section">

          <h2>10. Docker Setup</h2>

          <pre>
{`cd backend

docker build -t erp-crm-backend .

docker run --env-file .env -p 3000:3000 erp-crm-backend`}
          </pre>

        </section>


        {/* =====================================================
            DEPLOYMENT
        ===================================================== */}

        <section className="doc-section">

          <h2>11. Production Deployment</h2>

          <div className="deployment-step">

            <strong>Database — Supabase</strong>

            <p>
              Production PostgreSQL database hosted on Supabase.
              Prisma migrations are applied using:
            </p>

            <pre>
{`npx prisma migrate deploy`}
            </pre>

          </div>


          <div className="deployment-step">

            <strong>Backend — Render</strong>

            <p>
              The Express backend is packaged as a Docker image
              and deployed on Render.
            </p>

          </div>


          <div className="deployment-step">

            <strong>Frontend — Netlify</strong>

            <p>
              The React/Vite frontend is built using Vite and
              deployed on Netlify.
            </p>

          </div>

        </section>


        {/* =====================================================
            POSTMAN
        ===================================================== */}

        <section className="doc-section">

          <h2>12. API Testing</h2>

          <p>
            A Postman collection is provided with the project
            repository for testing the backend APIs.
          </p>

          <p>
            The collection can be configured to use either the
            local backend URL or the deployed Render backend URL.
          </p>

        </section>


        {/* =====================================================
            ASSUMPTIONS
        ===================================================== */}

        <section className="doc-section">

          <h2>13. Assumptions</h2>

          <ol>

            <li>
              PostgreSQL is used as the primary relational database.
            </li>

            <li>
              Products belong to warehouses.
            </li>

            <li>
              Stock is maintained at the product level.
            </li>

            <li>
              Newly created challans start in DRAFT status.
            </li>

            <li>
              Only draft challans can be edited.
            </li>

            <li>
              Confirming a challan represents stock leaving inventory.
            </li>

            <li>
              Customer information is snapshotted when a challan
              is confirmed.
            </li>

            <li>
              Inventory changes and their corresponding stock
              movement records are handled together.
            </li>

            <li>
              Production secrets are supplied through environment
              variables.
            </li>

          </ol>

        </section>


        {/* =====================================================
            LIVE APPLICATION
        ===================================================== */}

        <section className="doc-section">

          <h2>14. Live Application</h2>

          <div className="live-application-card">

            <p>
              The production frontend is available at:
            </p>

            <a
              href="https://erp-crm223.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://erp-crm223.netlify.app/
            </a>

          </div>

        </section>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="documentation-footer">

          <strong>
            ERP & CRM Management System
          </strong>

          <span>
            Technical Documentation
          </span>

        </footer>

      </main>

    </div>
  );
}