# DJW.terminal 网站启动指南

## 🚀 快速启动（推荐方式）

### 方式一：使用 VS Code 终端

1. **打开 VS Code**（你的代码编辑器）
2. **打开终端**：
   - 快捷键：`Ctrl + ~`（波浪号键，在 Tab 键上方）
   - 或点击菜单：终端 → 新建终端
3. **确保在项目目录**：
   ```bash
   # 如果不在项目目录，先进入
   cd "d:\编程文件\新个人网站"
   ```
4. **运行启动命令**：
   ```bash
   pnpm dev
   ```
5. **等待启动完成**，看到 `Ready in xx.xs` 后，访问 http://localhost:3000

---

### 方式二：使用 Windows PowerShell

1. **按 `Win + X`，选择 "Windows PowerShell" 或 "终端"**
2. **进入项目目录**：
   ```powershell
   cd "d:\编程文件\新个人网站"
   ```
3. **运行启动命令**：
   ```powershell
   pnpm dev
   ```
4. **在浏览器打开**：http://localhost:3000

---

### 方式三：使用文件资源管理器 + PowerShell

1. **打开文件夹**：`d:\编程文件\新个人网站`
2. **在地址栏输入 `cmd` 或 `powershell`，按回车**
3. **运行命令**：
   ```bash
   pnpm dev
   ```

---

## 📋 常用命令速查表

| 命令 | 作用 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm install` | 安装依赖（首次使用或依赖更新后）|

---

## ⚠️ 常见问题

### 问题1：提示 "pnpm 不是内部或外部命令"
**解决**：需要安装 pnpm
```powershell
# 使用 npm 安装 pnpm
npm install -g pnpm
```

### 问题2：提示 "node_modules missing"
**解决**：先安装依赖
```bash
pnpm install
```

### 问题3：端口 3000 被占用
**解决**：系统会自动尝试 3001、3002 等端口，看终端输出的实际端口号

### 问题4：如何停止服务器
**解决**：在终端中按 `Ctrl + C`，然后输入 `Y` 确认

---

## 🎯 启动流程图

```
打开终端
    ↓
进入目录：cd "d:\编程文件\新个人网站"
    ↓
运行：pnpm dev
    ↓
等待 "Ready" 提示
    ↓
浏览器访问：http://localhost:3000
```

---

## 💡 小技巧

1. **快捷启动**：在 VS Code 中按 `Ctrl + J` 快速打开/关闭终端
2. **自动补全**：输入命令时按 `Tab` 键自动补全
3. **历史命令**：按 `↑` 键查看之前输入过的命令
4. **多终端**：VS Code 可以开多个终端，方便同时执行不同操作

---

## 🔗 项目结构

```
新个人网站/
├── app/              # 页面代码
├── components/       # 组件（Logo、Header等）
├── public/           # 静态资源
├── package.json      # 项目配置
└── STARTUP_GUIDE.md  # 本文件
```

---

**记住核心命令**：`pnpm dev` 🚀
