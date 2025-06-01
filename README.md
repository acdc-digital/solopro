![ACDC Logo](public/logo-ACDC.svg)

# solopro
soloist-pro_v2

<table>
  <tr>
    <td>
      <pre>
  ____        _       _     _             ____            
 / ___|  ___ | | ___ (_)___| |_          |  _ \ _ __ ___  
 \___ \ / _ \| |/ _ \| / __| __|  _____  | |_) | '__/ _ \ 
  ___) | (_) | | (_) | \__ \ |_  |_____| |  __/| | | (_) |
 |____/ \___/|_|\___/|_|___/\__|         |_|   |_|  \___/
      </pre>
    </td>
  </tr>
</table>

## Our Architecture
[![React](https://img.shields.io/badge/React-%2320232A.svg?style=flat-round&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%233178C6.svg?style=flat-round&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-%23000000.svg?style=flat-round&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-%2306B6D4.svg?style=flat-round&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-%23000000.svg?style=flat-round&logo=OpenAI&logoColor=white)](https://www.openai.com/)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=flat-round&logo=Vercel&logoColor=white)](https://vercel.com/)
[![ShadCN/ui](https://img.shields.io/badge/shadcn--ui-%2327272A.svg?style=flat-round&logoColor=white)](https://ui.shadcn.com/)
[![Convex DB](https://img.shields.io/badge/Convex_DB-%23450AFF.svg?style=flat-round&logo=convex&logoColor=white)](https://convex.dev/)

# soloist_pro
**Github Project:** https://github.com/users/acdc-digital/projects/10   
Soloist application professional development repository.

### Get Started with Development Commands
#### **Start everything (recommended)**
pnpm dev

#### **Individual services:**
pnpm dev:renderer    # Just the Electron content (port 3002)   
pnpm dev:website      # Just the website (port 3004)    
pnpm dev:electron    # Just the Electron window

### Git Update Version Commands
1. git add .
2. git commit -m "Updated version to x.x.x"
3. git tag vx.x.x
4. git push origin main vx.x.x
5. (optional) git reset --hard vx.x.x

**Version History**
v1.1.0 - Workspace Init is complete - all directories firing with new Authentication security.

### Feature Development Instructions:
1. git checkout -b new-branch
2. git add .
3. git commit -m "Updated Feature version to x.x.x"
4. push origin main

### Get Started with Deployment Commands
#### **Start everything (recommended)**
pnpm run deploy:all

#### **Individual services:**
pnpm run deploy:renderer
pnpm run deploy:website