package com.norlandsoft.air;

import com.norlandsoft.air.framework.sdk.app.AppManager;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.File;

/**
 * AirPro 应用入口
 *
 * 应用平台开发脚手架主启动类，负责初始化 Spring Boot 应用上下文并配置全局参数。
 * framework-sdk 的 SSO 自动配置通过 @ConditionalOnProperty(framework.address) 控制，
 * 仅在配置了 Framework 服务地址时激活。
 *
 * Author: ChaiMingXu, 2026/05/24
 */
@SpringBootApplication
@EnableScheduling
public class AirPro {

  public static void main(String[] args) {

    String workspace = AppManager.getApplicationWorkspace();

    // 设置日志目录
    System.setProperty("log.path", workspace + File.separator + "logs");
    System.setProperty("log.name", "air-pro");
    System.setProperty("log.level", "debug");

    SpringApplication.run(AirPro.class, args);
  }

}
