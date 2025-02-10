package com.c108.springproject.recipe.domain;

import com.c108.springproject.user.domain.User;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "recipelike")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeLike {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long likeNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_no")
    private Recipe recipe;

    @Column(updatable = false)
    private String createdAt;
}
