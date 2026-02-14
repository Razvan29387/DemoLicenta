package com.example.demo;

import com.example.demo.service.AdzunaIngestionService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Demo1Application {

    public static void main(String[] args) {
        SpringApplication.run(Demo1Application.class, args);
    }

    @Bean
    CommandLineRunner run(AdzunaIngestionService ingestionService) {
        return args -> {
            // Adzuna supported countries list
            String[] countries = {"gb", "us", "fr", "de", "at", "au", "be", "br", "ca", "ch", "es", "in", "it", "mx", "nl", "nz", "pl", "ru", "sg", "za"};

            for (String country : countries) {
                System.out.println(">>> Starting import for country: " + country.toUpperCase());
                
                // Fetch pages 1 to 20 for each country (20 * 50 = 1000 jobs per country)
                // You can increase the endPage (e.g., to 100 or 200) to get more data.
                // WARNING: Adzuna Free Tier often limits to ~250 requests/day. 
                // 20 countries * 1 page = 20 requests (Safe for testing).
                ingestionService.importJobs(country, 1, 1);
            }
        };
    }
}
