package com.example.biblio.service;

import com.example.biblio.model.Book;
import com.example.biblio.model.User;
import com.example.biblio.repository.BookRepository;
import com.example.biblio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService{
    @Autowired
    private BookRepository bookRepository;

    @Override
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public Book findByTitle(String title) {
        return bookRepository.findByTitle(title).get();
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
}
