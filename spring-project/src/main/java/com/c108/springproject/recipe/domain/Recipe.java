package com.c108.springproject.recipe.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Recipe extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int recipeNo;

    @Column(nullable = false)
    private Long imageNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_no", nullable = false)
    private RecipeCategory category;

    @Column(nullable = false, length = 100)
    private String  name;

    @Column(nullable = false)
    private int time;

    @Builder.Default
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private List<Material> materials = new ArrayList<>();

    public void update(RecipeCategory category, String name, int time) {
        this.category = category;
        this.name = name;
        this.time = time;
    }



//    @Column(nullable = false, length = 1, columnDefinition = "CHAR(1)")
//    private String delYn;
}
