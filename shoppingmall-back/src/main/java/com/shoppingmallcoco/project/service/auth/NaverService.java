package com.shoppingmallcoco.project.service.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class NaverService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${naver.client-id:}")
    private String clientId;

    @Value("${naver.client-secret:}")
    private String clientSecret;

    // 네이버 인증 코드로 액세스 토큰 받기
    public String getAccessToken(String code, String state, String redirectUri) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("code", code);
            params.add("state", state);
            params.add("redirect_uri", redirectUri);

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://nid.naver.com/oauth2.0/token",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                if (jsonNode.has("access_token")) {
                    return jsonNode.get("access_token").asText();
                }
            }

            throw new RuntimeException("네이버 액세스 토큰 받기 실패");
        } catch (Exception e) {
            throw new RuntimeException("네이버 API 호출 오류: " + e.getMessage());
        }
    }

    // 네이버 액세스 토큰을 통한 사용자 정보 조회
    public NaverUserInfo getUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://openapi.naver.com/v1/nid/me",
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                JsonNode responseNode = jsonNode.get("response");

                if (responseNode != null) {
                    String naverId = responseNode.has("id") ? responseNode.get("id").asText() : null;
                    String email = responseNode.has("email") ? responseNode.get("email").asText() : null;
                    String nickname = responseNode.has("nickname") ? responseNode.get("nickname").asText() : null;
                    String name = responseNode.has("name") ? responseNode.get("name").asText() : null;
                    String mobile = responseNode.has("mobile") ? responseNode.get("mobile").asText() : null;

                    return NaverUserInfo.builder()
                            .naverId(naverId)
                            .email(email)
                            .nickname(nickname)
                            .name(name)
                            .mobile(mobile)
                            .build();
                }
            }

            throw new RuntimeException("네이버 사용자 정보 조회 실패");
        } catch (Exception e) {
            throw new RuntimeException("네이버 API 호출 오류: " + e.getMessage());
        }
    }

    // 네이버 사용자 정보를 담는 DTO
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class NaverUserInfo {
        private String naverId;
        private String email;
        private String nickname;
        private String name;
        private String mobile;
    }
}

