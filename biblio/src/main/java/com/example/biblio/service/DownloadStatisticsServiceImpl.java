package com.example.biblio.service;

import com.example.biblio.model.Book;
import com.example.biblio.model.DownloadStatistics;
import com.example.biblio.model.User;
import com.example.biblio.repository.DownloadStatisticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DownloadStatisticsServiceImpl implements DownloadStatisticsService{

    @Autowired
    private DownloadStatisticsRepository downloadStatisticsRepository;

    public void addDownloadStatistic(Book book, User user) {
        // Create a new DownloadStatistics object
        DownloadStatistics downloadStatistics = new DownloadStatistics();
        downloadStatistics.setBook(book);
        downloadStatistics.setUser(user);

        // Set the number of downloads to 1
        downloadStatistics.setNumberOfDownloads(1);

        // Save the DownloadStatistics object to the database
        downloadStatisticsRepository.save(downloadStatistics);
    }
}
