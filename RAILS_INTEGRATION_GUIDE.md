# Rails Backend Integration Guide

Complete guide for integrating this React frontend with your Ruby on Rails backend.

---

## 📁 Project Structure

```
feedback-page/
├── public/                  # Built React app will go here
│   ├── index.html          # Main HTML file
│   ├── assets/             # JS, CSS, images
│   ├── sitemap.xml         # SEO sitemap
│   └── robots.txt          # Search engine rules
├── src/                    # React source (for development)
└── Rails files...
```

---

## 🚀 Deployment Setup

### Step 1: Build the React App

Build the production-optimized React app:

```bash
npm run build
# or
yarn build
```

This creates a `dist/` folder with:
- `index.html`
- `/assets/` folder with all JS, CSS, and images

### Step 2: Move Build Files to Rails Public Directory

Copy the built files to your Rails `public/` directory:

```bash
# From the React app directory
cp -r dist/* /path/to/rails-app/public/
```

**Or automate it:**

Create a build script `build-for-rails.sh`:
```bash
#!/bin/bash
npm run build
rm -rf ../rails-app/public/assets/*
cp -r dist/* ../rails-app/public/
echo "✅ React app built and copied to Rails public directory"
```

---

## ⚙️ Rails Configuration

### 1. Update Routes (`config/routes.rb`)

```ruby
Rails.application.routes.draw do
  # API Routes (must come BEFORE catch-all route)
  namespace :api do
    # User authentication
    post '/login', to: 'auth#login'
    post '/signup', to: 'auth#signup'
    delete '/logout', to: 'auth#logout'
    get '/me', to: 'auth#me'
    
    # User management
    resources :locations
    resources :feedback
    
    # Admin API
    namespace :admin do
      get '/dashboard', to: 'dashboard#index'
      resources :users
      resources :locations
      resources :feedback
      get '/analytics', to: 'analytics#index'
      get '/settings', to: 'settings#index'
      put '/settings', to: 'settings#update'
    end
    
    # Stripe webhooks
    post '/webhooks/stripe', to: 'webhooks#stripe'
  end
  
  # Health check (for load balancers)
  get '/health', to: proc { [200, {}, ['OK']] }
  
  # Serve static files (sitemap, robots.txt automatically served from /public)
  
  # React App Catch-All Route (MUST BE LAST)
  get '*path', to: 'frontend#index', constraints: ->(req) {
    # Only serve React app for:
    # - Non-API routes
    # - Non-asset routes  
    # - HTML format requests
    !req.path.start_with?('/api') &&
    !req.path.start_with?('/assets') &&
    !req.path.start_with?('/rails/') &&
    req.format.html?
  }
end
```

### 2. Create Frontend Controller

Create `app/controllers/frontend_controller.rb`:

```ruby
class FrontendController < ApplicationController
  # Disable CSRF for this controller since it serves the React app
  skip_before_action :verify_authenticity_token
  
  def index
    # Serve the React app
    render file: Rails.root.join('public', 'index.html'), layout: false
  end
end
```

### 3. Configure Static File Serving

Update `config/environments/production.rb`:

```ruby
Rails.application.configure do
  # Serve static files from /public
  config.public_file_server.enabled = true
  
  # Enable gzip compression for better performance
  config.middleware.use Rack::Deflater
  
  # Cache static assets
  config.public_file_server.headers = {
    'Cache-Control' => 'public, max-age=31536000'
  }
  
  # CORS configuration (if frontend and backend on different domains)
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins 'feedbackpage.com', 'www.feedbackpage.com' # Update with your domain
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        credentials: true
    end
  end
end
```

### 4. Add CORS Gem (if frontend and backend on different domains)

**In `Gemfile`:**
```ruby
gem 'rack-cors'
```

Then run:
```bash
bundle install
```

---

## 🔐 Authentication Flow

### Frontend → Backend Authentication

The React app expects these API endpoints:

#### 1. **Login** - `POST /api/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  },
  "token": "jwt_token_here"
}
```

**Response (Error):**
```json
{
  "error": "Invalid email or password"
}
```

#### 2. **Signup** - `POST /api/signup`

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "businessName": "John's Coffee Shop"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  },
  "token": "jwt_token_here"
}
```

#### 3. **Get Current User** - `GET /api/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "businessName": "John's Coffee Shop",
  "plan": "pro"
}
```

### Frontend Token Storage

The React app stores the JWT token in `localStorage`:
```javascript
localStorage.setItem('authToken', token);
```

All subsequent API calls include:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 📋 API Endpoints Reference

See the complete API specification in:
- **User/Location/Feedback APIs:** Check existing frontend code
- **Admin Panel APIs:** `/ADMIN_API_SPEC.md`

---

## 🎨 Environment Variables

The React app may need these environment variables:

Create `.env.production` in your React app:
```bash
# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_live_your_key_here

# API Base URL (if separate backend server)
VITE_API_BASE_URL=https://api.feedbackpage.com

```

---

## 🧪 Testing the Integration

### 1. Test Static File Serving

Start your Rails server and visit:
```
http://localhost:3000/
http://localhost:3000/pricing
http://localhost:3000/features
```

All should show the React app.

### 2. Test API Endpoints

```bash
# Test login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test authenticated endpoint
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Test Static Files

```
http://localhost:3000/sitemap.xml
http://localhost:3000/robots.txt
```

### 4. Test 404 Handling

The React app has a NotFoundPage component. Test that invalid routes show it:
```
http://localhost:3000/invalid-route-that-does-not-exist
```

Should show the custom 404 page, NOT a Rails error.

---

## 🌐 CORS Configuration

If your frontend and backend are on **different domains** (e.g., `feedbackpage.com` → `api.feedbackpage.com`):

### In Rails (`config/initializers/cors.rb`):

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'feedbackpage.com', 'www.feedbackpage.com'
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization']
  end
end
```

### In React (update API calls):

If using fetch:
```javascript
fetch('https://api.feedbackpage.com/api/me', {
  credentials: 'include', // Important for cookies
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 📦 Production Deployment

### Option 1: Same Server (Recommended for Simplicity)

1. Build React app
2. Copy to Rails `/public`
3. Deploy Rails app as normal
4. Frontend and backend served from same domain

**Pros:**
- Simple deployment
- No CORS issues
- Single SSL certificate

### Option 2: Separate Servers

1. Deploy React app to CDN (Cloudflare, Netlify, Vercel)
2. Deploy Rails API to server
3. Configure CORS properly
4. Point frontend API calls to backend domain

**Pros:**
- Better scalability
- CDN caching for frontend
- Independent deployments

**Cons:**
- CORS configuration required
- Two deployments to manage

---

## 🔒 Security Considerations

### 1. Protect Admin Routes

```ruby
# app/controllers/api/admin_controller.rb
class Api::AdminController < ApplicationController
  before_action :authenticate_admin!
  
  private
  
  def authenticate_admin!
    user = current_user # Your auth logic here
    
    unless user&.admin?
      render json: { error: 'Unauthorized' }, status: :forbidden
    end
  end
end
```

### 2. Rate Limiting

```ruby
# Gemfile
gem 'rack-attack'

# config/initializers/rack_attack.rb
Rack::Attack.throttle('api/ip', limit: 300, period: 5.minutes) do |req|
  req.ip if req.path.start_with?('/api')
end
```

### 3. HTTPS Only

```ruby
# config/environments/production.rb
config.force_ssl = true
```

---

## 📊 Monitoring & Logging

### Log API Requests

```ruby
# config/initializers/lograge.rb (optional)
Rails.application.configure do
  config.lograge.enabled = true
  config.lograge.custom_options = lambda do |event|
    {
      time: event.time,
      params: event.payload[:params].except('controller', 'action')
    }
  end
end
```

---

## 🐛 Troubleshooting

### Problem: Blank page on refresh
**Cause:** Rails not serving index.html for React routes  
**Fix:** Check routes.rb catch-all route configuration

### Problem: API calls fail with 404
**Cause:** API routes defined after catch-all route  
**Fix:** Move API routes BEFORE catch-all route in routes.rb

### Problem: Assets not loading (404 on CSS/JS files)
**Cause:** Asset path issues or public file server disabled  
**Fix:** 
```ruby
config.public_file_server.enabled = true
```

### Problem: CORS errors
**Cause:** Frontend and backend on different domains without CORS  
**Fix:** Install and configure rack-cors gem

### Problem: React Router links work, but direct URL navigation fails
**Cause:** Rails not serving index.html for all routes  
**Fix:** Verify catch-all route in routes.rb

---

## ✅ Deployment Checklist

- [ ] Build React app (`npm run build`)
- [ ] Copy build files to Rails `/public`
- [ ] Configure routes.rb with catch-all route
- [ ] Create frontend_controller.rb
- [ ] Enable static file serving in production.rb
- [ ] Set up CORS (if needed)
- [ ] Test all routes work on refresh
- [ ] Test API endpoints
- [ ] Verify sitemap.xml is accessible
- [ ] Verify robots.txt is accessible
- [ ] Configure SSL certificate
- [ ] Set up rate limiting
- [ ] Configure monitoring/logging
- [ ] Test authentication flow
- [ ] Test admin panel access control

---

## 📚 Additional Resources

- Rails API Mode: https://guides.rubyonrails.org/api_app.html
- JWT Authentication: https://github.com/jwt/ruby-jwt
- Rack CORS: https://github.com/cyu/rack-cors
- React Router: https://reactrouter.com/

---

## 🎉 You're Ready!

Your React frontend is production-ready and fully documented for Rails integration. If you have any questions, refer to:

- `/ADMIN_API_SPEC.md` - Complete admin API specification
- `/SEO_SETUP_GUIDE.md` - SEO configuration and testing
- This file - Rails integration guide

Happy deploying! 🚀
