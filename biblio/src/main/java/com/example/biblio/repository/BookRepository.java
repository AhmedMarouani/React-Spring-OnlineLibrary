package com.example.biblio.repository;

import com.example.biblio.model.Book;
import com.example.biblio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book,  Integer> {
    Optional<Book> findByTitle(String title);

}
