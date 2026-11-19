# 记账本 expense-tracker

一个移动端记账应用：账单的增删改查、类型/月份筛选、关键词搜索、收支统计，带 mock 登录与路由守卫。

## 技术栈及选型理由

- **React 19 + Vite 8 + TypeScript**：主流组合。Vite 秒级启动和热更新；TypeScript 在重构中拦截了大量类型连环错误（如 id 为 string、API 返回联动推导）
- **TanStack Query**：服务端状态管理。缓存、请求去重、失效后的自动重拉全部声明式处理，不需要手写 useEffect 竞态/loading/error 样板代码
- **React Router**：声明式路由。布局路由（Outlet 换页不换壳）、动态段、路由守卫（RequireAuth）
- **antd-mobile**：移动端组件库，Form / List / Dialog / Toast 开箱即用，且样式按需分片打包
- **axios + json-server**：axios 实例统一封装拦截器（token 注入）；json-server 不写后端代码就提供全量 CRUD REST 接口

## 运行方式

```bash
npm install        # 安装依赖
npm run api        # 启动本地 mock 接口（json-server，端口 3002，数据在 db.json）
npm run dev        # 启动前端开发服务器
npm run build      # 生产打包
```

## 项目结构

```
expense-tracker/
├── db.json                        # mock 数据源（json-server 读它生成 REST 接口）
├── vite.config.ts                 # Vite 配置（含 @ 路径别名）
├── package.json
└── src/
    ├── main.tsx                   # 项目入口：挂载根组件 + 全局 Provider（QueryClient / AuthProvider / BrowserRouter）
    ├── App.tsx                    # 路由表定义 + RequireAuth 守卫 + 路由懒加载
    ├── api/                       # 接口层：只管"怎么发请求"，不含任何组件逻辑
    │   ├── client.ts              # axios 实例：拦截器统一注入 Bearer token
    │   ├── records.ts             # 账单 CRUD 接口（含 json-server 方言转换）
    │   └── user.ts                # 登录接口（预留：将来接真实认证服务）
    ├── components/                # 跨页面复用的组件
    │   ├── Layout/                # 布局骨架：常驻导航 + Outlet 出口
    │   └── AddOrEditForm/         # 新增/编辑双模式表单（record prop 区分模式）
    ├── context/
    │   └── auth.tsx               # 登录态 Context：Provider 持有 token + useAuth 取电
    ├── hooks/                     # 自定义 Hook：组件逻辑的复用单元
    │   ├── useRecords.ts          # 账单的查询/变更 Hooks（封装 TanStack Query + 失效逻辑）
    │   ├── useDebounce.ts         # 防抖任意值，供搜索词延迟进 queryKey
    │   └── queryKeys.ts           # queryKey 工厂：缓存目录树的唯一定义处
    ├── pages/                     # 路由级页面，一个路由一个目录（index.tsx + module.scss）
    │   ├── RecordsPage/           # 账单列表（筛选 + 搜索）
    │   ├── RecordDetailPage/      # 账单详情（动态路由 :id）
    │   ├── AddRecordFormPage/     # 新增账单
    │   ├── EditRecordFormPage/    # 编辑账单（复用 AddOrEditForm）
    │   ├── StatisticsPage/        # 收支统计（纯派生计算）
    │   ├── LoginPage/             # 登录页（Layout 外，不受守卫）
    │   └── NotFoundPage.tsx       # 404 兜底（catch-all 路由）
    └── types/
        └── record.ts              # 账单相关 TS 类型（实体/提交载荷/查询参数）
```

## 技术亮点（复盘）

### 1. 服务端状态管理：queryKey 是缓存目录树

**场景**：账单数据在服务端，组件需要拉取、loading/error 兜底、增删改后自动刷新——手写 useEffect 要自己管竞态和重复请求。

**选择**：用 `queryKeys.ts` 工厂把 queryKey 组织成目录树：列表 `['record','list', params]`（params 含筛选和防抖搜索词），详情 `['record','detail', id]`。失效按前缀打：编辑成功同时失效列表树和详情树；删除只失效列表树，详情缓存交给 gcTime 回收。

**坑**：编辑保存后想"一次失效两棵树"，把两个 key 并进一个数组——前缀语义下什么都没失效，列表不更新。**失效参数是目录路径，不是 key 的集合**，两棵树必须各失效一次。

**收获**：统计页因为复用同一个 `lists()` 前缀，mutation 失效一次全站跟着刷新——新页面接入零失效代码。

### 2. 状态哲学：单一真相源的两处落地

**场景**：筛选条件刷新后要保留（可分享）；统计页数字不能和列表页各说各话。

**选择**：筛选状态只存 URL（`useSearchParams`），组件 state 全部从 URL 派生；统计页不存任何统计 state，收支/分类汇总全部是 `useMemo` 从 records 派生的计算产物。

**坑**：给月份筛选加过 `useState` 和 URL 双状态源——硬刷新后按钮文案和数据脱节；`searchParams.delete()` 改在只读快照上不生效。**解法**：删掉 state，读用 searchParams、写必须走 `setSearchParams` 函数式展开 prev。

**口诀**：URL 是唯一真相源，派生不存储——存了第二份数据就是同步 bug 的温床。

### 3. 登录态：Context 广播 + localStorage 持久的分工

**场景**：token 要被路由守卫、请求层、多个页面共享，且退出登录要立刻通知所有相关组件。

**选择**：运行时真相是 Context state（AuthProvider 惰性初始化从 localStorage 播种），localStorage 只负责"刷新后还记得"；axios 拦截器在 React 树外拿不到 state，读 localStorage 注入 Bearer——各管一段，谁也不越界。

**坑**：首版绕过 Context 直接读写 localStorage，auth.tsx 成了没人 import 的死代码，logout 没有任何组件感知；RequireAuth 的 `Navigate` 漏塞 `state.from`，登录后回不到原页。**解法**：两步接线（main.tsx 包 Provider + 组件 useAuth 取电），守卫跳转时塞 `state={{ from: location.pathname }}`。

**纪律**：页面里永远不直接摸 localStorage 的 token——写只属于 Provider，读只属于拦截器。
