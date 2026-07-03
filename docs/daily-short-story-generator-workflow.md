## 每日短篇故事生成器-总流程版

工作流信息：

- 名称：`每日短篇故事生成器-总流程版`
- Workflow ID：`7656274658651537408`
- Space ID：`7655233119397609472`
- 修复后发布版本：`v0.0.5`

### 节点结构

1. `100001` 开始
2. `210001` 故事参数分析器
3. `210002` 解析故事参数
4. `210003` 每日短篇故事生成器-API验证版
5. `210004` 每日短篇故事生成器
6. `900001` 结束

关键依赖：

- `100001.source_text` -> `210001.source_text`
- `210001.output` -> `210002.input`
- `210002.output.*` -> `210003` / `210004` / `900001`

### `210002.output` 的正确 schema

下游所有 `未定义` 问题，优先检查这里：

```json
{
  "type": "object",
  "name": "output",
  "schema": [
    { "name": "genre_mode", "type": "string" },
    { "name": "genre", "type": "string" },
    { "name": "theme_hint", "type": "string" },
    { "name": "style", "type": "string" },
    { "name": "target_audience", "type": "string" },
    { "name": "target_word_count", "type": "integer" },
    { "name": "must_include", "type": "string" },
    { "name": "must_avoid", "type": "string" }
  ]
}
```

如果这里被保存成：

```json
{
  "type": "object",
  "name": "output",
  "schema": []
}
```

那么 `210003`、`210004`、`900001` 里引用的这些字段都会显示 `未定义`：

- `output.genre_mode`
- `output.genre`
- `output.theme_hint`
- `output.style`
- `output.target_audience`
- `output.target_word_count`
- `output.must_include`
- `output.must_avoid`

### 本次根因

根因在前端保存链路的双重序列化：

1. `frontend/packages/workflow/playground/src/node-registries/json-parser/data-transformer.ts`
   `transformOnSubmit` 已经先把 JSON Parser 节点的 `outputs` 转成 DTO。
2. `frontend/packages/workflow/nodes/src/workflow-json-format.ts`
   全局 `formatNodeOnSubmit` 又把同一份 `outputs` 当成 ViewMeta 再转一次。
3. 第二次转换只看 `children`，不看 DTO 上已有的 `schema`，最终把对象输出保存成空数组。

### 代码修复

修复文件：

- `frontend/packages/workflow/nodes/src/workflow-json-format.ts`

修复规则：

- 有 `key` 的输出，按 ViewMeta 转 DTO。
- 没有 `key` 的输出，说明已经是 DTO，直接保留，避免二次转换。

### 回归测试

已补并验证：

- `frontend/packages/workflow/nodes/src/__tests__/workflow-json-format.test.ts`
- `frontend/packages/workflow/playground/src/node-registries/json-parser/data-transformer.test.ts`

### OpenAPI 修复步骤

1. `GET /v1/workflows/:workflow_id/detail?space_id=...`
   确认远端 draft 的 `210002.data.outputs[0].schema` 是否为空。
2. `PUT /v1/workflows/:workflow_id`
   只回填 `210002.output.schema`，并带上 `"validate": true`。
3. `POST /v1/workflows/:workflow_id/publish`
   发布新版本。
4. `POST /v1/workflow/run`
   做最小回归验证。

### 维护规则

以后再改这条 workflow，先看真实 draft，不要只看页面：

- `GET /v1/workflows/:workflow_id/detail`

只要页面再次出现 `未定义`，第一检查项就是：

- `210002.data.outputs[0].schema`

