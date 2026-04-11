# 组件 Review 清单

> [English version](./REVIEW_CHECKLIST.en.md)

按复杂度从低到高排列，无依赖的排前面，有依赖的排后面。

## 评审维度参考

- [ ] Props/Events/Slots 类型定义是否完整
- [ ] SFC 写法是否规范（script setup, defineProps, defineEmits, defineSlots）
- [ ] 样式是否使用 design token / CSS 变量
- [ ] 无障碍（ARIA）
- [ ] 测试覆盖
- [ ] Demo 是否可运行

详细规范见 [REVIEW_GUIDE.md](./REVIEW_GUIDE.md)

---

## Tier 0 — 基础设施（先 review，其他组件可能依赖）

| #   | 组件            | .vue | 行数 | 依赖 | Tests | Demos | 状态 |
| --- | --------------- | ---- | ---- | ---- | ----- | ----- | ---- |
| 0.1 | config-provider | 1    | 30   | —    | 1     | 0     | ☐    |
| 0.2 | theme           | 1    | 43   | —    | 1     | 0     | ☐    |
| 0.3 | wave            | 1    | 172  | —    | 0     | 0     | ☐    |

## Tier 0.5 — 内部组件 (\_internal)

| #     | 组件                    | .vue | 行数 | 说明          |
| ----- | ----------------------- | ---- | ---- | ------------- |
| 0.5.1 | \_internal/portal       | 1    | 70   | Teleport 封装 |
| 0.5.2 | \_internal/virtual-list | 1    | 112  | 虚拟滚动      |
| 0.5.3 | \_internal/trigger      | 1    | 294  | 浮层定位      |
| 0.5.4 | \_internal/date-panel   | 9    | 1107 | 日期面板      |

## Tier 1 — 原子组件，零依赖，≤100 行

| #   | 组件       | .vue | 行数 | Tests | Demos | 状态 |
| --- | ---------- | ---- | ---- | ----- | ----- | ---- |
| 1.1 | divider    | 1    | 45   | 4     | 6     | done |
| 1.2 | flex       | 1    | 50   | 4     | 6     | done |
| 1.3 | breadcrumb | 2    | 55   | 4     | 4     | ☐    |
| 1.4 | switch     | 1    | 91   | 3     | 5     | done |
| 1.5 | timeline   | 2    | 91   | 4     | 7     | ☐    |
| 1.6 | spin       | 1    | 94   | 4     | 7     | ☐    |
| 1.7 | space      | 2    | 96   | 3     | 8     | ☐    |
| 1.8 | tag        | 2    | 98   | 4     | 9     | ☐    |
| 1.9 | empty      | 3    | 100  | 4     | 5     | ☐    |

## Tier 2 — 原子组件，零依赖，100-200 行

| #    | 组件         | .vue | 行数 | Tests | Demos | 状态 |
| ---- | ------------ | ---- | ---- | ----- | ----- | ---- |
| 2.1  | alert        | 1    | 101  | 4     | 10    | ☐    |
| 2.2  | card         | 3    | 112  | 4     | 11    | ☐    |
| 2.3  | statistic    | 2    | 118  | 3     | 5     | ☐    |
| 2.4  | message      | 2    | 124  | 3     | 4     | ☐    |
| 2.5  | button       | 2    | 133  | 3     | 12    | ☐    |
| 2.6  | rate         | 1    | 136  | 4     | 5     | ☐    |
| 2.7  | badge        | 2    | 142  | 4     | 10    | ☐    |
| 2.8  | steps        | 2    | 148  | 4     | 15    | ☐    |
| 2.9  | qrcode       | 1    | 151  | 4     | 4     | ☐    |
| 2.10 | typography   | 4    | 152  | 3     | 8     | ☐    |
| 2.11 | segmented    | 1    | 158  | 4     | 5     | ☐    |
| 2.12 | notification | 2    | 164  | 3     | 4     | ☐    |
| 2.13 | avatar       | 2    | 168  | 4     | 7     | ☐    |
| 2.14 | result       | 8    | 172  | 4     | 9     | ☐    |
| 2.15 | descriptions | 2    | 179  | 4     | 6     | ☐    |
| 2.16 | grid         | 2    | 195  | 3     | 12    | ☐    |
| 2.17 | checkbox     | 2    | 196  | 3     | 4     | ☐    |

## Tier 3 — 中等复杂度，零外部组件依赖，200-400 行

| #    | 组件         | .vue | 行数 | 内部依赖   | Tests | Demos | 状态 |
| ---- | ------------ | ---- | ---- | ---------- | ----- | ----- | ---- |
| 3.1  | layout       | 5    | 200  | —          | 3     | 8     | ☐    |
| 3.2  | collapse     | 2    | 203  | —          | 4     | 9     | ☐    |
| 3.3  | watermark    | 1    | 203  | —          | 4     | 3     | ☐    |
| 3.4  | list         | 3    | 209  | —          | 4     | 6     | ☐    |
| 3.5  | affix        | 1    | 220  | —          | 4     | 3     | done |
| 3.6  | skeleton     | 5    | 241  | —          | 4     | 6     | ☐    |
| 3.7  | drawer       | 1    | 246  | portal     | 3     | 5     | ☐    |
| 3.8  | calendar     | 1    | 280  | date-panel | 3     | 4     | ☐    |
| 3.9  | radio        | 3    | 286  | —          | 3     | 5     | ☐    |
| 3.10 | anchor       | 2    | 294  | —          | 3     | 3     | ☐    |
| 3.11 | pagination   | 1    | 318  | —          | 3     | 6     | ☐    |
| 3.12 | progress     | 3    | 333  | —          | 4     | 17    | ☐    |
| 3.13 | input-number | 1    | 336  | —          | 3     | 4     | ☐    |
| 3.14 | float-button | 3    | 342  | —          | 4     | 5     | ☐    |
| 3.15 | tabs         | 2    | 378  | —          | 3     | 6     | ☐    |

## Tier 4 — 高复杂度，零外部组件依赖，400+ 行

| #    | 组件     | .vue | 行数 | 内部依赖 | Tests | Demos | 状态 |
| ---- | -------- | ---- | ---- | -------- | ----- | ----- | ---- |
| 4.1  | slider   | 1    | 414  | —        | 4     | 5     | ☐    |
| 4.2  | menu     | 6    | 420  | —        | 3     | 6     | ☐    |
| 4.3  | carousel | 1    | 438  | —        | 4     | 4     | ☐    |
| 4.4  | tour     | 2    | 459  | —        | 3     | 3     | ☐    |
| 4.5  | image    | 3    | 503  | —        | 4     | 4     | ☐    |
| 4.6  | transfer | 3    | 533  | —        | 4     | 5     | ☐    |
| 4.7  | form     | 2    | 537  | —        | 3     | 4     | ☐    |
| 4.8  | input    | 4    | 588  | —        | 3     | 9     | ☐    |
| 4.9  | upload   | 3    | 731  | —        | 4     | 5     | ☐    |
| 4.10 | tree     | 2    | 925  | —        | 3     | 9     | ☐    |

## Tier 5 — 有组件间依赖的复合组件

| # | 组件 | .vue | 行数 | 依赖组件 | 内部依赖 | Tests | Demos | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 5.1 | tooltip | 1 | 136 | — | trigger | 4 | 4 | ☐ |
| 5.2 | dropdown | 2 | 201 | tooltip(type) | — | 3 | 6 | ☐ |
| 5.3 | popover | 1 | 117 | tooltip(type) | trigger | 4 | 3 | ☐ |
| 5.4 | popconfirm | 1 | 163 | tooltip(type) | trigger | 4 | 3 | ☐ |
| 5.5 | mentions | 1 | 287 | — | trigger | 3 | 1 | ☐ |
| 5.6 | auto-complete | 1 | 338 | — | trigger, virtual-list | 3 | 1 | ☐ |
| 5.7 | time-picker | 1 | 245 | — | date-panel, trigger | 3 | 4 | ☐ |
| 5.8 | date-picker | 2 | 618 | — | — | 3 | 9 | ☐ |
| 5.9 | cascader | 1 | 637 | — | trigger | 3 | 1 | ☐ |
| 5.10 | tree-select | 1 | 686 | — | trigger | 3 | 1 | ☐ |
| 5.11 | select | 1 | 821 | — | trigger, virtual-list | 3 | 4 | ☐ |
| 5.12 | modal | 2 | 499 | — | — | 3 | 6 | ☐ |
| 5.13 | app | 1 | 32 | message, modal, notification | — | 3 | 1 | ☐ |
| 5.14 | table | 7 | 1517 | — | — | 3 | 12 | ☐ |

---

**总计：68 个组件 + 4 个内部组件，约 141 个 .vue 文件**

> 建议 review 顺序：Tier 0 → 0.5 → 1 → 2 → 3 → 4 → 5 每个 Tier 内从上到下即可
