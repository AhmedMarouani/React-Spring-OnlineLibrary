package com.example.biblio.repository;

import com.example.biblio.model.DownloadStatistics;
import com.example.biblio.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DownloadStatisticsRepository extends JpaRepository<DownloadStatistics, Integer> {


}
