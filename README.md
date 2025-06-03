![ACDC Logo](public/logo-ACDC.svg)

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

# Soloist.
Soloist can be a lot of things, and thats kind of why it's a dynamic app. Behind its simplicity, at its core Soloist aims to help identify self-patterns which allows users to make data-enabled decisions about their personal life. At its heart is the Daily Log- a customizable template for each day. When a day is submitted, Soloist will automatically generate a summary of your day. After 4 cumulative days (in accordance with the latest predictive reseasrch), the User can begin to generate a forecast for the following 3 days. The Feed can be edited any time. To alter or enhance each day, the user can also submit Notes, Media, or Tags to include in the daily feed - a scrollable waterfall of things as they are happening or happened. In the Playground, you can choose to forecast against any 4-consecutive days in the past and compare against the real-time data to see how accurate it actually is. Gain key insights as to how your behaviour is changing before it happens. Visualize your Daily Score in the 365 Heatmap. And add details to your Profile to allow for Automated generation - you don't even have to fill out the log each day, just enable auto-generation and Soloist will use all of your historical information to 'guess' what kind of day you had on any given day.   

Soloist is owned and developped by ACDC.digital. This is a For-Profit Open Source repository and contributions are welcome. This is a wellness platform where we believe in allowing others to contribute, and take from the work.   

Thank you for stopping by.   
This repo is maintained by: msimon@acdc.digital

**Latest Version:** 1.4.2   
**Lates Release Notes:** https://github.com/acdc-digital/solopro/releases   
**Github Wiki:** https://github.com/acdc-digital/solopro/wiki   
**Github Project:** https://github.com/users/acdc-digital/projects/10   

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