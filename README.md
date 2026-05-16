# Air Framework Dependencies

统一的第三方依赖版本管理 BOM，供所有 norlandsoft Java 项目引用。

## 已管理版本

以下库版本已由 **spring-boot-dependencies 4.1.0-M4** 管理，引入本 BOM 后可直接使用（无需声明 version）：

| 库 | 版本 |
|---|---|
| jedis | 7.4.0 |
| netty-bom | 4.2.12.Final |
| commons-pool2 | 2.13.1 |
| commons-lang3 | 3.20.0 |
| commons-codec | 1.21.0 |
| gson | 2.13.2 |

以下库版本由本 BOM 补充管理：

| 库 | 版本 |
|---|---|
| commons-collections4 | 4.5.0 |
| commons-io | 2.22.0 |
| commons-text | 1.15.0 |
| guava | 33.6.0-jre |
| mybatis | 3.5.19 |
| mybatis-spring | 4.0.0 |
| mybatis-spring-boot-starter | 4.0.1 |
| springdoc-openapi-starter-webmvc-ui | 3.0.3 |

## 使用方式

### 1. 配置 settings.xml

在 `~/.m2/settings.xml` 中添加 GitHub Packages 仓库和认证：

```xml
<settings>
    <servers>
        <server>
            <id>github</id>
            <username>你的GitHub用户名</username>
            <password>ghp_your_personal_access_token</password>
        </server>
    </servers>
    <profiles>
        <profile>
            <id>github</id>
            <repositories>
                <repository>
                    <id>github</id>
                    <url>https://maven.pkg.github.com/norlandsoft/air-framework-dependencies</url>
                </repository>
            </repositories>
        </profile>
    </profiles>
    <activeProfiles>
        <activeProfile>github</activeProfile>
    </activeProfiles>
</settings>
```

### 2. 在项目 pom.xml 中引入 BOM

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.norlandsoft</groupId>
            <artifactId>air-framework-dependencies</artifactId>
            <version>1.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### 3. 正常添加依赖（无需 version）

```xml
<dependencies>
    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
    </dependency>
    <dependency>
        <groupId>com.google.guava</groupId>
        <artifactId>guava</artifactId>
    </dependency>
</dependencies>
```

## 发布新版本

```bash
mvn deploy
```

修改版本时只需更改 `pom.xml` 中的 `<properties>` 区域。
