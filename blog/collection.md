# Laravel 集合(Collection)源代码分析

## 简介

Illuminate\Support\Collection 类为处理数组数据提供了流式、方便的封装。处理一组数组时，帮助你快捷的解决实际问题。其实Laravel的内核大部分的参数传递都用到了集合。


## collection集合类实现了6个接口和引用了1个特性
```php
<?php
class Collection implements ArrayAccess, Arrayable, Countable, IteratorAggregate, Jsonable, JsonSerializable
{
    use Macroable;
```

 接口
-  1、php内置的ArrayAccess 数组式访问接口
-  2、自定义的Arrayable 集合转化成数组接口
-  3、php内置的Countable 统计对象的public属性的总数接口
-  4、php内置的IteratorAggregate 迭代器接口
-  5、自定义的Jsonable 集合转json接口
-  6、php内置的JsonSerializable 对对象的public属性进行json序列化接口

特性
- 1、利用 Macroable Trait 对collection进行扩展功能

## 常用方法
### 1、all方法，返回本对象包装的数组
```php
   /**
     * 返回本对象集合
     * @return array
     */
    public function all()
    { 
        return $this->items;
    }

```
### 2、count方法，返回本集合数量
```php
   /**
     * 返回本集合数量
     * @return array
     */
    public function all()
    { 
        return $this->items;
    }

```
### 3、sum方法，返回集合内所有项目的总和
```php
   /**
     * 返回集合内所有项目的总和
     * @param  callable|string|null  $callback
     * @return mixed
     */
    public function sum($callback = null)
    {
        // 判断$callback为null返回集合内所有项目的总和
        if (is_null($callback)) {
            return array_sum($this->items);
        }
        //调用valueRetriever方法处理$callback参数，若$callback参数是一个闭包，返回的数据是一个闭包。若 $callback 参数是字符串，返回的闭包可以用来检索键名为$callback的数据
        $callback = $this->valueRetriever($callback);
        return $this->reduce(function ($result, $item) use ($callback) {
            // 调用reduce方法处理每一个数据，返回闭包处理后的数据
            return $result + $callback($item);
        }, 0);
    }

```
### 4、average & avg方法，计算集合项的平均值
```php
/**
     * 计算集合项的平均值
     * @param  callable|string|null  $callback
     * @return mixed
     */
    public function avg($callback = null)
    {
        //返回集合数量
        if ($count = $this->count()) {
            // 返回计算后的集合项平均值，公试：集合内所有项目的总和 / 集合数量
            return $this->sum($callback) / $count;
        }
    }

```
### 5、chunk方法，将集合拆成多个指定大小的小集合
```php
 /**
     * 将集合拆成多个指定大小的小集合
     * @param  int  $size
     * @return static
     */
    public function chunk($size)
    {
        // $size为小于等于0时，返回当前对象实例
        if ($size <= 0) {
            return new static;
        }

        $chunks = [];
        // 遍历将一个集合分割成多个小尺寸的小集合
        foreach (array_chunk($this->items, $size, true) as $chunk) {
           // 每个小集合new 个实例
            $chunks[] = new static($chunk);
        }
        // 大集合new 个实例
        return new static($chunks);
    }

```
### 6、each方法，迭代集合中的内容并将其传递到回调函数中
```php
/**
     * 迭代集合中的内容并将其传递到回调函数中
     * @param  callable  $callback
     * @return $this
     */
    public function each(callable $callback)
    {
        //遍历集合中的内容并将其传递到回调函数中
        foreach ($this->items as $key => $item) {
            // 回调函数处理后的结果等于false跳出循环
            if ($callback($item, $key) === false) {
                break;
            }
        }

        return $this;
    }
```
### 7、filter方法，使用给定的回调函数过滤集合的内容，只留下那些通过给定真实测试的内容
```php
   /**
     *使用给定的回调函数过滤集合的内容，只留下那些通过给定真实测试的内容
     * @param  callable|null  $callback
     * @return static
     */
    public function filter(callable $callback = null)
    {
        // 有回调函数调用 Arr类中where方法回调过滤处理,实际调用array_filter处理，多传个回调函数处理而已，
        if ($callback) {
            return new static(Arr::where($this->items, $callback));
        }
        // 跟上面一样，只不过少个回调函数而已
        return new static(array_filter($this->items));
    }
```
### 8、sortBy方法，通过给定的键对集合进行排序。排序后的集合保留了原数组键
```php
    /**
     * 通过给定的键对集合进行排序。排序后的集合保留了原数组键
     * @param  callable|string  $callback
     * @param  int  $options
     * @param  bool  $descending
     * @return static
     */
    public function sortBy($callback, $options = SORT_REGULAR, $descending = false)
    {
        $results = [];
        // 处理 $callback 参数，返回一个闭包
        $callback = $this->valueRetriever($callback);

        // 遍历集合中所有内容并将其传递到回调函数中
        foreach ($this->items as $key => $value) {
            $results[$key] = $callback($value, $key);
        }

        //对$results的值进行排序
        $descending ? arsort($results, $options)
            : asort($results, $options);

        //排序后的集合保持原有数组索引
        foreach (array_keys($results) as $key) {
            $results[$key] = $this->items[$key];
        }
       // 实例化返回集合
        return new static($results);
    }
```
### 9、first方法，返回集合中的第一个元素
```php
/**
     * 返回集合中的第一个元素
     * @param  callable|null  $callback
     * @param  mixed  $default
     * @return mixed
     */
    public function first(callable $callback = null, $default = null)
    {
        // 若有回调函数，则调用回调函数处理每一个数据，返回符合条件的第一个元素
        // 若无回调函数，则返回集合项中的第一个元素
        return Arr::first($this->items, $callback, $default);
    }

```
### 10、groupBy方法，根据给定的键对集合内的项目进行分组
```php
  /**
     * 根据给定的键对集合内的项目进行分组
     * @param  callable|string  $groupBy
     * @param  bool  $preserveKeys
     * @return static
     */
    public function groupBy($groupBy, $preserveKeys = false)
    {
        // 处理 $callback 参数，返回一个闭包
        $groupBy = $this->valueRetriever($groupBy);

        $results = [];
       // 遍历集合中所有内容并将其传递到回调函数中
        foreach ($this->items as $key => $value) {
            $groupKeys = $groupBy($value, $key);

            //判断是否数组
            if (! is_array($groupKeys)) {
                $groupKeys = [$groupKeys];
            }
            // 遍历集合项的key
            foreach ($groupKeys as $groupKey) {
                $groupKey = is_bool($groupKey) ? (int) $groupKey : $groupKey;

                //判断key是否存在
                if (! array_key_exists($groupKey, $results)) {
                    $results[$groupKey] = new static;
                }
                //根据给定的键对集合内的项目进行分组
                $results[$groupKey]->offsetSet($preserveKeys ? $key : null, $value);
            }
        }
        // new 实例，返回当前集合
        return new static($results);
    }
```
