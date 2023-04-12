package com.example.biblio.controller;

import com.example.biblio.model.Book;
import com.example.biblio.model.User;
import com.example.biblio.service.DownloadStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Statistics")
public class DownloadStatisticsController {

    @Autowired
    private DownloadStatisticsService downloadStatisticsService;

    @PostMapping("/download")
    public void downloadBook(@RequestBody DownloadRequest downloadRequest) {
        // Get the book and user information from the request
        Book book = downloadRequest.getBook();
        User user = downloadRequest.getUser();

        // Call the addDownloadStatistic method in the DownloadStatisticsService
        downloadStatisticsService.addDownloadStatistic(book, user);
    }

    // Class to represent the download request from the client
    public static class DownloadRequest {
        private Book book;
        private User user;

        // Getters and Setters
        public Book getBook() {
            return book;
        }

        public void setBook(Book book) {
            this.book = book;
        }

        public User getUser() {
            return user;
        }

        public void setUser(User user) {
            this.user = user;
        }
    }
}
