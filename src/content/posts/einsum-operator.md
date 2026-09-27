---
title: Einsum Operator
published: 2025-04-08
draft: false
---

## einsum 是什么

einsum 全称 Einstein Summation，中文为爱因斯坦求和约定，其用来简洁的表示张量运算。

规则：

1. 字母表示维度
1. 相同字母表示对该维度进行求和，最后会被消去
1. 未消去的字母保留为输出维度

## 例子

- `"i,j->"`：向量点积
- `"ij,jk->ik"`：矩阵乘法
- `"bij,bjk->bik"`：带 batch 的矩阵乘法
- `"bqd,bkd->bqk"`：点积注意力
