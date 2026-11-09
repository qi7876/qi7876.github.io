---
title: 了却3年前的遗憾
published: 2026-11-10
---

突然想起刚上大学时，选了 c 语言课，当时作业中有一题尝试了很多次都没有过，最后不了了之。

3 年过去，想再尝试一下，了却这个遗憾，于是，在电科的 matu 上扒出来了这道题。

```
4_del
题号: 36
实现在字符串的内部删除字符串的函数del。函数原型如下：
void del(char * s,int n,int len) ;
在s指向的字符串中，从s第n个字符的位置开始，删除len个字符,结果通过指针s返回。
n是从0开始，到s的长度-1为止。从0开始，len=s的字符串长度时，全部删除，原字符串为空字符串。
注意：使用空格字符来表示字符串的结束。
例如source指向位置，依次保存了字符'a'，字符'b'，字符空格' '，字符'c'，则source指向的字符串为"ab"。
保存为functions.cpp。
遇到异常情况（s为null，n为负数等等），输出"error"；
否则不要随意输出，会视为错误。
例如：s为以空格结尾的字符串apple
调用del(s, 2, 2);之后，删除了数组下标以2开始的2个字符pl，结果为（以空格结尾）
ape
```

最后一次提交：

```
2023-10-24 22:52:40.0
score: 97
```

```cpp
// Created by Qi7 on 2023/10/16.

#include "stdio.h"
#include "string.h"

void del(char * String, int n, int len);

int main(void) {
/*    char UserInputString[100];
    int FirstChar, DeleteCharNum;
    scanf("%d", &FirstChar);
    scanf("%d", &DeleteCharNum);
    scanf("%s", UserInputString);

    del(UserInputString, FirstChar, DeleteCharNum);
    printf("%s", UserInputString);*/
    return 0;
}

void del(char * String, int n, int len) {
    int Length, i;
    if (String == NULL || n < 0 || len < 0) {
        printf("error\n");
        return;
    }
    for(i=0;i < n + len;i++) {
        if (String[i] == ' ') {
            printf("error\n");
            return;
        }
    }
    Length = (int)strlen(String);
    for (i = n; i < Length - n; i++) {
        String[i] = String[i + len];
    }
    for(;String[i]!='\0';i++) {
        String[i]=' ';
    }
}
```

现在看，之前写的代码真是太稚嫩了，改改

```cpp
// Created by Qi7 on 2023/10/16.
// modified by qi7876 on 2026-11-10

#include "stdio.h"
#include "string.h"

void del(char* str, int n, int len)
{
    if (str == NULL || n < 0 || len < 0) {
        printf("error\n");
        return;
    }
    int str_length = 0;
    while (str[str_length] != ' ') {
        str_length += 1;
    }

    if (n + len > str_length) {
        printf("error\n");
        return;
    }

    for (int i = n; i < str_length - len; i++) {
        str[i] = str[i + len];
    }

    str[str_length - len] = ' ';
}
```

完美结束，吃晚饭去了

```
2026-11-10 17:44:42.0
score: 100
```
