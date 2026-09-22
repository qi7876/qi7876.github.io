---
title: Leetcode 0003 longest-substring-without-repeating-characters
published: 2024-03-15
draft: false
---
维护一个hashmap，记录每个字符出现的最新位置，设left、right两个指针，然后right指针向右遍历字符串一遍：

1. 当前right处的字符在hashmap中有没有出现过
2. 如果出现过，那么left直接跳掉max(left, 出现过的位置)
3. 如果没出现过，就不用动left
4. 然后更新一下hashmap中right处字符的最新位置
5. 最后更新一下ans