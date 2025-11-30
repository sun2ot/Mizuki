---
title: N-gram 语言模型
published: 2023-07-15
category: 笔记
tags: [深度学习, 模型, 算法]
# updated: 2023-07-15 08:34:10
# categories: [笔记, 深度学习]
# katex: True
---

## 概率

我们的目标是得到一个由 m 个单词组成的任意序列（即一个包含 m 个单词的句子）的概率：

$$
P(w_1, w_2, ..., w_m)
$$

第一步是利用链式法则（chain rule）将**联合概率转换成条件概率的连乘形式**：

$$
P(w_1, w_2, ..., w_m) = P(w_1)P(w_2|w_1)P(w_3|w_1,w_2)...P(w_m|w_1,...,w_{m-1})
$$

> 联合概率是指多个事件同时发生的概率，而条件概率是指在某个条件下事件发生的概率。将联合概率转换为条件概率的连乘形式是为了利用概率论中的条件概率规则，将复杂的问题分解为多个简单的条件概率计算。
> 
> 假设我们有一连串的随机事件 A, B, C, D，我们想计算它们同时发生的联合概率 P(A, B, C, D)。根据条件概率规则，我们可以将其写为：
> 
> P(A, B, C, D) = P(A) * P(B|A) * P(C|A, B) * P(D|A, B, C)
> 
> 这里，P(B|A) 表示在事件 A 发生的条件下事件 B 发生的概率，P(C|A, B) 表示在事件 A 和 B 发生的条件下事件 C 发生的概率，以此类推。


## 马尔可夫假设 The Markov Assumption

对于上文描述的概率，我们可以再简化一下这个模型。比如对于一个词，它并不需要前面所有的词作为条件概率，也就是说一个词可以只与其前面的若干个（≥0）词有关。

这就是**马尔可夫假设**，即某个单词出现的概率不再依赖于全部上下文，而是取决于离它最近的 n 个单词。

- 当 $n=1$ 时，N-gram 模型也叫 unigram 模型：
     $$P (w_1,..., w_m) = \displaystyle\prod_{i=1}^m P(w_i)$$
    在 unigram 模型中，我们假设一个句子出现的概率，等于其中每个单词单独出现的概率的乘积。这意味着**每个单词出现的概率之间相互独立**，即我们并不关心每个单词的上下文。


- 当 $n=2$ 时， bigram 模型：
    $$P (w_1,..., w_m) = \displaystyle\prod_{i=1}^m P(w_i|w_{i-1})$$
    在 bigram 模型中，我们假设句子中每个单词出现的概率都和它**前一个单词**出现的概率有关。


- 当 $n=3$ 时， trigram 模型：
    $$P (w_1,..., w_m) = \displaystyle\prod_{i=1}^m P(w_i|w_{i-2},w_{i-1})$$
    在 trigram 模型中，我们假设句子中每个单词出现的概率都和它**前两个单词**出现的概率有关。


## 最大似然估计

对于上文中的这些概率，如何进行计算？其实很简单，我们只需要一个大的用于训练的语料库（corpus），然后我们就可以根据语料库中各个单词的计数（counts），利用最大似然估计来估计该单词出现的概率。

对于 N-gram 模型，

$$
P(w_i|w_{i-n+1},...,w_{i-1}) = \frac {C(w_{i-n+1},...,w_i)} {C(w_{i-n+1},...,w_{i-1})}
$$

即，在前 n-1 个词构成的子句出现的条件下，第 n 个词为 $w_i$ 的概率，等于这 n 个词构成的语句在语料库中出现的次数，除以前 n-1 个词构成的子句出现的次数。


## 代码案例

```python
import torch
from torch import nn
import torch.nn.functional as F
from torch.autograd import Variable

# 莎士比亚的诗
test_sentence = """When forty winters shall besiege thy brow,
And dig deep trenches in thy beauty's field,
Thy youth's proud livery so gazed on now,
Will be a totter'd weed of small worth held:
Then being asked, where all thy beauty lies,
Where all the treasure of thy lusty days;
To say, within thine own deep sunken eyes,
Were an all-eating shame, and thriftless praise.
How much more praise deserv'd thy beauty's use,
If thou couldst answer 'This fair child of mine
Shall sum my count, and make my old excuse,'
Proving his beauty by succession thine!
This were to be new made when thou art old,
And see thy blood warm when thou feel'st it cold.""".split()

# 建立训练集
## 将单词三个分组，前面两个作为输入，最后一个作为预测的结果
## [(('When', 'forty'), 'winters'), ...]
trigram = [((test_sentence[i], test_sentence[i + 1]), test_sentence[i + 2])
           for i in range(len(test_sentence) - 2)]
# print(trigram[0])
# print(len(test_sentence), test_sentence.index('cold.'))


# 建立每个词与数字的编码，据此构建词嵌入
vocb = set(test_sentence) # 使用 set 将重复的元素去掉
word_to_idx = {word: i for i, word in enumerate(vocb)}  # {词语: 索引}
idx_to_word = {word_to_idx[word]: word for word in word_to_idx}  # {索引: 词语}



# 定义模型
## 模型的输入就是前面的两个词，输出就是预测单词(第三个词)的概率

CONTEXT_SIZE = 2  # 依据的单词数，表示我们希望由前面几个单词来预测这个单词，这里使用两个单词(trigram)
EMBEDDING_DIM = 10  # 词向量的维度，表示词嵌入的维度

class n_gram(nn.Module):
    def __init__(self, vocab_size, context_size=CONTEXT_SIZE, n_dim=EMBEDDING_DIM):
        super(n_gram, self).__init__()

        self.embed = nn.Embedding(vocab_size, n_dim)
        self.classify = nn.Sequential(
            nn.Linear(context_size * n_dim, 128),
            nn.ReLU(True),
            nn.Linear(128, vocab_size)
        )

    def forward(self, x):
        voc_embed = self.embed(x) # 得到词嵌入
        voc_embed = voc_embed.view(1, -1) # 将两个词向量拼在一起
        out = self.classify(voc_embed)
        return out


net = n_gram(len(word_to_idx))

# 交叉熵误差
criterion = nn.CrossEntropyLoss()
# 随机梯度下降
optimizer = torch.optim.SGD(net.parameters(), lr=1e-2, weight_decay=1e-5)

# 迭代 100 轮
for e in range(100):
    train_loss = 0
    for word, label in trigram:
        # 将两个词作为输入, 将索引转换为张量
        word = torch.LongTensor([word_to_idx[i] for i in word])
        label = torch.LongTensor([word_to_idx[label]])
        # 前向传播
        out = net(word)
        # 交叉熵误差
        loss = criterion(out, label)
        train_loss += loss.item()
        # 反向传播
        optimizer.zero_grad()  # 梯度归零
        loss.backward()  # 计算梯度
        optimizer.step()  # 更新模型参数
    if (e + 1) % 20 == 0:
        print('epoch: {}, Loss: {:.6f}'.format(e + 1, train_loss / len(trigram)))

# 评估模型
# 将神经网络模型设置为评估模式
net = net.eval()

# 随便找个数据，测试一下结果
word, label = trigram[19]
print('input: {}'.format(word))
print('label: {}'.format(label))
print()

word = torch.LongTensor([word_to_idx[i] for i in word])
out = net(word)
# a = out.max(1)

# 预测值的索引
pred_label_idx = out.max(1).indices.item()
# 预测的单词
predict_word = idx_to_word[pred_label_idx]
print('real word is "{}", predicted word is "{}"'.format(label, predict_word))
```

运行上述代码，得到下列输出结果

```
epoch: 20, Loss: 0.707435
epoch: 40, Loss: 0.150101
epoch: 60, Loss: 0.099814
epoch: 80, Loss: 0.080732
epoch: 100, Loss: 0.069862
input: ('so', 'gazed')
label: on

real word is "on", predicted word is "on"
```