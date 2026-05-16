# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

Maven BOM (Bill of Materials) that centralizes third-party dependency version management for all norlandsoft Java/Spring Boot projects. Published to GitHub Packages at `maven.pkg.github.com/norlandsoft/air-framework-dependencies`.

## Key Commands

```bash
mvn deploy              # Publish to GitHub Packages
mvn versions:display-property-updates  # Check for available version updates
```

There are no tests or build steps — this is a POM-only project with no source code.

## Architecture

- **Parent:** `spring-boot-dependencies:4.1.0-M4` — inherits all Spring-managed versions (jedis, netty, gson, commons-lang3, etc.)
- **Supplements:** Adds `<dependencyManagement>` entries for libraries not covered by the Spring Boot BOM (guava, commons-io, mybatis)
- **Version convention:** All versions declared as `<properties>` in pom.xml for single-point-of-change. Property names follow the Maven convention: `<artifactId.version>` or `<artifactId-without-suffix.version>`.

## Making Changes

- To add a dependency: add a version property in `<properties>` and a corresponding entry in `<dependencyManagement>`
- To bump a version: change only the property value in `<properties>` — do not hardcode versions in `<dependencyManagement>`
- To change the project version: update `<version>` in the root `<project>` element
- After any change, run `mvn deploy` to publish
