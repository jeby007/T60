# 运行开发环境
npm run serve
# 编译上线
npm run build

# 一些注意事项
### 图片

```
<img class="header__logo" src="@/static/images/logo.png" alt="">

```

### 样式

全局样式，请在 App.vue引入
``` JavaScript

<script>
import "./static/style/global.css";
import "./static/style/index.css";
</script>

```

### 组件

``` JavaScript

<script>
import Header from '@/component/Header.vue'
</script>


```