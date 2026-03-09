package com.example.demo.Repository;

import com.example.demo.Entity.Company;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import java.util.Optional;

public interface CompanyRepository extends Neo4jRepository<Company, Long> {
    Optional<Company> findByName(String name);
}