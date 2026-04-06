---
title: Leetcode 0076 minimum-window-substring
published: 2024-04-01
tags:
  - algorithm
draft: false
---
这道题目我们使用hashmap+双指针滑动窗口，和0438这道题的思路很像。

大体思路为：

1. 初始化mp_t和mp_w，利用字符串t来为mp_t赋值
2. 维护left和right两个指针，用来指定滑动窗口的范围；先对s进行一遍遍历，将left和right放到第一个子串字符处
3. 维护valid，用来确定mp_t和mp_w是否相同
4. 维护最小窗口大小w_size和起始点w_index
5. 进入循环：
    1. right不断向右，判断当前位置的字符是否在mp_t中，如果在，就将mp_w中对应字符的value+1，然后判断mp_w中的value是否等于mp_t中的value，如果是，就valid+1
    2. 判断valid是否等于mp_t的size，如果是，则判断当前window size是否小于w_size，如果是，则将w_size和w_index替换为当前值；然后进入更新环节，left++，同时维护好mp_w和valid，然后left指针不断向右，直到遇到另一个有效子串字符。
6. 最后，使用最终的w_size和w_index提取最短窗口子串，返回结果
