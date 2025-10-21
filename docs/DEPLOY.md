# 部署指南

## 🚀 快速部署到生产服务器 (47.111.132.236)

### 前置准备

1. **服务器要求**
   - Ubuntu 20.04+ / CentOS 7+
   - Node.js 18+
   - Python 3.9+
   - PostgreSQL 14+
   - Nginx
   - Redis

2. **本地准备**
   - SSH密钥配置
   - 服务器访问权限

---

## 📦 部署步骤

### 步骤1: 构建前端

```bash
cd ~/market-supervision-system/frontend
npm run build

# 构建产物在 dist/ 目录
# 文件大小应 < 500KB (已优化)
```

### 步骤2: 上传到服务器

```bash
#!/bin/bash
# 使用部署脚本

SERVER="root@47.111.132.236"
REMOTE_PATH="/var/www/market-supervision"

# 压缩构建产物
tar -czf dist.tar.gz -C dist .

# 上传到服务器
scp dist.tar.gz $SERVER:$REMOTE_PATH/

# 登录服务器解压
ssh $SERVER "cd $REMOTE_PATH && tar -xzf dist.tar.gz && rm dist.tar.gz"

echo "✅ 前端部署完成"
```

### 步骤3: 配置Nginx

在服务器上创建 Nginx 配置:

```nginx
# /etc/nginx/sites-available/market-supervision

server {
    listen 80;
    server_name 47.111.132.236;  # 或域名

    root /var/www/market-supervision;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_vary on;
    gzip_min_length 1024;

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理 (如果有后端)
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

启用配置:

```bash
sudo ln -s /etc/nginx/sites-available/market-supervision /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 步骤4: 配置HTTPS (可选但推荐)

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 步骤5: 部署后端 (如已开发)

```bash
# 在服务器上

cd /var/www/market-supervision-backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 运行数据库迁移
alembic upgrade head

# 使用 Supervisor 管理进程
sudo apt install supervisor

# 创建配置
sudo nano /etc/supervisor/conf.d/market-supervision-api.conf
```

Supervisor 配置:

```ini
[program:market-supervision-api]
directory=/var/www/market-supervision-backend
command=/var/www/market-supervision-backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/market-supervision-api.err.log
stdout_logfile=/var/log/market-supervision-api.out.log
```

启动服务:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start market-supervision-api
```

---

## 🔧 一键部署脚本

创建 `deploy.sh`:

```bash
#!/bin/bash

set -e  # 遇到错误立即退出

echo "🚀 开始部署市场监管系统..."

# 配置
SERVER="root@47.111.132.236"
SSH_KEY="/Users/lidder/Downloads/系统文件/zhezhe.pem"
REMOTE_PATH="/var/www/market-supervision"
PROJECT_PATH="$HOME/market-supervision-system"

# 1. 构建前端
echo "📦 构建前端..."
cd $PROJECT_PATH/frontend
npm run build

# 2. 压缩
echo "🗜️ 压缩文件..."
tar -czf /tmp/market-supervision-dist.tar.gz -C dist .

# 3. 上传
echo "⬆️ 上传到服务器..."
scp -i $SSH_KEY /tmp/market-supervision-dist.tar.gz $SERVER:/tmp/

# 4. 部署
echo "🔄 部署到服务器..."
ssh -i $SSH_KEY $SERVER <<'ENDSSH'
    # 备份旧版本
    if [ -d /var/www/market-supervision ]; then
        sudo mv /var/www/market-supervision /var/www/market-supervision.backup.$(date +%Y%m%d%H%M%S)
    fi

    # 创建目录
    sudo mkdir -p /var/www/market-supervision

    # 解压新版本
    sudo tar -xzf /tmp/market-supervision-dist.tar.gz -C /var/www/market-supervision/

    # 设置权限
    sudo chown -R www-data:www-data /var/www/market-supervision
    sudo chmod -R 755 /var/www/market-supervision

    # 清理
    rm /tmp/market-supervision-dist.tar.gz

    # 重载Nginx
    sudo nginx -t && sudo systemctl reload nginx

    echo "✅ 部署完成!"
ENDSSH

# 5. 清理本地临时文件
rm /tmp/market-supervision-dist.tar.gz

echo "🎉 部署成功!"
echo "访问地址: http://47.111.132.236/"
```

使用方法:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🧪 部署后验证

```bash
# 检查服务状态
curl -I http://47.111.132.236/

# 应该返回 200 OK

# 检查静态资源
curl -I http://47.111.132.236/assets/index.js

# 检查API (如有)
curl http://47.111.132.236/api/health

# 查看Nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 查看API日志 (如有)
sudo tail -f /var/log/market-supervision-api.out.log
```

---

## 📊 监控和维护

### 性能监控

```bash
# 安装监控工具
npm install -g pm2

# 使用PM2管理后端进程
pm2 start ecosystem.config.js
pm2 monit
```

### 日志管理

```bash
# 日志轮转配置
sudo nano /etc/logrotate.d/market-supervision

# 内容:
/var/log/market-supervision-api.*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
```

### 自动备份

```bash
# 定时备份脚本
sudo crontab -e

# 添加每日凌晨2点备份
0 2 * * * /opt/scripts/backup-market-supervision.sh
```

备份脚本:

```bash
#!/bin/bash
# backup-market-supervision.sh

BACKUP_DIR="/var/backups/market-supervision"
DATE=$(date +%Y%m%d)

mkdir -p $BACKUP_DIR

# 备份数据库
pg_dump market_supervision > $BACKUP_DIR/db-$DATE.sql

# 备份文件
tar -czf $BACKUP_DIR/files-$DATE.tar.gz /var/www/market-supervision

# 删除7天前的备份
find $BACKUP_DIR -type f -mtime +7 -delete

echo "✅ 备份完成: $DATE"
```

---

## 🔒 安全加固

1. **防火墙配置**

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **SSH安全**

```bash
# 禁用密码登录,只允许密钥
sudo nano /etc/ssh/sshd_config

PasswordAuthentication no
PermitRootLogin prohibit-password
```

3. **安装Fail2Ban**

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 🆘 故障排除

### 问题1: Nginx 502 Bad Gateway

```bash
# 检查后端API是否运行
sudo supervisorctl status market-supervision-api

# 检查端口占用
sudo netstat -tlnp | grep 8000

# 查看API日志
sudo tail -100 /var/log/market-supervision-api.err.log
```

### 问题2: 页面加载缓慢

```bash
# 检查Gzip是否启用
curl -H "Accept-Encoding: gzip" -I http://47.111.132.236/

# 检查静态资源缓存
curl -I http://47.111.132.236/assets/index.js | grep Cache-Control
```

### 问题3: 数据库连接失败

```bash
# 检查PostgreSQL状态
sudo systemctl status postgresql

# 检查连接
psql -U market_supervision_user -d market_supervision
```

---

**维护联系人**: Claude Code
**紧急联系**: 查看项目README
**最后更新**: 2025-10-21
