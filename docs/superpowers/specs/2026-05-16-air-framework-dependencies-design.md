# Air Framework Dependencies BOM Design

## Overview

A Maven BOM (Bill of Materials) project that centralizes third-party dependency version management across all norlandsoft Java/Spring Boot projects.

## Project Coordinates

- **groupId:** `com.norlandsoft`
- **artifactId:** `air-framework-dependencies`
- **packaging:** `pom`

## Architecture

- Extends `spring-boot-dependencies` as parent to inherit Spring ecosystem version management
- Declares third-party library versions via `<properties>` for single-point-of-change
- Supplements `<dependencyManagement>` entries not covered by Spring Boot BOM
- Publishes to GitHub Packages for team-wide consumption

## Managed Dependencies

### Network & Data
- jedis
- netty (all modules via netty-bom)
- commons-pool2

### Apache Commons
- commons-lang3
- commons-collections4
- commons-io
- commons-codec
- commons-text

### Google
- guava

### JSON
- gson

### ORM & Database
- mybatis
- mybatis-spring

### Documentation
- springdoc-openapi

## Distribution

- **Repository:** GitHub Packages (`maven.pkg.github.com/norlandsoft/AirNotes`)
- **Release:** `mvn deploy`
- **Consumption:** Import BOM in consumer project's `<dependencyManagement>`

## Usage in Consumer Projects

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

Consumer projects also need GitHub Packages repository configured in `~/.m2/settings.xml`.
