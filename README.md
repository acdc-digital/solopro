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

Soloist

A dynamic wellness platform powered by Solomon AI.

<p align="center">
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-%2320232A.svg?style=flat-round&logo=react&logoColor=%2361DAFB" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-%233178C6.svg?style=flat-round&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-%23000000.svg?style=flat-round&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-%2306B6D4.svg?style=flat-round&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://openai.com/"><img src="https://img.shields.io/badge/OpenAI-%23000000.svg?style=flat-round&logo=OpenAI&logoColor=white" alt="OpenAI" /></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-%23000000.svg?style=flat-round&logo=Vercel&logoColor=white" alt="Vercel" /></a>
  <a href="https://ui.shadcn.com/"><img src="https://img.shields.io/badge/shadcn--ui-%2327272A.svg?style=flat-round&logoColor=white" alt="ShadCN UI" /></a>
  <a href="https://convex.dev/"><img src="https://img.shields.io/badge/Convex_DB-%23450AFF.svg?style=flat-round&logo=convex&logoColor=white" alt="Convex DB" /></a>
</p>


Table of Contents
	•	Overview
	•	Features
	•	Architecture
	•	Getting Started
	•	Development Commands
	•	Deployment
	•	Versioning
	•	Contributing
	•	Resources
	•	License & Maintainers

⸻

Overview

Soloist is a personalized daily-log and mood-tracking application that helps you identify patterns, forecast future well-being, and make data-enabled decisions about your life. Each entry is scored (0–100) by Solomon AI and visualized on a 365-day heatmap.

Features
	•	Customizable Daily Log: Tailor entries with objectives, notes, media, and tags.
	•	Automated Summaries: AI-generated summaries on submission.
	•	Predictive Forecasts: After 4 days of data, generate 3-day emotional forecasts.
	•	Interactive Playground: Test forecasts against any 4-day window.
	•	Heatmap Visualization: See daily scores in a color-coded calendar.
	•	Auto-Generation: Optionally auto-populate logs using historical data.

Architecture

Soloist is built with a modern serverless and Next.js stack:

Component	Technology
Frontend	Next.js, React, TypeScript, Tailwind CSS
UI Library	ShadCN/ui, Lucide-React icons
State Management	Zustand
Backend	Convex (serverless DB & auth)
AI Services	OpenAI APIs
Deployment	Vercel


⸻

Getting Started

Clone the repo and install dependencies:

git clone https://github.com/acdc-digital/solopro.git
cd solopro
pnpm install

Development Commands
	•	Start all services (recommended)

pnpm dev


	•	Individual Services

pnpm dev:renderer   # Electron (port 3002)
pnpm dev:website    # Web (port 3004)
pnpm dev:electron   # Electron window only



⸻

Deployment

Use the provided scripts for deploying to production:

# Deploy all services
pnpm run deploy:all

# Deploy individual services
pnpm run deploy:renderer
pnpm run deploy:website


⸻

Versioning

Follow these steps to bump version:
	1.	git add .
	2.	git commit -m "Updated version to x.x.x"
	3.	git tag vx.x.x
	4.	git push origin main vx.x.x
	5.	(Optional) git reset --hard vx.x.x

Latest Version: v1.4.2
Release Notes: https://github.com/acdc-digital/solopro/releases

⸻

Contributing

We welcome contributions! Please fork the repo and follow the feature workflow:
	1.	git checkout -b feature/your-feature
	2.	pnpm dev (or appropriate command)
	3.	Implement and commit changes
	4.	Open a Pull Request

⸻

Resources
	•	GitHub Wiki: https://github.com/acdc-digital/solopro/wiki
	•	Project Board: https://github.com/users/acdc-digital/projects/10

⸻

License & Maintainers

License: MIT (For-Profit Open Source)

Maintained by: msimon@acdc.digital

Thank you for stopping by!