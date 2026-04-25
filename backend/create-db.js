const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('locksy_x.sqlite');

db.serialize(() => {
  // Threats - Malicious URLs
  db.run(`CREATE TABLE IF NOT EXISTS threat_url (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT UNIQUE,
    reason TEXT,
    riskLevel TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Threats - Malicious Packages
  db.run(`CREATE TABLE IF NOT EXISTS threat_app (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    packageName TEXT UNIQUE,
    appName TEXT,
    riskLevel TEXT,
    reason TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Initial Data
  const stmtUrl = db.prepare("INSERT OR IGNORE INTO threat_url (domain, reason, riskLevel) VALUES (?, ?, ?)");
  stmtUrl.run("test-malicious.com", "Fishing sayt testi", "HIGH");
  stmtUrl.run("free-vpn-secure.org", "Ma'lumot o'g'irlovchi VPN", "CRITICAL");
  stmtUrl.run("get-rich-quick.net", "Moliyaviy piramida", "MEDIUM");
  stmtUrl.finalize();

  const stmtApp = db.prepare("INSERT OR IGNORE INTO threat_app (packageName, appName, riskLevel, reason) VALUES (?, ?, ?, ?)");
  stmtApp.run("com.android.vending.update", "Fake Play Store", "CRITICAL", "Tizim ruxsatlarini o'g'irlaydi");
  stmtApp.run("com.secure.vpn.free", "Zararli VPN", "HIGH", "Foydalanuvchi trafigini kuzatadi");
  stmtApp.finalize();

  console.log('Database initialized with professional kiber-threats.');
});

db.close();
