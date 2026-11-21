
package com.library.management.config;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;

public class LoginRateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_ATTEMPTS = 5;

    private static final long WINDOW_MILLIS = Duration.ofMinutes(5).toMillis();

    private final ConcurrentHashMap<String, AttemptWindow> attempts = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !("POST".equalsIgnoreCase(request.getMethod())
                && "/api/auth/login".equals(request.getServletPath()));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String clientIp = getClientIp(request);
        long now = System.currentTimeMillis();

        AttemptWindow window = attempts.compute(clientIp, (ip, existing) -> {
            if (existing == null ||
                    now - existing.windowStart >= WINDOW_MILLIS) {
                return new AttemptWindow(now);
            }

            return existing;
        });

        synchronized (window) {
            if (window.count.get() >= MAX_ATTEMPTS) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write(
                        "{\"message\":\"Too many login attempts. Please try again after 5 minutes.\"}");
                return;
            }

            window.count.incrementAndGet();
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        // Use the direct remote address. Only trust forwarded IP headers
        // when your reverse proxy is configured to sanitize them.
        return request.getRemoteAddr();
    }

    private static class AttemptWindow {

        private final long windowStart;
        private final AtomicInteger count = new AtomicInteger(0);

        private AttemptWindow(long windowStart) {
            this.windowStart = windowStart;
        }
    }
}
