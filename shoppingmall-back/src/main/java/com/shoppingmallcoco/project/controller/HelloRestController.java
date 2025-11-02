package com.shoppingmallcoco.project.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;


@RestController
@CrossOrigin(origins = "http://localhost:3000") // React 앱의 URL
public class HelloRestController {
	@GetMapping("hello")
	public String hello() {
		return "안녕하세요";
	}
}
