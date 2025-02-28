package com.universalathletics.controllers;

//-------------------------------- Imports -----------------------------------//
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//-------------------------------- TestController Class ------------------------//
@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/")
    public String testEndpoint() {
        return "Hello from Universal Athletics Backend!";
    }
}

