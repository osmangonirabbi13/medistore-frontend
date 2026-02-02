#  Medi Store


A modern full-stack pharmacy e-commerce platform built with **Next.js, Node.js, Express, Prisma, and PostgreSQL**.

---

##  Live Demo

-  Frontend: https://medi-store-dusky.vercel.app  
-  Backend API: https://9-medistore.vercel.app  

---

## Admin Credentials

- Admin Email : admin@admin.com
- Admin Pass : admin1234

---

## Seller Credentials

- Seller Email : seller@seller.com
- Seller Pass : seller123

##  Features

###  Authentication
- Session-based authentication
- Role-based access control
- Protected routes with middleware
- Secure cookie handling

###  Customer
- Browse products
- Add to cart
- Place orders
- View order history

###  Seller
- Become a seller (Admin approval required)
- Manage products
- View and process orders

### 🛠 Admin
- Approve sellers
- Manage users
- Monitor platform activity

---

##  Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI
- React Hook Form + Zod

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

---

##  Project Structure

```bash
medi-store/
 ├── src/
 │   ├── app/
 │   ├── components/
 │   ├── services/
 │   ├── actions/
 │   ├── constants/
 │   └── env.ts
 └── next.config.ts
```

---

##  Environment Variables

### Frontend (.env)

```env
BACKEND_URL=https://your-backend-url.com
API_URL=https://your-backend-url.com
AUTH_URL=https://your-backend-url.com/api/auth

FRONTEND_URL=https://your-frontend-url.com
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend-url.com
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com

```

### Backend (.env)

```env
DATABASE_URL=postgresql://username:password@localhost:5432/medistore
FRONTEND_URL=https://your-frontend-url.com
BETTER_AUTH_SECRET=your_secret_key

BETTER_AUTH_URL=https://your-backend-url.com || http://localhost:5000/
APP_URL=https://your-frontend-url.com || http://localhost:3000/

APP_PASS=google_app_pass || nodemiller

APP_EMAIL=google_app_email ||nodemiller

GOOGLE_CLIENT_SECRET= GOOGLE_CLIENT_SECRET

GOOGLE_CLIENT_ID= GOOGLE_CLIENT_ID

```

---

##  Installation

### Clone the repository

```bash
git clone https://github.com/your-username/medi-store.git
cd medi-store
```

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

---

##  Role Based Routes

| Role      | Route              |
|-----------|-------------------|
| Admin     | /admin-dashboard  |
| Seller    | /seller-dashboard |
| Customer  | /profile          |

---

##  Screenshots

![Medi Store Architecture Diagram](https://i.ibb.co.com/bjVtPPyq/Untitled-Diagram-drawio.png)

---

##  Contributing

Pull requests are welcome.  
For major changes, please open an issue first.

---

## 📄 License

This project is licensed under the MIT License.
