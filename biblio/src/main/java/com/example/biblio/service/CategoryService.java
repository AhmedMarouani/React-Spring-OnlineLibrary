package com.example.biblio.service;

import com.example.biblio.model.Book;
import com.example.biblio.model.Category;

import java.util.List;

public interface CategoryService {
    Category addCategory(Category category);
    List<Category> getCategories();

}
