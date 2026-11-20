package com.library.management;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
		"ADMIN_PASSWORD=TestAdminPassword123!",
		"JWT_SECRET=ThisIsOnlyATestSecretKeyForLibraryManagement123456"
})
class LibraryManagementApplicationTests {

	@Test
	void contextLoads() {
	}
}