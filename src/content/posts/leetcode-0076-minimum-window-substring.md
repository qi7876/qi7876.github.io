---
title: Leetcode 0076 minimum-window-substring
published: 2024-04-01
draft: false
---

这道题目我们使用 hashmap+ 双指针滑动窗口，和 0438 这道题的思路很像。

大体思路为：

1. 初始化 mp_t 和 mp_w，利用字符串 t 来为 mp_t 赋值
1. 维护 left 和 right 两个指针，用来指定滑动窗口的范围；先对 s 进行一遍遍历，将 left 和 right 放到第一个子串字符处
1. 维护 valid，用来确定 mp_t 和 mp_w 是否相同
1. 维护最小窗口大小 w_size 和起始点 w_index
1. 进入循环：
   1. right 不断向右，判断当前位置的字符是否在 mp_t 中，如果在，就将 mp_w 中对应字符的 value+1，然后判断 mp_w 中的 value 是否等于 mp_t 中的 value，如果是，就 valid+1
   1. 判断 valid 是否等于 mp_t 的 size，如果是，则判断当前 window size 是否小于 w_size，如果是，则将 w_size 和 w_index 替换为当前值；然后进入更新环节，left++，同时维护好 mp_w 和 valid，然后 left 指针不断向右，直到遇到另一个有效子串字符。
1. 最后，使用最终的 w_size 和 w_index 提取最短窗口子串，返回结果
