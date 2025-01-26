package com.c108.springproject.recipe.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.repository.ItemRepository;
import com.c108.springproject.recipe.domain.Material;
import com.c108.springproject.recipe.domain.Recipe;
import com.c108.springproject.recipe.domain.RecipeCategory;
import com.c108.springproject.recipe.dto.request.MaterialReqDto;
import com.c108.springproject.recipe.dto.request.RecipeCreateReqDto;
import com.c108.springproject.recipe.dto.request.RecipeUpdateReqDto;
import com.c108.springproject.recipe.dto.response.RecipeCreateResDto;
import com.c108.springproject.recipe.dto.response.RecipeUpdateResDto;
import com.c108.springproject.recipe.repository.RecipeCategoryRepository;
import com.c108.springproject.recipe.repository.RecipeRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final RecipeCategoryRepository recipeCategoryRepository;
    private final ItemRepository itemRepository;

    public RecipeService(RecipeRepository recipeRepository, RecipeCategoryRepository recipeCategoryRepository, ItemRepository itemRepository) {
        this.recipeRepository = recipeRepository;
        this.recipeCategoryRepository = recipeCategoryRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional
    public RecipeCreateResDto createRecipe(RecipeCreateReqDto request) {
        try {
            RecipeCategory category = recipeCategoryRepository.findById(request.getCategoryNo())
                    .orElseThrow(() -> new BobIssueException(ResponseCode.CATEGORY_NOT_FOUND));

            Recipe recipe = Recipe.builder()
                    .category(category)
                    .imageNo(request.getImageNo())
                    .name(request.getName())
                    .time(request.getTime())
                    .materials(new ArrayList<>())
                    .build();

            for (MaterialReqDto materialDto : request.getMaterials()) {
                Item item = itemRepository.findById(materialDto.getItemNo())
                        .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

                Material material = Material.builder()
                        .recipe(recipe)
                        .item(item)
                        .cnt(materialDto.getCnt())
                        .build();

                recipe.getMaterials().add(material);
            }

            Recipe savedRecipe = recipeRepository.save(recipe);
            return RecipeCreateResDto.toDto(savedRecipe);
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_CREATE_RECIPE);
        }
    }
    @Transactional
    public RecipeUpdateResDto updateRecipe(int recipeNo, RecipeUpdateReqDto request) {
        try {
            Recipe recipe = recipeRepository.findById(recipeNo)
                    .orElseThrow(() -> new BobIssueException(ResponseCode.RECIPE_NOT_FOUND));

            RecipeCategory category = recipeCategoryRepository.findById(request.getCategoryNo())
                    .orElseThrow(() -> new BobIssueException(ResponseCode.CATEGORY_NOT_FOUND));

            recipe.getMaterials().clear();

            recipe.update(category, request.getName(), request.getTime());
            recipe.setImageNo(request.getImageNo());
            recipe.setUpdatedUser(request.getUpdatedUser());


            for (MaterialReqDto materialDto : request.getMaterials()) {
                Item item = itemRepository.findById(materialDto.getItemNo())
                        .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

                Material material = Material.builder()
                        .recipe(recipe)
                        .item(item)
                        .cnt(materialDto.getCnt())
                        .build();

                recipe.getMaterials().add(material);
            }

            Recipe updatedRecipe = recipeRepository.save(recipe);
            return RecipeUpdateResDto.toDto(updatedRecipe);
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_RECIPE);
        }
    }


}
