package com.example.biblio.service;

import com.example.biblio.model.Book;
import com.example.biblio.model.User;

public interface DownloadStatisticsService {

     void addDownloadStatistic(Book book, User user);
}
