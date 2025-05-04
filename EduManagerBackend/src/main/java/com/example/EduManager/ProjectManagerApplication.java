package com.example.EduManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
public class ProjectManagerApplication {
	public static void main(String[] args) {
		SpringApplication.run(ProjectManagerApplication.class, args);
	}
}
