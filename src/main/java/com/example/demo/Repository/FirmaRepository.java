package com.example.demo.Repository;

import com.example.demo.Entity.Firma;
import java.util.Optional;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FirmaRepository extends Neo4jRepository<Firma, Long> {

    // Metodă pentru a găsi o firmă după nume
    Optional<Firma> findByName(String name);
}
