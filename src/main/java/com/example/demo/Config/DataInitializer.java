package com.example.demo.Config;

import com.example.demo.Entity.Firma;
import com.example.demo.Repository.FirmaRepository;
import com.example.demo.Entity.Person;
import com.example.demo.Repository.PersonRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final PersonRepository personRepository;
    private final FirmaRepository firmaRepository; // Adăugăm repository-ul pentru firme
    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper; // Folosim un singur ObjectMapper

    public DataInitializer(PersonRepository userRepository,
                           FirmaRepository firmaRepository, // Injectăm în constructor
                           ResourceLoader resourceLoader) {
        this.personRepository = userRepository;
        this.firmaRepository = firmaRepository;
        this.resourceLoader = resourceLoader;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void run(String... args) throws Exception {
        // Verificăm dacă baza de date este deja populată pentru a evita duplicatele
        if (personRepository.count() == 0) {
            log.info("User repository is empty. Initializing user data...");

            ;

            log.info("User data initialization finished. Total users in DB: {}", personRepository.count());
        } else {
            log.info("User repository already contains data. Skipping initialization.");
        }

        // Am înlocuit blocul if/else cu o metodă de sincronizare
        synchronizeFirmeFromJson("classpath:firme.json");
    }

    // Metodă generică pentru a reduce repetiția de cod try-catch
    private void loadData(String path, DataLoader loader) {
        try {
            loader.load(path);
        } catch (Exception e) {
            log.error("Failed to load data from {}", path, e);
        }
    }

    private void loadUsersFromCsv(String filePath) throws IOException, CsvValidationException {
        log.info("Loading users from CSV file: {}", filePath);
        List<Person> persons = new ArrayList<>();
        Resource resource = resourceLoader.getResource(filePath);

        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            // Skip header
            reader.readNext();
            String[] line;
            while ((line = reader.readNext()) != null) {
                persons.add(new Person(line[0], line[1], line[2], line[3], Integer.parseInt(line[4]), line[5]));
            }
        }
        personRepository.saveAll(persons);
        log.info("Saved {} users from CSV.", persons.size());
    }

    private void loadUsersFromJson(String filePath) throws IOException {
        log.info("Loading users from JSON file: {}", filePath);
        Resource resource = resourceLoader.getResource(filePath);

        List<Person> persons = objectMapper.readValue(resource.getInputStream(), new TypeReference<List<Person>>() {});

        personRepository.saveAll(persons);
        log.info("Saved {} users from JSON.", persons.size());
    }

    private void loadUsersFromTxt(String filePath) throws IOException {
        log.info("Loading users from TXT file: {}", filePath);
        List<Person> persons = new ArrayList<>();
        Resource resource = resourceLoader.getResource(filePath);

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(";");
                if (parts.length == 2) {
                    persons.add(new Person(parts[0], parts[1], null, null, 0, null));
                } else {
                    log.warn("Skipping malformed line in TXT file: {}", line);
                }
            }
        }
        personRepository.saveAll(persons);
        log.info("Saved {} users from TXT.", persons.size());
    }

    /**
     * Sincronizează firmele din fișierul JSON cu baza de date.
     * Adaugă doar firmele care nu există deja.
     */
    private void synchronizeFirmeFromJson(String filePath) throws IOException {
        log.info("Synchronizing firms from JSON file: {}", filePath);
        Resource resource = resourceLoader.getResource(filePath);
        List<Firma> firmeFromJson = objectMapper.readValue(resource.getInputStream(), new TypeReference<List<Firma>>() {});

        // Obținem numele tuturor firmelor existente în baza de date pentru o verificare rapidă
        Set<String> existingFirmaNames = firmaRepository.findAll().stream()
                .map(Firma::getName)
                .collect(Collectors.toSet());

        // Filtrăm și păstrăm doar firmele care nu sunt deja în baza de date
        List<Firma> firmeToSave = firmeFromJson.stream()
                .filter(firma -> !existingFirmaNames.contains(firma.getName()))
                .collect(Collectors.toList());

        if (!firmeToSave.isEmpty()) {
            firmaRepository.saveAll(firmeToSave);
            log.info("Added {} new firms to the database.", firmeToSave.size());
        } else {
            log.info("No new firms to add. Database is up to date.");
        }
    }

    // Interfață funcțională pentru a simplifica apelurile
    @FunctionalInterface
    private interface DataLoader {
        void load(String path) throws Exception;
    }
}