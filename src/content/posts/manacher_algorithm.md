---
title: Manacher 算法解决最大回文字串
published: 2025-03-02
tags:
  - algorithm
draft: false
---
Manacher 算法是一种线性时间复杂度的算法，专门用于解决最长回文子串问题。它利用了回文串的对称性，以及已知的回文子串信息，来避免重复计算。  
## 解决步骤

1. **预处理：** 在字符串的每个字符之间，以及字符串的首尾插入特殊字符（例如 `#`），这样可以将奇数长度和偶数长度的回文串都统一处理为奇数长度。  
2. **构建** `p` **数组：** `p[i]` 表示以 `string[i]` 为中心的最长回文半径（包括 `string[i]` 本身）。  
3. **利用对称性：**  
	- 维护一个 `center` 和 `right`，表示当前已知的最长回文子串的中心和右边界。  
	- 对于每个`i`，如果 `i < right`，则可以利用对称性，得到 `p[i]` 的一个初始值：`p[i] = min(p[2 * center - i], right - i)`，然后再使用中心拓展法；如果 `i >= right` ，就直接在 `i` 处使用中心拓展法。  
	- 然后进行中心拓展法的运算，从 `p[i]` 的初始值开始，向两边扩展，更新 `p[i]`。  
	- 如果 `i + p[i] > right`，则更新 `center` 为 `i`，`right` 为 `i + p[i] - 1` 。  
	- 最后，对下一个 `i` 重复以上步骤。  
4. **找到最大值：** 遍历 `p` 数组，找到最大值，即可得到最长回文子串的长度和中心位置。  
5. **还原原字符串：** 根据最长回文子串的中心位置和长度，还原原字符串中的最长回文子串。  

## 代码实现 (C++)

```C++
#include <cstdint>
#include <iostream>
#include <string>
#include <vector>

std::string preprocess_string(std::string original_string) {
    std::string preprocessed_string = "#";
    for (char c: original_string) {
        preprocessed_string += c;
        preprocessed_string += "#";
    }
    return preprocessed_string;
}
int main() {
    int T;
    std::cin >> T;
    while (T--) {
        std::string original_string;
        std::cin >> original_string;
        std::string preprocessed_string = preprocess_string(original_string);
        int64_t length = preprocessed_string.length();
        int64_t center = 1, right = 1;
        std::vector < int64_t > p(length);
        p[0] = 0;
        p[length - 1] = 0; // Manacher
        for (int64_t i = 1; i < length - 2; i++) {
            if (i < right) { // Find mirror i and p value
                int64_t i_mirrored = 2 * center - i;
                int64_t p_mirrored = p[i_mirrored];
                if (i + p_mirrored - 1 <= right) {
                    p[i] = p_mirrored;
                    while ((i + p[i] - 1) < length - 1 && (i - p[i] + 1) > 0) {
                        if (p[i + p[i]] == p[i - p[i]]) {
                            p[i]++;
                        } else {
                            break;
                        }
                    }
                } else {
                    p[i] = right - i + 1;
                    while ((i + p[i] - 1) < length - 1 && (i - p[i] + 1) > 0) {
                        if (p[i + p[i]] == p[i - p[i]]) {
                            p[i]++;
                        } else {
                            break;
                        }
                    }
                }
            } else {
                p[i] = 1;
                while ((i + p[i] - 1) < length - 1 && (i - p[i] + 1) > 0) {
                    if (preprocessed_string[i + p[i]] == preprocessed_string[i - p[i]]) {
                        p[i]++;
                    } else {
                        break;
                    }
                }
            }
            if (i + p[i] - 1 > right) {
                center = i;
                right = i + p[i] - 1;
            }
        }
        int64_t max_p = 0;
        int64_t center_index = 0;
        for (int64_t i = 0; i < length - 1; i++) {
            if (p[i] > max_p) {
                max_p = p[i];
                center_index = i;
            }
        } // Translate to original string.
        int64_t start_index = (center_index + 1 - max_p) / 2;
        int64_t sub_string_length = max_p - 1;
        std::cout << original_string.substr(start_index, sub_string_length) << std::endl;
    }
}
```

## 复杂度分析

- **时间复杂度：** O(n)。
- **空间复杂度：** O(n)。