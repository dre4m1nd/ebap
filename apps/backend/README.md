# EBAP Backend

海大宿舍电费自动查询推送系统 - NestJS 后端

## 技术栈

- **Framework:** NestJS v11
- **Language:** TypeScript
- **ORM:** TypeORM
- **Database:** MySQL 8.0
- **Auth:** JWT (Passport)
- **Validation:** class-validator + class-transformer

## 目录结构

```
src/
├── common/                  # 公共基础设施
│   ├── decorators/          # 自定义装饰器 (@Public)
│   ├── filters/             # 异常过滤器 (统一错误响应)
│   ├── guards/              # JWT 守卫
│   └── interceptors/        # 响应拦截器 (统一成功响应)
├── config/                  # 配置模块
│   ├── database.config.ts   # 数据库配置
│   └── jwt.config.ts        # JWT 配置
├── modules/                 # 业务模块
│   ├── auth/                # 认证模块 (登录 + JWT)
│   ├── dorm/                # 宿舍管理 CRUD
│   ├── student/             # 学生管理 CRUD
│   ├── electric/            # 电费记录 + 图表
│   └── email/               # 邮件记录
├── app.module.ts            # 根模块
└── main.ts                  # 入口文件
```

## 数据库表

| 表名 | 说明 | 主要字段 |
|------|------|---------|
| `dorm` | 宿舍 | id, dorm_no, open_id, limit_light, limit_air, status |
| `student` | 学生 | id, dorm_id, nick_name, email, status |
| `electric_log` | 电费记录 | id, dorm_id, meter_type, left_money, left_ele, query_time |
| `email_log` | 邮件记录 | id, dorm_id, student_id, send_time |
| `user` | 管理员 | id, username, password, nickname |

## API 接口

### 认证

| Method | Path | Auth | 说明 |
|--------|------|------|------|
| POST | `/auth/login` | ❌ | 登录，返回 JWT token |

### 宿舍管理

| Method | Path | Auth | 说明 |
|--------|------|------|------|
| GET | `/dorm/list` | ❌ | 宿舍列表 (Header 下拉) |
| GET | `/dorm/page` | ❌ | 分页查询 |
| POST | `/dorm/add` | ✅ | 新增宿舍 |
| PUT | `/dorm/:id` | ✅ | 编辑宿舍 |
| DELETE | `/dorm/:id` | ✅ | 删除宿舍 |

### 学生管理

| Method | Path | Auth | 说明 |
|--------|------|------|------|
| GET | `/student/list` | ❌ | 按宿舍查询学生 |
| POST | `/student/add` | ✅ | 新增学生 |
| PUT | `/student/update` | ✅ | 编辑学生 |
| DELETE | `/student/:id` | ✅ | 删除学生 |

### 电费记录

| Method | Path | Auth | 说明 |
|--------|------|------|------|
| POST | `/electric/list` | ❌ | 电费记录分页 |
| GET | `/electric/chart` | ❌ | 图表数据 |

### 邮件记录

| Method | Path | Auth | 说明 |
|--------|------|------|------|
| POST | `/email/page` | ❌ | 邮件记录分页 |
| PUT | `/email/:id` | ✅ | 更新邮件记录 |

## 统一响应格式

```json
// 成功
{ "code": 200, "message": "success", "data": { ... } }

// 分页
{ "code": 200, "message": "success", "data": { "records": [...], "total": 100, "size": 10, "current": 1, "pages": 10 } }

// 错误
{ "code": 401, "message": "登录已过期", "data": null }
```

## 快速启动

```bash
# 1. 启动 MySQL
docker compose up -d

# 2. 安装依赖
cd apps/backend && npm install

# 3. 启动开发服务器
npm run start:dev

# 服务运行在 http://localhost:8080
```

## 环境变量

参见 `.env` 文件：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| SERVER_PORT | 8080 | 服务端口 |
| DB_HOST | localhost | 数据库地址 |
| DB_PORT | 3306 | 数据库端口 |
| DB_USERNAME | root | 数据库用户 |
| DB_PASSWORD | root123 | 数据库密码 |
| DB_DATABASE | ebap | 数据库名 |
| JWT_SECRET | (自定义) | JWT 密钥 |
| JWT_EXPIRES_IN | 7d | Token 有效期 |
| ADMIN_USERNAME | admin | 默认管理员用户名 |
| ADMIN_PASSWORD | admin123 | 默认管理员密码 |