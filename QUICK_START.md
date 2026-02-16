# ⚡ Quick Start Guide

Fast reference for getting the React app running with your Rails backend.

---

## 🚀 5-Minute Setup

### 1. Build React App
```bash
npm install
npm run build
```

### 2. Copy to Rails
```bash
cp -r dist/* /path/to/rails-app/public/
```

### 3. Update Rails Routes
```ruby
# config/routes.rb
Rails.application.routes.draw do
  # Your API routes first
  namespace :api do
    # ... your endpoints
  end
  
  # React app catch-all (MUST BE LAST)
  get '*path', to: 'frontend#index', constraints: ->(req) {
    !req.path.start_with?('/api') && req.format.html?
  }
end
```

### 4. Create Frontend Controller
```ruby
# app/controllers/frontend_controller.rb
class FrontendController < ApplicationController
  def index
    render file: Rails.root.join('public', 'index.html'), layout: false
  end
end
```

### 5. Enable Static Files
```ruby
# config/environments/production.rb
config.public_file_server.enabled = true
```

### 6. Test It
```bash
rails server
# Visit: http://localhost:3000
```

---

## 📋 Required API Endpoints

### Authentication
```
POST /api/login
POST /api/signup  
GET  /api/me
```

### User Features
```
GET    /api/locations
POST   /api/locations
PUT    /api/locations/:id
DELETE /api/locations/:id
GET    /api/feedback
```

### Admin Panel
```
GET /api/admin/dashboard
GET /api/admin/users
GET /api/admin/locations
GET /api/admin/feedback
GET /api/admin/analytics
GET /api/admin/settings
PUT /api/admin/settings
```

---

## 🔧 Environment Variables

Create `.env.production` in React app:
```bash
VITE_STRIPE_PUBLIC_KEY=pk_live_your_key
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## 📚 Full Documentation

- **Admin APIs:** `/ADMIN_API_SPEC.md`
- **SEO Setup:** `/SEO_SETUP_GUIDE.md`
- **Rails Integration:** `/RAILS_INTEGRATION_GUIDE.md`
- **Full Summary:** `/PRODUCTION_READY_SUMMARY.md`

---

## ⚠️ Common Issues

**Blank page on refresh?**
→ Check Rails catch-all route is configured

**API 404 errors?**
→ API routes must be BEFORE catch-all route

**CORS errors?**
→ Install `rack-cors` gem and configure

**Assets not loading?**
→ Enable `config.public_file_server.enabled = true`

---

## ✅ Production Checklist

- [ ] Build React app
- [ ] Copy to Rails `/public`
- [ ] Configure routes.rb
- [ ] Create frontend controller
- [ ] Enable static file serving
- [ ] Test all routes work
- [ ] Update sitemap.xml domain
- [ ] Configure SSL
- [ ] Test API endpoints
- [ ] Deploy!

---

That's it! For detailed information, see the full documentation files.
