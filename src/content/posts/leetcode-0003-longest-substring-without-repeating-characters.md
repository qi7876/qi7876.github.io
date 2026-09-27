---
title: Leetcode 0003 longest-substring-without-repeating-characters
published: 2024-03-15
draft: false
---

维护一个 hashmap，记录每个字符出现的最新位置，设 left、right 两个指针，然后 right 指针向右遍历字符串一遍：

1. 当前 right 处的字符在 hashmap 中有没有出现过
1. 如果出现过，那么 left 直接跳掉 max(left, 出现过的位置）
1. 如果没出现过，就不用动 left
1. 然后更新一下 hashmap 中 right 处字符的最新位置
1. 最后更新一下 ans
