---
title: Leetcode 0438 find-all-anagrams-in-a-string
published: 2024-03-18
draft: false
---
这里给出一个比较通用的解法。

此题依然使用滑动窗口，我们维护两个hashmap，mp_p用来存放字符串p的构成，mp_w用来存放滑动窗口字符串的构成。

然后，算法逻辑大致是：
1. 使用字符串p初始化mp_p，初始化mp_w
2. 初始化left（-1）和right（0）两个指针，初始化ans列表，初始化valid变量用来判断滑动窗口和字符串p是否相同
3. 进入循环：
    1. 判断right处的字符是否在mp_p中，如果在，就加入到mp_w，然后判断两个hashmap中这个字符的value是否相同，如果相同则valid+1
    2. right向右移动
    3. 判断目前的滑动窗口size是否大于p size，如果大于，则left++，并判断left处的字符是否在p中，如果在，则mp_w中对应字符的value-1，然后继续判断两个hashmap中这个字符的value是否相同，如果相同则valid-1
    4. 最后判断，目前的滑动窗口size是否等于p size，valid是否等于mp_p size，如果满足，则将left+1加入到答案中
4. 返回ans