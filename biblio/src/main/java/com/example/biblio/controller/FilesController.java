package com.example.biblio.controller;

import com.example.biblio.model.Book;
import com.example.biblio.model.DownloadStatistics;
import com.example.biblio.model.Role;
import com.example.biblio.model.User;
import com.example.biblio.responses.Response;
import com.example.biblio.service.BookService;
import com.example.biblio.service.DownloadStatisticsService;
import com.example.biblio.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "http://localhost:3000")

public class FilesController {
    private static final Logger logger = LoggerFactory.getLogger(FilesController.class);
    @Autowired
    private BookService bookService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private DownloadStatisticsService downloadStatisticsService;

    @GetMapping("/downloadFile/{fileName:.+}")
    public ResponseEntity < Resource > downloadFile(@PathVariable String fileName,
                                                    HttpServletRequest request,
                                                    @AuthenticationPrincipal User user) {
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName, user);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/downloadBooksExcel")
    public ResponseEntity<Resource> downloadBooksExcel(@AuthenticationPrincipal User user) throws IOException {
        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Book> books = bookService.getAllBooks();

        // Convert the books list to an Excel file
        byte[] excelBytes = convertBooksToExcel(books);
        Resource excelResource = new ByteArrayResource(excelBytes);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"books.xlsx\"")
                .body(excelResource);
    }

    private byte[] convertBooksToExcel(List<Book> books) throws IOException {
        // Use a library like Apache POI to create an Excel file from the list of books.
        // Here's an example of how you can use Apache POI to create an Excel file:

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Books");

            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Title");
            headerRow.createCell(1).setCellValue("Author");
            headerRow.createCell(2).setCellValue("Category");

            // Populate data rows
            int rowNum = 1;
            for (Book book : books) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(book.getTitle());
                row.createCell(1).setCellValue(book.getAuthor());
                row.createCell(2).setCellValue(book.getCategory().getName());
            }

            // Write the workbook to output stream
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }


    @PostMapping("/uploadFile")
    public Response uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.uploadFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();

        return new Response(fileName, fileDownloadUri,
                file.getContentType(), file.getSize());
    }


}
