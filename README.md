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

# soloist_pro
**Github Project:** https://github.com/users/acdc-digital/projects/10   
Soloist application professional development repository.

### Get Started with Commands
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
v0.1.0 - Setup Initial Scaffolding

### Feature Development Instructions:
1. git checkout -b new-branch
2. git add .
3. git commit -m "Updated Feature version to x.x.x"
4. push origin main
