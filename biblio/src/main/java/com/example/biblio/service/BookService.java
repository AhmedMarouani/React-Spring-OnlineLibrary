package com.example.biblio.service;

import com.example.biblio.model.Book;
import com.example.biblio.model.User;

import java.util.List;

public interface BookService {
    Book addBook(Book book);
    Book findByTitle(String title);

    List<Book> getAllBooks();
}
