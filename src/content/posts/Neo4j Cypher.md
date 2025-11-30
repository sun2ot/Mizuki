---
title: Neo4j Cypher
published: 2024-01-28
category: 教程
tags: [neo4j, sql, KG]
# updated: 2024-01-28 23:58:04
# categories: [教程, 软件工程]
---
[About Neo4j]( https://www.youtube.com/watch?v=xKVA2gL8WHs&list=PL6UwySlcwEYJ9BKIiCk2bMfd_JKXwDPQJ&index=1 ) 

## 核心概念

### Node

Neo4j 图形数据库中的数据实体称为节点。 Cypher 中使用括号 `( )` 引用节点。

```cypher
MATCH (n:Person {name:'Anna'})
RETURN n.born AS birthYear
```

在上述例子中：
- `Person` 是一个 `label`（标签）。标签就像标记一样，用于在数据库中查询特定节点。一个节点可以有多个标签，例如张三可以是 `Person`，也可以是 `Actor`
- 节点的 `name` 属性设置为 `Anna` 。属性在大括号 `{ }` 内定义，用于为节点提供特定信息，也可以查询这些信息并进一步提高精确定位数据的能力
- 赋予该节点变量 `n` 。变量允许在后续子句中引用指定的节点

---

### Relationship

图中的节点可以通过关系连接起来。关系必须具有起始节点、结束节点和一种类型（**三元组**）。关系在 Cypher 中用箭头（例如 `-->` ）表示，指示关系的方向。

```cypher
MATCH (:Person {name: 'Anna'})-[r:KNOWS WHERE r.since < 2020]->(friend:Person)
RETURN count(r) As numberOfFriends
```

与节点不同，关系模式中的信息必须用方括号 `[ ]` 括起来。

> 所以一个关系应该形如 `node1-[ var:type ]->node2` 或者 `node1<-[ var:type ]-node2`，
> 即用一个 `[ ]` 插在 `-->` 的两个横线中间

上面的查询示例表示：匹配 `type` (类型)为 ` KNOWS ` 且属性 ` since ` 小于 ` 2020 ` 的关系。并且该关系应该从名为 ` Anna ` 的 ` Person ` 节点指向任何其他的 ` Person ` 节点（赋予变量 ` friend ` ）。 

count() 函数在 ` RETURN ` 子句中用于统计前面 ` MATCH ` 子句中 ` r ` 变量绑定的所有关系（即有多少个朋友在 ` 2020 ` 之前就已经认识了）。

> `label` 和 `type` 从作用上都可以近似理解为“类型”。
> 但请注意：虽然节点可以有多个标签，但关系只能有一种类型。

---

### Path

图中的路径由连接的节点和关系组成。探索这些路径是 Cypher 的核心。

```cypher
MATCH (n:Person {name: 'Anna'})-[:KNOWS]-{1,5}(friend:Person WHERE n.born < friend.born)
RETURN DISTINCT friend.name AS olderConnections
```

此示例使用量化关系来查找距离 `5-hops` 的所有路径，仅遍历从起始节点 `Anna` 到其他旧 `Person` 类型（由 WHERE 子句定义）的 `KNOWS` 关系。DISTINCT 运算符用于确保 ` RETURN ` 子句仅返回唯一节点。


## Match

### 获取所有节点

通过指定具有单个节点且没有标签的模式，将返回图中的所有节点。

```cypher
MATCH (n)
RETURN n
```

查找具有特定标签的所有节点：

```cypher
MATCH (movie:Movie)
RETURN movie.title
```

### 查找相关节点

相关节点即具有关系连接的节点。符号 `--` 表示与关系相关，而**不考虑关系的类型或方向**。

```cypher
MATCH (director {name: 'Oliver Stone'})--(movie)
RETURN movie.title
```

返回 `Oliver Stone` 执导的所有电影

### 通过标签约束查找

匹配名为 `Oliver Stone` 的 `Person` 的连接的所有 `Movie` 节点。

```cypher
MATCH (:Person {name: 'Oliver Stone'})--(movie:Movie)
RETURN movie.title
```

也可以通过标签表达式进行约束

```cypher
MATCH (n:Movie|Person)
RETURN n.name AS name, n.title AS title
```

返回 `Movie` or `Person` 节点。

### 指向性查找

使用 `-->` 或者 `<--` 可以查找 **outgoing relationship**（出链、出关系）：

```cypher
MATCH (:Person {name: 'Oliver Stone'})-->(movie)
RETURN movie.title
```

返回通过出关系连接到 `Person` 节点且 `name` 属性设置为 `Oliver Stone` 的任何节点。

### 关系变量

可以向模式引入变量，用于过滤关系属性或返回关系。例如：

```cypher
MATCH (:Person {name: 'Oliver Stone'})-[r]->(movie)
RETURN type(r)
```

返回 `Oliver Stone` 中每个传出关系的类型。

### 匹配无向关系

当模式包含绑定关系，并且该关系模式未指定方向时，Cypher 将尝试在两个方向上匹配该关系。

```cypher
MATCH (a)-[:ACTED_IN {role: 'Bud Fox'}]-(b)
RETURN a, b
```



## Create

### 创建节点

```cypher
CREATE (charlie:Person:Actor {name: 'Charlie Sheen'}), (oliver:Person:Director {name: 'Oliver Stone'})
```

创建两个节点，绑定到变量 `charlie` 和 `oliver`，每个节点都有一个 `Person` 标签和 `name` 属性。此外，charlie 节点还具有标签 `Actor`，而 oliver 节点则分配有标签 `Director`。

> 点击 ▶ 执行或 `Ctrl + Enter`
> `shift + enter` 换行输入

---

### 创建关系

使用 `CREATE` 子句创建关系。与节点不同，关系始终只需要一种关系类型和方向。与节点类似，可以为关系分配属性和关系类型，并绑定到变量。

```cypher
CREATE (charlie:Person:Actor {name: 'Charlie Sheen'})-[:ACTED_IN {role: 'Bud Fox'}]->(wallStreet:Movie {title: 'Wall Street'})<-[:DIRECTED]-(oliver:Person:Director {name: 'Oliver Stone'})
```

此查询为 Charlie Sheen 和 Oliver Stone 创建 `Person` 节点，为 Wall Street 创建 `Movie` 节点。它还创建了它们之间的类型 `ACTED_IN` 和 `DIRECTED` 的关系。

> 注意两个箭头的指向，分别是 `-[ ]->` 和 `<-[ ]-`

#### 对已存在节点创建关系

```cypher
match (a:`品种`),(b:area) where a.name="爆裂葡萄" and b.location="(114,514)" create (a)-[r:plant_in]->(b) return r
```

试想，对已存在的节点添加关系，需要经历三步：
1. 找出头节点、尾节点 `match (a),(b) where ...`
2. 确定两者之间的关系 `relation type`
3. 建立关系 `create (a)-[r:type]->(b)`

> [!question] 如果直接节点、关系一把抓，一起创建，会发生什么？

```cypher
create (:`品种`{name:"爆裂葡萄"})-[:plant_in]->(:area{location:"(114,514)"})
```

执行上述操作后，会生成两个新节点与它们之间的关系，即使目标品种与位置已经存在，仍会执行节点创建操作，这很可能是我们不想要的。

## Delete

### 删除单个节点

```cypher
MATCH (n:Person {name: 'Tom Hanks'})
DELETE n
```

这将删除 `Person` 节点 `Tom Hanks` 

> 该查询只能在没有任何关系连接的节点上运行

还可以使用 `NODETACH DELETE` 子句删除单个节点。使用 `NODETACH` 关键字显式定义关系不会从节点分离并删除。 `NODETACH` 关键字是现有关键字 DETACH 的镜像。包含它在功能上与使用简单的 `DELETE` 相同。

```cypher
MATCH (n:Person {name: 'Tom Hanks'})
NODETACH DELETE n
```

> `NODETACH` 在 Neo4j 5.14 中引入

### 仅删除关系

删除关系的同时保持连接到该关系的节点不受影响。

```cypher
MATCH (n:Person {name: 'Laurence Fishburne'})-[r:ACTED_IN]->()
DELETE r
```

这将从 `Person` 节点 `Laurence Fishburne` 删除所有传出的 `ACTED_IN` 关系，而不删除该节点。

### 删除节点及其所有关系

要删除节点以及连接它们的任何关系，需使用 `DETACH DELETE` 子句。

```cypher
MATCH (n:Person {name: 'Carrie-Anne Moss'})
DETACH DELETE n
```

这将删除 `Person` 节点 `Carrie-Anne Moss` 以及与其连接的所有关系。

> 安全权限受限的用户可能不允许使用 `DETACH DELETE` 子句。有关详细信息，RTFM -> [细粒度访问控制](https://neo4j.com/docs/operations-manual/5/tutorial/access-control/#detach-delete-restricted-user)

### 删除所有节点和关系

```cypher
MATCH (n)
DETACH DELETE n
```

> 不适用于删除大量数据，但在试验小型示例数据集时很有用。当删除大量数据时，请使用 [CALL { …​ } IN TRANSACTIONS](https://neo4j.com/docs/cypher-manual/current/subqueries/call-subquery/#delete-with-call-in-transactions)


## Load CSV

### 介绍

- CSV 文件的 URL 是通过使用 `FROM` 指定的，后跟计算相关 URL 的任意表达式
- 需要使用 `AS` 为 CSV 数据指定变量
- CSV 文件可以存储在数据库服务器上，然后可以使用 `file:///` URL 进行访问。另外， `LOAD CSV` 还支持通过 HTTPS、HTTP 和 FTP 访问 CSV 文件
- `LOAD CSV` 支持使用 gzip 和 Deflate 压缩的资源。此外， `LOAD CSV` 支持本地存储的使用 ZIP 压缩的 CSV 文件
- `LOAD CSV` 将遵循 HTTP 重定向，但出于安全原因，它不会遵循更改协议的重定向，例如，从 HTTPS 转到 HTTP
- `LOAD CSV` 通常与子查询 [CALL { …​ } IN TRANSACTIONS](https://neo4j.com/docs/cypher-manual/current/subqueries/call-subquery/#delete-with-call-in-transactions) 结合使用
- `LOAD CSV` 由加载权限 [Load Privileges](https://neo4j.com/docs/operations-manual/5/authentication-authorization/load-privileges/) 调节


### 文件 URL 的配置

[dbms.security.allow_csv_import_from_file_urls]( https://neo4j.com/docs/operations-manual/5/configuration/configuration-settings/#config_dbms.security.allow_csv_import_from_file_urls )

使用 `LOAD CSV` 加载数据时 Cypher 是否允许使用 `file:///` URL 加载数据库服务器文件系统上的文件。**默认为 true**。

设置 `dbms.security.allow_csv_import_from_file_urls=false` 将完全禁用 `LOAD CSV` 对文件系统的访问。

---

[server.directories.import](https://neo4j.com/docs/operations-manual/5/configuration/configuration-settings#config_server.directories.import)

设置 `file:///` URL 的根目录。应将其设置为**相对于**数据库服务器上 Neo4j 安装路径的单个目录。所有从 `file:///` URL 加载的请求都将相对于指定的目录。

配置设置中设置的默认值是 `import`。这是一种安全措施，可防止数据库访问标准导入目录之外的文件，类似于 Unix ` chroot ` 的操作方式。将其设置为空字段将允许访问 Neo4j 安装文件夹中的所有文件。注释掉此设置将禁用安全功能，从而允许导入本地系统中的所有文件。**这绝对不推荐**。

文件 URL 将相对于 `server.directories.import` 目录进行解析。例如，文件 URL 通常类似于 `file:///myfile.csv` 或 `file:///myproject/myfile.csv`。请注意：

- 使用 `file:///` URL 时，空格和其他非字母数字字符需要进行 URL 编码
- 如果 `server.directories.import` 设置为默认值 `import`，则在 `LOAD CSV` 中使用上述 URL 将分别从 `<NEO4J_HOME>/import/myfile.csv` 和 `<NEO4J_HOME>/import/myproject/myfile` 读取.csv
- 如果设置为 /data/csv，则在 `LOAD CSV` 中使用上述 URL 将分别从 `<NEO4J_HOME>/data/csv/myfile.csv` 和 `<NEO4J_HOME>/data/csv/myproject/myfile.csv` 读取

> `server.directories.import` 仅适用于本地磁盘，不适用于远程 URL

### csv 文件格式

- 字符编码为 UTF-8
- 结束行终止取决于系统，例如，在 UNIX 上为 `\n` ，在 Windows 上为 `\r\n`
- 默认字段终止符是 `,`。可使用 `LOAD CSV` 命令中的选项 `FIELDTERMINATOR` 更改字段终止符
- CSV 文件中允许带引号的 `STRING` 值，并且在读取数据时会删除引号；
- `STRING` 引号的字符是双引号 `"` 
- 如果 `dbms.import.csv.legacy_quote_escaping` 设置为 `true` 的默认值，则 `\` 用作转义字符
- 双引号必须位于带引号的 `STRING` 中并使用转义字符或第二个双引号进行转义

---

- headers 最好设置英文，反正 `line.'名称'` 这种写法是会报错的

### 从 csv 导入数据

#### 无标题 csv

使用 `LOAD CSV` 将数据获取到查询中。然后使用 Cypher 的正常更新子句将其写入数据库。

```csv
1,ABBA,1992
2,Roxette,1986
3,Europe,1979
4,The Cardigans,1992
```

为 CSV 文件中的每一行创建一个带有 `Artist` 标签的新节点，CSV 文件中的两列被设置为节点上的属性：

```cypher
LOAD CSV FROM 'file:///artists.csv' AS line
CREATE (:Artist {name: line[1], year: toInteger(line[2])})
```

也可以导入**远程 csv**：

```cypher
LOAD CSV FROM 'https://data.neo4j.com/bands/artists.csv' AS line
CREATE (:Artist {name: line[1], year: toInteger(line[2])})
```

#### 有标题 csv

```csv
Id,Name,Year
1,ABBA,1992
2,Roxette,1986
3,Europe,1979
4,The Cardigans,1992
```

使用 `WITH HEADERS` 表示文件首行为列名，可以通过相应的列名称访问特定字段：

```cypher
LOAD CSV WITH HEADERS FROM 'file:///artists-with-headers.csv' AS line
CREATE (:Artist {name: line.Name, year: toInteger(line.Year)})
```

#### 自定义 csv 分隔符

有时，CSV 文件使用逗号以外的其他分隔符。此时可以使用 `FIELDTERMINATOR` 指定文件使用的分隔符。

> FIELDTERMINATOR = field terminator

如果前面加上 `\u`，则可以使用 unicode 字符编码的十六进制表示形式。编码必须用四位数字书写。例如，`\u003B` 相当于 `;` (分号)。

```csv
1;ABBA;1992
2;Roxette;1986
3;Europe;1979
4;The Cardigans;1992
```

```cypher
LOAD CSV FROM 'file:///artists-fieldterminator.csv' AS line FIELDTERMINATOR ';'
CREATE (:Artist {name: line[1], year: toInteger(line[2])})
```

### 导入大量数据

如果 CSV 文件包含大量行（接近数十万或数百万），则可以使用 `CALL { ... } IN TRANSACTIONS` 指示 Neo4j 在多行之后提交事务。这可以减少事务状态的内存开销。

也可以设置事务的速率，例如加上 `OF 500 ROWS` 表示 500 行为一个事务。

```cypher
LOAD CSV FROM 'file:///artists.csv' AS line
CALL {
  WITH line
  CREATE (:Artist {name: line[1], year: toInteger(line[2])})
} IN TRANSACTIONS OF 500 ROWS
```

### 导入包含转义字符的数据

当数据周围都有额外的引号，甚至值内还有转义引号时：

```csv
"1","The ""Symbol""","1992"
```

> `"The ""Symbol"""` = `The "Symbol"`

```cypher
LOAD CSV FROM 'file:///artists-with-escaped-char.csv' AS line
CREATE (a:Artist {name: line[1], year: toInteger(line[2])})
RETURN
  a.name AS name,
  a.year AS year,
  size(a.name) AS size
```

返回结果如下：

|      name      | year | size |
|:--------------:|:----:|:----:|
| 'The "Symbol"' | 1992 |  12  |

> 请注意，输出中的 `STRING` 值用引号 `'` 包裹

### 获取行号

对于某些情况，例如调试 csv 文件时，获取 `LOAD CSV` 正在运行的当前行号可能很有用。 

`linenumber()` 函数提供了该功能，或者如果在没有 `LOAD CSV` 上下文的情况下调用，则返回 `null` 。

```cypher
LOAD CSV FROM 'file:///artists.csv' AS line
RETURN linenumber() AS number, line
```

```
+---------------------------------------+
| number | line                         |
+---------------------------------------+
| 1      | ["1","ABBA","1992"]          |
| 2      | ["2","Roxette","1986"]       |
| 3      | ["3","Europe","1979"]        |
| 4      | ["4","The Cardigans","1992"] |
+---------------------------------------+
4 rows
```

### 获取绝对路径

与 `linenumber()` 类似，如果在没有 `LOAD CSV` 上下文的情况下调用，则返回 `null`。

```cypher
LOAD CSV FROM 'file:///artists.csv' AS line
RETURN DISTINCT file() AS path
```

由于 `LOAD CSV` 可以临时下载文件来处理，因此需要注意的是 `file()` 将始终返回**磁盘上的路径**。如果使用指向磁盘的 `file:///` URL 调用 `LOAD CSV`，`file()` 将返回相同的路径。


## FAQ

### 导出 cypher

```cypher
:history
```

然后导出即可