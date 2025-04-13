# MindStack_Back
A robust Node.js/Express backend API for a comprehensive digital library platform. This repository provides the server-side infrastructure to power a feature-rich online library containing historical books, novels, scientific references, and other literature.


MindStack_Back/
│
├── /DB
│   ├── /Models
│   │   ├── user.model.js          # User schema (auth, role, etc.)
│   │   ├── book.model.js          # Book schema (title, file, author, etc.)
│   │   ├── category.model.js      # Category schema
│   │   ├── comment.model.js       # Comments on books
│   │   ├── rating.model.js        # Ratings from users
│   │   ├── cart.model.js          # Cart schema (books to purchase)
│   │   ├── order.model.js         # ✅ Order schema (purchased books)
│   │   ├── favorite.model.js      # Favorite books per user (optional)
│   │   └── downloadHistory.model.js # ✅ Download history schema (track book downloads)
│   └── connection.js              # MongoDB connection config
│
├── /src
│   ├── /middlewares
│   │   ├── authMiddleware.js      # JWT token + role-based auth
│   │   ├── errorHandler.js        # Catch and format errors
│   │   └── uploadMiddleware.js    # For image/PDF uploads
│
│   ├── /Modules
│   │   ├── /Users
│   │   │   ├── user.controller.js
│   │   │   ├── user.routes.js
│   │   │   └── user.validator.js
│   │
│   │   ├── /Books
│   │   │   ├── book.controller.js
│   │   │   ├── book.routes.js
│   │   │   └── book.validator.js
│   │
│   │   ├── /Categories
│   │   │   ├── category.controller.js
│   │   │   ├── category.routes.js
│   │
│   │   ├── /Comments
│   │   │   ├── comment.controller.js
│   │   │   ├── comment.routes.js
│   │
│   │   ├── /Ratings
│   │   │   ├── rating.controller.js
│   │   │   ├── rating.routes.js
│   │
│   │   ├── /Cart
│   │   │   ├── cart.controller.js
│   │   │   ├── cart.routes.js
│   │
│   │   ├── /Orders                     # ✅ Order Module
│   │   │   ├── order.controller.js     # Order logic (create, get, update status)
│   │   │   ├── order.routes.js         # Endpoints: /api/orders
│   │   │   └── order.validator.js      # (Optional) Validate order inputs
│   │
│   │   ├── /DownloadHistory            # ✅ New Download History Module
│   │   │   ├── downloadHistory.controller.js  # Logic to track downloads
│   │   │   ├── downloadHistory.routes.js      # Endpoints: /api/download-history
│   │   │   └── downloadHistory.validator.js   # (Optional) Validate download inputs
│
│   ├── /services
│   │   ├── user.service.js
│   │   ├── book.service.js
│   │   ├── category.service.js
│   │   ├── comment.service.js
│   │   ├── rating.service.js
│   │   ├── cart.service.js
│   │   ├── order.service.js
│   │   └── downloadHistory.service.js    # ✅ Track user downloads in DB
│
│   ├── /utils
│   │   ├── emailSender.js
│   │   ├── jwt.js
│   │   ├── uploader.js
│   │   └── errorHandler.js
│
├── /uploads
│
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md

