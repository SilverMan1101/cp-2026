package com.emotionsense.controller;

import com.emotionsense.model.User;
import com.emotionsense.repository.UserRepository;
import com.emotionsense.security.JwtUtils;
import com.emotionsense.security.UserPrincipal;
import com.emotionsense.service.AuditLogService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // Authenticate credentials
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userPrincipal);

        auditLogService.log(
                userPrincipal.getOrganizationId(),
                userPrincipal.getId(),
                "LOGIN_SUCCESS",
                "AUTH",
                userPrincipal.getId(),
                "127.0.0.1",
                "Successful user authentication"
        );

        return ResponseEntity.ok(Map.of(
                "token", jwt,
                "type", "Bearer",
                "id", userPrincipal.getId(),
                "email", userPrincipal.getEmail(),
                "fullName", userPrincipal.getFullName(),
                "role", userPrincipal.getRole(),
                "organizationId", userPrincipal.getOrganizationId(),
                "departmentId", userPrincipal.getDepartmentId() != null ? userPrincipal.getDepartmentId() : "",
                "teamId", userPrincipal.getTeamId() != null ? userPrincipal.getTeamId() : ""
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        return ResponseEntity.ok(Map.of(
                "id", principal.getId(),
                "email", principal.getEmail(),
                "fullName", principal.getFullName(),
                "role", principal.getRole(),
                "organizationId", principal.getOrganizationId(),
                "departmentId", principal.getDepartmentId() != null ? principal.getDepartmentId() : "",
                "teamId", principal.getTeamId() != null ? principal.getTeamId() : ""
        ));
    }
}
