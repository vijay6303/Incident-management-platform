package com.vijay.incident;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class IncidentApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void incidentsEndpointRejectsUnauthenticatedRequests() throws Exception {
        mockMvc.perform(get("/api/incidents"))
                .andExpect(status().isUnauthorized());
    }
    @Test
void registerUserShouldReturnCreated() throws Exception {
    String email = "user-" + java.util.UUID.randomUUID() + "@example.com";

    String request = """
        {
            "email": "%s",
            "password": "SecurePass123!"
        }
        """.formatted(email);

    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(request))
            .andExpect(status().isCreated());
}

    @Test
    void loginShouldReturnJwtToken() throws Exception {
        String email = "login-" + java.util.UUID.randomUUID() + "@example.com";

        String registrationRequest = """
            {
                "email": "%s",
                "password": "SecurePass123!"
            }
            """.formatted(email);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registrationRequest))
                .andExpect(status().isCreated());

        String loginRequest = """
            {
                "email": "%s",
                "password": "SecurePass123!"
            }
            """.formatted(email);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    void invalidJwtShouldNotAccessIncidents() throws Exception {
        mockMvc.perform(get("/api/incidents")
                .header("Authorization", "Bearer invalid.token.value"))
                .andExpect(status().isUnauthorized());
    }
}