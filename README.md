# Pluma  
_Ignite Conversations • Inspire Connections • Elevate Ideas_

---

## 📖 Overview
**Pluma** is a modern, full-stack social blogging platform for creators and readers.  
Built with **Next.js**, **GraphQL**, **PostgreSQL**, and **Prisma ORM**, it enables rich content creation, social interactions, and seamless scalability.

**Why Pluma?**
- 🚀 **Scalable architecture** for social platforms
- 🎨 **Responsive UI** powered by Tailwind CSS & Shadcn UI
- 🔐 **Secure authentication** with OAuth & Passport
- ⚡ **Fast content discovery** with search & tags
- 🐳 **Dockerized setup** for local & production

---

## 🛠 Tech Stack
**Frontend:** Next.js, React, Tailwind CSS, Shadcn UI  
**Backend:** Express, GraphQL (Apollo), Prisma ORM, PostgreSQL  
**Auth:** Passport, OAuth  
**Media:** Cloudinary  
**DevOps:** Docker, Docker Compose, GitHub Actions (CI/CD)  
**Other:** ESLint, date-fns, PostCSS, Autoprefixer  

---

## ✨ Features
- 📝 **Content Creation:** Write & publish articles with cover images & tags  
- 💬 **Engagement:** Like, comment, and follow other creators  
- 🔍 **Advanced Search:** Search posts by title, description, author, or tags  
- 📈 **Analytics:** Track views, likes, and comment counts  
- 🐳 **One-command setup** with Docker Compose  
- 🔄 **Automated deployment** with GitHub Actions  

---

## 📸 Screenshots

<img width="1868" height="856" alt="image" src="https://github.com/user-attachments/assets/8a02ee91-126f-4207-83ee-08a0103e71fc" />

<img width="1640" height="873" alt="image" src="https://github.com/user-attachments/assets/41870d1d-ea28-4b2d-a673-d4d2cdb6239b" />

<img width="1791" height="888" alt="image" src="https://github.com/user-attachments/assets/ef119840-d012-4511-b00c-8e8bf690a666" />

<img width="1727" height="882" alt="image" src="https://github.com/user-attachments/assets/b12e64e2-2dee-4c0f-8d57-f8d8f3de9e97" />

<img width="699" height="718" alt="image" src="https://github.com/user-attachments/assets/3a63c839-6e1c-42d4-b746-d2e1e343ad81" />

<img width="693" height="611" alt="image" src="https://github.com/user-attachments/assets/2ad9fe3a-a1c8-423e-a54b-9cb7e4824263" />

<img width="1898" height="878" alt="image" src="https://github.com/user-attachments/assets/5f9e6f70-0248-4a13-a341-674da5393507" />

<img width="1884" height="975" alt="image" src="https://github.com/user-attachments/assets/c0e10179-d54e-431a-90c0-dcaff88a584d" />

<img width="1896" height="796" alt="image" src="https://github.com/user-attachments/assets/7b8e21cc-a256-4a32-9aa0-5f842004ab08" />

<img width="1891" height="995" alt="image" src="https://github.com/user-attachments/assets/7646c6ac-1a47-46a4-9802-21398ded87a3" />


---

## 🚀 Getting Started

### **Prerequisites**
Make sure you have installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

---

### **Installation**

**Clone the repository**
```bash
git clone https://github.com/Muhammadasim225/pluma-social-blog.git
cd pluma-social-blog
```

**Run with Docker**
```bash
docker-compose up --build
```

**Run locally without Docker**
```bash
npm install
npm run dev
```

---

## 🐳 Docker Hub Images

You can also pull ready-to-run images from Docker Hub:

**Frontend**
```bash
docker push muhammadasim0333/pluma-frontend
```

**Backend**
```bash
docker push muhammadasim0333/pluma-backend
```


## ⚙️ Environment Variables
Create a `.env` file in the root and configure:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/pluma
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
JWT_SECRET=your_jwt_secret
```

---

## 🧪 Testing
> Replace `{test_framework}` with your testing framework (e.g., Jest, Mocha).

**Run tests**
```bash
npm test
```

---

## 🗺 Roadmap
- [ ] User profiles & bio customization  
- [ ] Post scheduling  
- [ ] Image optimization pipeline  
- [ ] Notifications system  

---

## 🤝 Contributing
Contributions are welcome! Please fork the repo and submit a PR.

---

## 📜 License
This project is licensed under the **MIT License**.

---

