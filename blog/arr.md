# Laravel 数组(Arr)源代码分析

## 简介
[Illuminate\Support\Arr](https://github.com/hhpp33/laravel/blob/master/vendor/laravel/framework/src/Illuminate/Support/Arr.php) 类为辅助函数。处理一组数组时，帮助你快捷的解决实际问题。


## 常用方法
### 1、Arr::accessible() 方法会检查给定的值是否数组或数组接口
#### 代码分析
```php
    /**
    *验证给定的值是否合法
    *
    * @param  mixed  $value
    * @return bool
    */
    public static function accessible($value)
    {
        //判断给定的值是否数组或数组接口
       return is_array($value) || $value instanceof ArrayAccess;
    }
```
#### 案例
```php
    $isAccessible = Arr::accessible(['a' => 1, 'b' => 2]);
    // true
    $isAccessible = Arr::accessible(new Collection);
    // true
    $isAccessible = Arr::accessible('abc');
    // false
    $isAccessible = Arr::accessible(new stdClass);
    // false
```
### 2、Arr::add() 方法会对数组添加一个元素
#### 代码分析
```php
    /**
     * 对数组添加一个元素
     * 
     * @param  array   $array
     * @param  string  $key
     * @param  mixed   $value
     * @return array
     */
    public static function add($array, $key, $value)
    {
        //若元素不存在，则添加元素
        if (is_null(static::get($array, $key))) {
            static::set($array, $key, $value);
        }
         //返回数据
        return $array;
    }
```
#### 案例
```php
     $array = Arr::add(['name' => 'Desk'], 'price', 100);
     // ['name' => 'Desk', 'price' => 100]
     $array = Arr::add(['name' => 'Desk', 'price' => null], 'price', 100);
     // ['name' => 'Desk', 'price' => 100]
```
### 3、Arr::collapse() 将多个数组合并成一个
#### 代码分析
```php
    /**
    * 将多个数组合并成一个
    *
    * @param  array  $array
    * @return array
    */
    public static function collapse($array)
    {
       $results = [];
       // 遍历数据
       foreach ($array as $values) {
           if ($values instanceof Collection) {// 判断是否集合
               $values = $values->all();
           } elseif (! is_array($values)) {// 判断是否集合，若是非数组跳出循环
               continue;
           }
           //合并数据
           $results = array_merge($results, $values);
       }
    
       return $results;
    }
```
#### 案例
```php
     $array = Arr::collapse([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
     // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```
### 4、Arr::crossJoin() 交叉连接给定数组，返回一个包含所有排列组合的笛卡尔乘积
#### 代码分析
```php
     /**
      * 交叉连接给定数组，返回一个包含所有排列组合的笛卡尔乘积
      *
      * @param  array  ...$arrays
      * @return array
      */
     public static function crossJoin(...$arrays)
     {
         //定义一个二维数组
         $results = [[]];
         //遍历参数，参数是多个数组
         foreach ($arrays as $index => $array) {
             $append = [];
    
             foreach ($results as $product) {
                 //参数数组
                 foreach ($array as $item) {
                     //每个参数的键和值复制一份给$product
                     $product[$index] = $item;
                     //$product添加到$append
                     $append[] = $product;
                 }
             }
             //最后把$append賦值给$results
             $results = $append;
         }
    
         return $results;
     }
```
#### 案例
```php
    $matrix = Arr::crossJoin([1, 2], ['a', 'b']);
    /*
        [
            [1, 'a'],
            [1, 'b'],
            [2, 'a'],
            [2, 'b'],
        ]
    */
```
### 5、Arr::divide() 返回两个数组，一个包含原数组的所有键，另外一个包含原数组的所有值
#### 代码分析
```php
    /**
      * 返回两个数组，一个包含原数组的所有键，另外一个包含原数组的所有值
      *
      * @param  array  $array
      * @return array
      */
     public static function divide($array)
     {
         return [array_keys($array), array_values($array)];
     }
```
#### 案例
```php
    [$keys, $values] = Arr::divide(['name' => 'Desk']);
    // $keys: ['name']
    // $values: ['Desk']
```
### 6、Arr::dot() 使用「.」号将将多维数组转化为一维数组
#### 代码分析
```php
     /**
      * 使用「.」号将将多维数组转化为一维数组
      *
      * @param  array   $array
      * @param  string  $prepend
      * @return array
      */
     public static function dot($array, $prepend = '')
     {
         $results = [];
         //遍历数组
         foreach ($array as $key => $value) {
             //判断是否数组并非空值
             if (is_array($value) && ! empty($value)) {
                 //递归处理将结果合并到$results，$prependq为键前綴
                 $results = array_merge($results, static::dot($value, $prepend.$key.'.'));
             } else {
                 //非数组直接賦值给$results
                 $results[$prepend.$key] = $value;
             }
         }
    
         return $results;
     }
```
#### 案例
```php
    $array = ['products' => ['desk' => ['price' => 100]]];
    $flattened = Arr::dot($array);
    // ['products.desk.price' => 100]
```
### 7、Arr::except() 从数组中移除给定键值对
#### 代码分析
```php
    /**
     * 从数组中移除给定键值对
     *
     * @param  array  $array
     * @param  array|string  $keys
     * @return array
     */
    public static function except($array, $keys)
    {
        //移除给定键值对，$keys为数组
        static::forget($array, $keys);
    
        return $array;
    }
```
#### 案例
```php
    $array = ['name' => 'Desk', 'price' => 100];
    $filtered = Arr::except($array, ['price']);
    // ['name' => 'Desk']
```
### 8、Arr::exists() 检查给定键在数组中是否存在
#### 代码分析
```php
     /**
      * 检查给定键在数组中是否存在
      *
      * @param  \ArrayAccess|array  $array
      * @param  string|int  $key
      * @return bool
      */
     public static function exists($array, $key)
     {    //判断是否数组接口
         if ($array instanceof ArrayAccess) {
             //调用数组接口类offsetExists方法判断当前key是否存在
             return $array->offsetExists($key);
         }
         return array_key_exists($key, $array);
     }
```
#### 案例
```php
    $array = ['name' => 'John Doe', 'age' => 17];
    $exists = Arr::exists($array, 'name');
    // true
    $exists = Arr::exists($array, 'salary');
    // false
```
### 9、Arr::first() 返回使用给定闭包对数组进行过滤第一个元素
#### 代码分析
```php
    /**
     * 返回使用给定闭包对数组进行过滤第一个元素
     *
     * @param  array  $array
     * @param  callable|null  $callback
     * @param  mixed  $default
     * @return mixed
     */
    public static function first($array, callable $callback = null, $default = null)
    {
        //判断回调函数是否为null
        if (is_null($callback)) {
            //若是空值直接返回
            if (empty($array)) {
                return value($default);
            }
            //若是数组直接返回
            foreach ($array as $item) {
                return $item;
            }
        }
        //若有回调函数则回调处理
        foreach ($array as $key => $value) {
            //返回符合的条件第一元素
            if (call_user_func($callback, $value, $key)) {
                return $value;
            }
        }
        //若以上条件都不满足，则返回给定的默认值
        return value($default);
    }
```
#### 案例
```php
    $array = [100, 200, 300];
    $first = Arr::first($array, function ($value, $key) {
        return $value >= 150;
    });
    // 200
```
### 10、Arr::last() 返回使用给定闭包对数组进行过滤最后一个元素
#### 代码分析
```php
    /**
    * 返回使用给定闭包对数组进行过滤最后一个元素
    *
    * @param  array  $array
    * @param  callable|null  $callback
    * @param  mixed  $default
    * @return mixed
    */
    public static function last($array, callable $callback = null, $default = null)
    {
       //若无回调函数，则返回当前数组最后一个元素
       if (is_null($callback)) {
           return empty($array) ? value($default) : end($array);
       }
       //若有回调函数，则返回当前数组符合条件最后一个元素
       return static::first(array_reverse($array, true), $callback, $default);
    }
```
#### 案例
```php
    $array = [100, 200, 300, 110];
    $last = Arr::last($array, function ($value, $key) {
        return $value >= 150;
    });
    // 300
```
### 11、Arr::flatten() 多维数组转化为一维数组,指定过滤数组的层级
#### 代码分析
```php
    /**
    * 多维数组转化为一维数组,指定过滤数组的层级
    *
    * @param  array  $array
    * @param  int  $depth
    * @return array
    */
    public static function flatten($array, $depth = INF)
    {
      $result = [];
      //遍历数据
      foreach ($array as $item) {
          //若有集合，则返回集合元素，否则返回数组
          $item = $item instanceof Collection ? $item->all() : $item;
    
          if (! is_array($item)) {//若不是数组，则将$item添加到$result数据
              $result[] = $item;
          } elseif ($depth === 1) {//若指定的过滤数组的层级是1，则获取当前元素的所有值将合并到$result数组
              $result = array_merge($result, array_values($item));
          } else {//否则递归处理将结果合并到$result数组
              $result = array_merge($result, static::flatten($item, $depth - 1));
          }
      }
    
      return $result;
    }
```
#### 案例
```php
    $array = ['name' => 'Joe', 'languages' => ['PHP', 'Ruby']];
    $flattened = Arr::flatten($array);
    // ['Joe', 'PHP', 'Ruby']
    // 300
```
### 12、Arr::forget() 使用「.」号从嵌套数组中移除给定键值对
#### 代码分析
```php
    /**
      * 使用「.」号从嵌套数组中移除给定键值对
      *
      * @param  array  $array
      * @param  array|string  $keys
      * @return void
      */
     public static function forget(&$array, $keys)
     {
         $original = &$array;
         //转化成数组
         $keys = (array) $keys;
          //若$keys数组为0，则直接返回
         if (count($keys) === 0) {
             return;
         }
         //遍历数组
         foreach ($keys as $key) {
             // if the exact key exists in the top-level, remove it
             // 跳出本次循环，并删除当前元素
             if (static::exists($array, $key)) {
                 unset($array[$key]);
    
                 continue;
             }
             //以“.”符合分割成数组
             $parts = explode('.', $key);
    
             $array = &$original;
    
             while (count($parts) > 1) {
                 //删除数组中的第一个元素，并返回被删除元素的值
                 $part = array_shift($parts);
                 //若$array[$part]存在并为数组，则将$array[$part]賦值给$array
                 //否则跳出本循环
                 if (isset($array[$part]) && is_array($array[$part])) {
                     $array = &$array[$part];
                 } else {
                     continue 2;
                 }
             }
             //删除数组中的第一个元素，并返回被删除元素的值
             //删除被删除元素的元素
             unset($array[array_shift($parts)]);
         }
     }
```
#### 案例
```php
    $array = ['products' => ['desk' => ['price' => 100]]];
    Arr::forget($array, 'products.desk');
    // ['products' => []]
```
### 13、Arr::get() 使用「.」号从嵌套数组中获取值
#### 代码分析
```php
    /**
      * 使用「.」号从嵌套数组中获取值
      *
      * @param  \ArrayAccess|array  $array
      * @param  string  $key
      * @param  mixed   $default
      * @return mixed
      */
     public static function get($array, $key, $default = null)
     {
         //若当前值不是数组，则返回给定的默认值
         if (! static::accessible($array)) {
             return value($default);
         }
         //若给定的键为null，则返回当前数组
         if (is_null($key)) {
             return $array;
         }
         //若元素存在 ，则返回当前元素
         if (static::exists($array, $key)) {
             return $array[$key];
         }
         //若给定的键无“.”符号并当前元素存在，则返回当元素，不存在返回默认值
         if (strpos($key, '.') === false) {
             return $array[$key] ?? value($default);
         }
        // 以"."符号分割成为数数组，遍历数据
         foreach (explode('.', $key) as $segment) {
             //若$array是数据，并且当前元素存在，则将当前元素赋值给$array，否则返回默认值
             if (static::accessible($array) && static::exists($array, $segment)) {
                 $array = $array[$segment];
             } else {
                 return value($default);
             }
         }
    
         return $array;
     }

```
#### 案例
```php
    $array = ['products' => ['desk' => ['price' => 100]]];
    $price = Arr::get($array, 'products.desk.price');
    // 100
```
### 14、Arr::has() 使用「.」检查给定数据项是否在数组中存在
#### 代码分析
```php
    /**
     * 使用「.」检查给定数据项是否在数组中存在
     *
     * @param  \ArrayAccess|array  $array
     * @param  string|array  $keys
     * @return bool
     */
    public static function has($array, $keys)
    {
        //若给定的键为null，则返回false
        if (is_null($keys)) {
            return false;
        }
        //强制转化为数组
        $keys = (array) $keys;
    
        if (! $array) {
            return false;
        }
        //若为空数组，则返回false
        if ($keys === []) {
            return false;
        }
    
        //遍历数组
        foreach ($keys as $key) {
            $subKeyArray = $array;
            //若当前元素存在，则跳出本次循环
            if (static::exists($array, $key)) {
                continue;
            }
            //以"."符号分割为数组
            foreach (explode('.', $key) as $segment) {
                //若$subKeyArray为数组并当前元素存在，则赋值给$subKeyArray，则返回false
                if (static::accessible($subKeyArray) && static::exists($subKeyArray, $segment)) {
                    $subKeyArray = $subKeyArray[$segment];
                } else {
                    return false;
                }
            }
        }
    
        return true;
    }

```
#### 案例
```php
    $array = ['product' => ['name' => 'Desk', 'price' => 100]];
    $contains = Arr::has($array, 'product.name');
    // true
    $contains = Arr::has($array, ['product.price', 'product.discount']);
    // false
```
### 15、Arr::set() 用于在嵌套数组中使用「.」号设置值
#### 代码分析
```php
    /**
      * 用于在嵌套数组中使用「.」号设置值
      *
      * @param  array   $array
      * @param  string  $key
      * @param  mixed   $value
      * @return array
      */
     public static function set(&$array, $key, $value)
     {
         // 若给定的键为null，则返回给定的设置值
         if (is_null($key)) {
             return $array = $value;
         }
         // 以"."符号分割为数组
         $keys = explode('.', $key);
         //循环$keys
         while (count($keys) > 1) {
             //删除数组中的第一个元素，并返回被删除元素的值
             $key = array_shift($keys);
    
         
             //若当前元素不存在或不是数组，则将$array[$key]赋值为空数组
             if (! isset($array[$key]) || ! is_array($array[$key])) {
                 $array[$key] = [];
             }
    
             $array = &$array[$key];
         }
         //删除数组中的第一个元素，并返回被删除元素的值
         //删除掉被删除元素的值的元素
         $array[array_shift($keys)] = $value;
    
         return $array;
     }

```
#### 案例
```php
    $array = ['products' => ['desk' => ['price' => 100]]];
    Arr::set($array, 'products.desk.price', 200);
    // ['products' => ['desk' => ['price' => 200]]]
```
