package com.norlandsoft.example.controller;

import com.google.common.base.Strings;
import com.google.common.collect.ImmutableMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DemoController {

    @GetMapping("/hello")
    public Map<String, Object> hello(
            @RequestParam(defaultValue = "world") String name) {
        String message = "Hello, " + Strings.nullToEmpty(name) + "!";
        return ImmutableMap.of("message", message, "success", true);
    }
}
