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

---

# Soloist

**Soloist is your data-driven wellbeing companion**—a simple interface that helps you identify personal patterns and make data-enabled decisions about your life.

At its core, Soloist’s primary goal is to uncover self-patterns through daily inputs, then turn those signals into actionable insights.

### Core Features

1. **Daily Log**  
   - Fill out a fully customizable template for each day.  
   - Upon submission, Soloist automatically generates a concise summary of your day.

2. **3-Day Forecast (After 4 Logs)**  
   - Once you’ve entered **four** cumulative Daily Logs, Soloist unlocks the ability to forecast your next three days.  
   - Forecasts leverage the latest research, showing that four days of history produce the most meaningful short-term predictions.

3. **Feed**  
   - Your Feed is a chronological, scrollable “waterfall” of daily summaries.  
   - Edit at any time—add **Notes**, **Media**, or **Tags** to enrich the narrative of each day.

4. **Playground**  
   - Run “what-if” experiments on any four consecutive past days.  
   - Compare Soloist’s predictions against real-time data to evaluate accuracy.  
   - Gain early insights into how your behavior may shift before it shows up in your Daily Score.

5. **365 Heatmap**  
   - Visualize your Daily Scores on a year-long Heatmap.  
   - Color-coded cells instantly reveal trends—peaks and valleys—so you can spot patterns at a glance.

6. **Auto-Generation**  
   - Enable “Auto-Generation” in your Profile settings.  
   - Soloist will use all your historical data to **guess** what kind of day you had on any given date, even if you miss logging manually.  
   - You can always override or edit these auto-generated entries.

---

## Open Source & For-Profit

Soloist is owned and developed by ACDC.digital. This is a **for-profit, open-source** repository; contributions are welcome.

We believe in community-driven wellness—everyone is free to view, fork, and improve the code. 

---

## Repository Information

- **Maintained by:** msimon@acdc.digital  
- **Latest Version:** v1.4.2  
- **Latest Release Notes:** [v1.4.2 Release](https://github.com/acdc-digital/solopro/releases)  
- **GitHub Wiki:** [Soloist Wiki](https://github.com/acdc-digital/solopro/wiki)  
- **GitHub Project Board:** [Project Board](https://github.com/users/acdc-digital/projects/10)  

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/acdc-digital/solopro.git
cd solopro

# Install dependencies
pnpm install

# Start everything (recommended)
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