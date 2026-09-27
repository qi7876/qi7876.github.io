---
title: Leetcode 0438 find-all-anagrams-in-a-string
published: 2024-03-18
draft: false
---

这里给出一个比较通用的解法。

此题依然使用滑动窗口，我们维护两个 hashmap，mp_p 用来存放字符串 p 的构成，mp_w 用来存放滑动窗口字符串的构成。

然后，算法逻辑大致是：

1. 使用字符串 p 初始化 mp_p，初始化 mp_w
1. 初始化 left（-1）和 right（0）两个指针，初始化 ans 列表，初始化 valid 变量用来判断滑动窗口和字符串 p 是否相同
1. 进入循环：
   1. 判断 right 处的字符是否在 mp_p 中，如果在，就加入到 mp_w，然后判断两个 hashmap 中这个字符的 value 是否相同，如果相同则 valid+1
   1. right 向右移动
   1. 判断目前的滑动窗口 size 是否大于 p size，如果大于，则 left++，并判断 left 处的字符是否在 p 中，如果在，则 mp_w 中对应字符的 value-1，然后继续判断两个 hashmap 中这个字符的 value 是否相同，如果相同则 valid-1
   1. 最后判断，目前的滑动窗口 size 是否等于 p size，valid 是否等于 mp_p size，如果满足，则将 left+1 加入到答案中
1. 返回 ans
