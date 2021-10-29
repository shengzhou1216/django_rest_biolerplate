# dataset-tools-web

数据集工具web端

## 打包镜像

0. 修改配置(如果不需要修改则跳过此步骤)

    - `.env.production`
    - `nginx/conf.d/my.conf`

1. 构建镜像

    在项目根目录下执行
    ```bash
    docker build -t dataset-tools-web .
    ```

## 部署到k8s

问题:

1. nginx转发到哪个服务是动态的，应该要通过环境变量进行控制，在容器启动的是读取环境变量，然后修改ngxin配置文件
