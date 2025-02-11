package com.c108.springproject.recipe.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.s3.S3Service;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.domain.ItemLike;
import com.c108.springproject.item.repository.ItemRepository;
import com.c108.springproject.recipe.domain.*;
import com.c108.springproject.recipe.dto.request.MaterialReqDto;
import com.c108.springproject.recipe.dto.request.RecipeCreateReqDto;
import com.c108.springproject.recipe.dto.request.RecipeUpdateReqDto;
import com.c108.springproject.recipe.dto.response.*;
import com.c108.springproject.recipe.repository.RecipeCategoryRepository;
import com.c108.springproject.recipe.repository.RecipeLikeRepository;
import com.c108.springproject.recipe.repository.RecipeRepository;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final RecipeCategoryRepository recipeCategoryRepository;
    private final ItemRepository itemRepository;
    private final S3Service s3Service;
    private final UserRepository userRepository;
    private final RecipeLikeRepository recipeLikeRepository;

    public RecipeService(RecipeRepository recipeRepository, RecipeCategoryRepository recipeCategoryRepository, ItemRepository itemRepository, S3Service s3Service, UserRepository userRepository, RecipeLikeRepository recipeLikeRepository) {
        this.recipeRepository = recipeRepository;
        this.recipeCategoryRepository = recipeCategoryRepository;
        this.itemRepository = itemRepository;
        this.s3Service = s3Service;
        this.userRepository = userRepository;
        this.recipeLikeRepository = recipeLikeRepository;
    }

    @Transactional
    public RecipeCreateResDto createRecipe(RecipeCreateReqDto request, List<MultipartFile> files) {
        try {
            // 레시피 카테고리 조회
            RecipeCategory category = recipeCategoryRepository.findById(request.getCategoryNo())
                    .orElseThrow(() -> new BobIssueException(ResponseCode.CATEGORY_NOT_FOUND));

            // 필요한 Item들을 한 번에 조회
            List<Integer> itemNos = request.getMaterials().stream()
                    .map(MaterialReqDto::getItemNo)
                    .collect(Collectors.toList());

            Map<Integer, Item> itemMap = itemRepository.findAllById(itemNos).stream()
                    .collect(Collectors.toMap(Item::getItemNo, item -> item));

            // 레시피 엔티티 생성
            Recipe recipe = Recipe.builder()
                    .category(category)
                    .name(request.getName())
                    .time(request.getTime())
                    .materials(new ArrayList<>())
                    .build();

            // Material 생성 및 추가
            for (MaterialReqDto materialDto : request.getMaterials()) {
                Item item = itemMap.get(materialDto.getItemNo());
                if (item == null) {
                    throw new BobIssueException(ResponseCode.ITEM_NOT_FOUND);
                }

                Material material = Material.builder()
                        .recipe(recipe)
                        .item(item)
                        .cnt(materialDto.getCnt())
                        .build();

                recipe.getMaterials().add(material);
            }

            // 이미지 업로드 및 RecipeImage 엔티티 생성
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    String imgUrl = s3Service.uploadFile("recipe", file);

                    RecipeImage recipeImage = RecipeImage.builder()
                            .recipe(recipe)
                            .originalName(file.getOriginalFilename())
                            .imageUrl(imgUrl)
                            .build();
                    recipe.getImages().add(recipeImage);
                }
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
    public RecipeUpdateResDto updateRecipe(int recipeNo, RecipeUpdateReqDto request, List<MultipartFile> files) {
        try {
            Recipe recipe = recipeRepository.findById(recipeNo)
                    .orElseThrow(() -> new BobIssueException(ResponseCode.RECIPE_NOT_FOUND));

            // 이미지 필드
            List<RecipeImage> updatedImages = new ArrayList<>();
            
            // 유지할 이미지 처리
            if (request.getKeepImageIds() != null && !request.getKeepImageIds().isEmpty()) {
                updatedImages.addAll(recipe.getImages().stream()
                        .filter(img -> request.getKeepImageIds().contains(img.getImageNo()))
                        .collect(Collectors.toList()));
            }

            // 삭제할 이미지 처리
            List<String> deleteUrls = recipe.getImages().stream()
                    .filter(img -> request.getKeepImageIds() == null ||
                            !request.getKeepImageIds().contains(img.getImageNo()))
                    .map(RecipeImage::getImageUrl)
                    .collect(Collectors.toList());

            if (!deleteUrls.isEmpty()) {
                s3Service.deleteFiles(deleteUrls);
            }


            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    String imgUrl = s3Service.uploadFile("recipe", file);
                    RecipeImage recipeImage = RecipeImage.builder()
                            .recipe(recipe)
                            .originalName(file.getOriginalFilename())
                            .imageUrl(imgUrl)
                            .build();
                    updatedImages.add(recipeImage);
                }
            }

            RecipeCategory category = recipeCategoryRepository.findById(request.getCategoryNo())
                    .orElseThrow(() -> new BobIssueException(ResponseCode.CATEGORY_NOT_FOUND));


            // 기본 정보 업데이트
            recipe.update(category, request.getName(), request.getTime());
//            recipe.setUpdatedUser(request.getUpdatedUser());


            // 재료 정보 업데이트
            recipe.getMaterials().clear();
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

            // 이미지 클리어 후 다시 설정
            recipe.getImages().clear();
            recipe.getImages().addAll(updatedImages);

            Recipe updatedRecipe = recipeRepository.save(recipe);
            return RecipeUpdateResDto.toDto(updatedRecipe);
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_RECIPE);
        }
    }

    // 전체조회
    @Transactional
    public List<RecipeListResDto> findAllRecipe() {
        List<Recipe> recipes = recipeRepository.findAll();
        List<RecipeListResDto> recipeListResDtos = new ArrayList<>();
        for(Recipe recipe: recipes) {
            recipeListResDtos.add(RecipeListResDto.toDto(recipe));
        }
        return recipeListResDtos;
    }

    @Transactional
    public RecipeResDto findRecipe(int recipeNo) {
        Recipe recipe = recipeRepository.findById(recipeNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.RECIPE_NOT_FOUND));
        return RecipeResDto.toDto(recipe);
    }

    @Transactional
    public void deleteRecipe(int recipeNo) {
        Recipe recipe = recipeRepository.findById(recipeNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.RECIPE_NOT_FOUND));
        
        // 레시피 삭제 시 레시피 이미지 같이 처리

        List<String> deleteUrls = recipe.getImages().stream()
                        .map(RecipeImage::getImageUrl)
                                .collect(Collectors.toList());

        if (!deleteUrls.isEmpty()) {
            s3Service.deleteFiles(deleteUrls);
        }

        recipe.getImages().clear();
        
        recipe.delete();
    }


    // 레시피 찜 기능
    // 찜
    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public void addLike(int recipeNo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));

        Recipe recipe = recipeRepository.findById(recipeNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.RECIPE_NOT_FOUND));

        if (recipeLikeRepository.existsByUserAndRecipe(user, recipe)) {
            throw new BobIssueException(ResponseCode.ALREADY_LIKED_RECIPE);
        }

        RecipeLike recipeLike = RecipeLike.builder()
                .user(user)
                .recipe(recipe)
                .createdAt(new SimpleDateFormat("yyyyMMdd HHmmss").format(new Date()))
                .build();

        recipeLikeRepository.save(recipeLike);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public void removeLike(int recipeNo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));

        Recipe recipe = recipeRepository.findById(recipeNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.RECIPE_NOT_FOUND));

        recipeLikeRepository.findByUserAndRecipe(user, recipe)
                .ifPresent(recipeLikeRepository::delete);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public List<RecipeListResDto> getLikedRecipe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));

        return recipeLikeRepository.findByUser(user).stream()
                .map(like -> RecipeListResDto.toDto(like.getRecipe()))
                .collect(Collectors.toList());
    }

}
