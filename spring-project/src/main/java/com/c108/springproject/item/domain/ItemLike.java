package com.c108.springproject.item.domain;

import com.c108.springproject.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "itemlike")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemLike {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long likeNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_no")
    private Item item;

    @Column(updatable = false)
    private String createdAt;

}
