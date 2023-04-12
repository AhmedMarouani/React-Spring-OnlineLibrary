package com.example.biblio.controller;


import com.example.biblio.model.Book;
import com.example.biblio.model.User;
import com.example.biblio.service.BookService;
import com.example.biblio.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/Book")
@CrossOrigin(origins = "http://localhost:3000")

public class BookController{
    @Autowired
    private BookService bookService;


    @PostMapping("/addBook")
    public Book addNewBook(@RequestBody Book book){
        Book newBook = bookService.addBook(book);
        return newBook;
    }
    @GetMapping("/getbooks")
    public List<Book> getAllBooks(){
        return bookService.getAllBooks();
    }







}
