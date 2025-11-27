package com.example.demo.Controller;


import com.example.demo.Entity.Person;
import com.example.demo.Repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@RestController
public class PersonController {

    @Autowired
    private PersonRepository personRepository;

    @PostMapping("/persons")
    public Person createPerson(@RequestBody Person person) {
        return personRepository.save(person);
    }

    @GetMapping("/persons")
    public Iterable<Person> getAllPersons() {
        return personRepository.findAll();
    }

    @GetMapping("/persons/{name}")
    public Person getPersonByName(@PathVariable String name) {
        return personRepository.findByName(name);
    }

    @PutMapping("/persons/{name}")
    public Person updatePerson(@PathVariable String name, @RequestBody Person updatedPerson) {
        Person person = personRepository.findByName(name);
        if (person != null) {
            person.setEmail(updatedPerson.getEmail());
            person.setAddress(updatedPerson.getAddress());
            person.setPhone(updatedPerson.getPhone());
            person.setAge(updatedPerson.getAge());
            person.setGender(updatedPerson.getGender());
            return personRepository.save(person);
        }
        return null;
    }

    @DeleteMapping("/persons/{name}")
    public void deletePerson(@PathVariable String name) {
        personRepository.deleteByName(name);
    }



}
