package com.example.biblio.controller;


import com.example.biblio.model.Category;
import com.example.biblio.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/Category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;


    @PostMapping("/addCategory")
    public Category addNewCategory(@RequestBody Category category){
        Category newCategory = categoryService.addCategory(category);
        return newCategory;
    }

    @GetMapping("/getCategories")
    public List<Category> getCategories(){
        return categoryService.getCategories();
    }





}
