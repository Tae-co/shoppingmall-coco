package com.shoppingmallcoco.project;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	//스프링 기본 인증 작업 끄기
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf->csrf.disable()) //csrf 토큰 없이도 로그인 가능
			.formLogin(formLogin->formLogin.disable()) //스프링시큐리티 제공 기본 로그인 사용종료
			.headers(headerConfig->
						headerConfig.frameOptions(frameOptionsConfig->
													frameOptionsConfig.disable())); //iframe페이지는 허가하지 않음(X-Frame-Options 응답헤더 : DENY로 설정)
		return http.build();
	}
}
